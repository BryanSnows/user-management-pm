import { ApiProperty } from '@nestjs/swagger';

export class FirstAccessDto {
  @ApiProperty()
  current_password: string;

  @ApiProperty()
  new_password: string;

  @ApiProperty()
  confirmation_password: string;
}
