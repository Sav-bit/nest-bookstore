import { Module } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { PrismaModule } from '../../db-connector/prisma.module';
import { BookService } from './book.service';

@Module({
    imports: [PrismaModule],
    providers : [BookRepository, BookService],
    exports: [BookService],
})
export class BookModule {}
