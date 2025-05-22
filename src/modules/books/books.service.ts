import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { S3Service } from 'src/core/storage/s3/s3.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class BooksService {
  constructor(
    private s3: S3Service,
    private Jwt: JwtService,
    private db: DatabaseService
  ) {}
  async create(createBookDto: CreateBookDto, file: Express.Multer.File) {
    const findBook = await this.db.prisma.book.findFirst({
      where: { title: createBookDto.title },
    });
    if (findBook) throw new ConflictException('Book already exists');
    const url = await this.s3.uploadFile(file, 'books');
    const book = await this.db.prisma.book.create({
      data: { ...createBookDto, book_image: url as string },
    });
    const token = await this.Jwt.signAsync({ id: book.id });
    return { book, token };
  }
}
