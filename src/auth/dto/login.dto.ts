import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    example: 'admin@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: '3663',
  })
  password: string;
}
