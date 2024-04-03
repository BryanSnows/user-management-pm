import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  new_password: string;
}
