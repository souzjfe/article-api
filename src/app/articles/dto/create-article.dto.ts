import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    example: 'My First Article',
    description: 'The title of the article',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: { text: 'This is the content of the article...' },
    description: 'The content of the article',
  })
  @IsObject()
  @IsNotEmpty()
  content: Record<string, unknown>;
}
