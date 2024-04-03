import { ApiProperty } from '@nestjs/swagger';

export class DashFilterUser {
  @ApiProperty({ required: false })
  user_status: number;
}
