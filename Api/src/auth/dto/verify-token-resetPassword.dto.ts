import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Length } from "class-validator"

export class  VerifyTokenResetPasswordDto{
    @IsString()
    @ApiProperty()
    @Length(4)
    token: string
    
    @ApiProperty()
    @IsEmail()
    email: string

}