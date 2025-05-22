import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';

@Module({
  imports: [CoreModule, UsersModule, BooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
