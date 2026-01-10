export interface IOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const pagenation = (options: IOptions) => {
  const page = options.page ? Number(options.page) : 1;
  const limit = options.limit ? Number(options.limit) : 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc'; // Change this line
  return { page, limit, skip, sortBy, sortOrder };
};

export default pagenation;
