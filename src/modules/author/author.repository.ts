import { Injectable } from "@nestjs/common";
import { AuthorDTO } from "./dto/author.dto";
import { Author, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "../../db-connector/prisma.service";
import { NullPointerException } from "../../exception-filter/nullpointer.exception";
import { ForbiddenException } from "../../exception-filter/forbidden.exception";

@Injectable()
export class AuthorRepository {
    constructor(private prisma : PrismaService) {}

    async insert (author : AuthorDTO) : Promise<Author> {
       const data : Prisma.AuthorCreateInput = author;
       return this.prisma.author.create( { data } );
    }

    async find (id : number) : Promise<Author>{
        return await this.prisma.author.findUnique({ where : {id : id}, include: { publishedBooks : true}});
    }

    async findAll( includePublishedBooks? : boolean) : Promise<Author[]>{
        return this.prisma.author.findMany({include : {publishedBooks: includePublishedBooks}});
    }

    async remove(id : number) : Promise<Author> {
        try{
            return await this.prisma.author.delete({where : { id : id}})
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if (e.code === PrismaService.prismaRecordNotFoundCode)
                    throw new NullPointerException(`The author with id: ${id} does not exist`)
                if( e.code === PrismaService.prismaForeignKeyError){
                    throw new ForbiddenException(`You can't delete an author if in the bookstore there are books published by him`);
                }
            }
            throw e
        }
    }

    async update(id : number , author : AuthorDTO) : Promise<Author> {
        try{
            return await this.prisma.author.update({
                data: author,
                where: {id : id},
            });
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if (e.code === PrismaService.prismaRecordNotFoundCode)
                    throw new NullPointerException(`The author with id: ${id} does not exist`)
            }
            throw e
        }
    }
}