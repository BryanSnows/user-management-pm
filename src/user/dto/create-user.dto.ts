import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  user_name: string;

  @ApiProperty()
  user_email: string;

  @ApiProperty()
  profile_id: number;

  @ApiProperty()
  user_password: string;
}
