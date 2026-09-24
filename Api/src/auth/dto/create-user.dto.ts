import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username only can have alphabet(a-z), numbers, and _ ',
  })
  @Length(4, 10, {
    message: 'The username must be between 4 and 10 characters long. ',
  })
  username: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty()
  @IsStrongPassword(
    {},
    {
      message:
        'Password is too weak. Must be 8+ chars with 1 uppercase, 1 lowercase, 1 numbers and 1 symbol.',
    },
  )
  @MaxLength(12, {
    message: 'Password must be less than 12 characters',
  })
  password: string;
}
