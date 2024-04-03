import { ApiProperty } from '@nestjs/swagger';
import { FilterPagination } from 'src/shared/filter.pagination';

export class FilterUser extends FilterPagination {
  @ApiProperty({ required: false })
  search_name: string;

  @ApiProperty({ required: false, default: 'NAME', enum: ['NAME'] })
  orderBy: string;

  @ApiProperty({ required: false })
  user_status: number;
}
