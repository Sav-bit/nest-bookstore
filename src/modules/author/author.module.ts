import { Module } from '@nestjs/common';
import { AuthorRepository } from './author.repository';
import { PrismaModule } from '../../db-connector/prisma.module';
import { AuthorService } from './author.service';

@Module({
    imports: [PrismaModule],
    providers : [AuthorRepository, AuthorService],
    exports : [AuthorService],
})
export class AuthorModule {}
