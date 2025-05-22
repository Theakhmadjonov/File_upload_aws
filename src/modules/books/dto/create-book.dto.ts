import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  price: number;
  @IsNumber()
  page: number;
  @IsString()
  book_date: string;
}
