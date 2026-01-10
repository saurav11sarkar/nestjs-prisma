/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty() // Changed from @IsEmpty()
  name: string; // This should be name, not email

  @IsEmail()
  @IsNotEmpty() // Add this
  email: string; // This should be email, not name
}
