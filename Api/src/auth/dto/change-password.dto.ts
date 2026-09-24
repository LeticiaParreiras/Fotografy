import { IsString, IsStrongPassword, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class changePasswordDto{
    @ApiProperty()
    @IsString()
    currentPassword: string

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
    newPassword: string
}