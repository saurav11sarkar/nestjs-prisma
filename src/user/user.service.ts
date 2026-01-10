import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import pagenation, { IOptions } from 'src/helper/pagenation';
import { Prisma } from 'generated/prisma/client';

interface FilterParams {
  searchTerm?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const user = this.prisma.user.create({ data: createUserDto });
    return user;
  }

  async findAll(params: FilterParams, options: IOptions) {
    const { page, limit, skip, sortBy, sortOrder } = pagenation(options);
    const { searchTerm, ...filterdata } = params;
    const andCondition: Prisma.UserWhereInput[] = [];
    const searchableFields: (keyof Prisma.UserWhereInput)[] = ['email', 'name'];

    if (searchTerm) {
      andCondition.push({
        OR: searchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        })),
      });
    }

    if (Object.keys(filterdata).length) {
      andCondition.push({
        AND: Object.entries(filterdata).map(([field, value]) => ({
          [field]: value as string,
        })),
      });
    }

    const whereCondition: Prisma.UserWhereInput =
      andCondition.length > 0 ? { AND: andCondition } : {};

    const [result, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: whereCondition,
      }),
      this.prisma.user.count({ where: whereCondition }),
    ]);

    return {
      data: result,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  findOne(id: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
