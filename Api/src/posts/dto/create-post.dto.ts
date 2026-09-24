import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";


export class CreatePostDto {
  @IsString()
  @ApiPropertyOptional()
  @Length(0, 200, { message: 'The text post must be less than 200 characters' })
  text: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'The file to upload' })
  image: any;
}
