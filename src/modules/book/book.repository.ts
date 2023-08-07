import { Injectable } from "@nestjs/common";
import { Book, Prisma } from "@prisma/client";
import { BookDTO } from "./dto/book.dto";
import { PrismaService } from "../../db-connector/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NullPointerException } from "../../exception-filter/nullpointer.exception";

@Injectable()
export class BookRepository {
    constructor(private prisma : PrismaService) {}

    async insert( book : BookDTO) : Promise<Book>{

        let authorConenction = this.getAuthor(book)

        const data : Prisma.BookCreateInput = {
            title: book.title,
            description: book.description?? null,
            stockCount: book.stockCount?? 0,
            publishedYear: book.publishedYear,
            author: authorConenction 
        }

        try{
            return await this.prisma.book.create({data});
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if (e.code === PrismaService.prismaRecordNotFoundCode)
                    throw new NullPointerException(`The author with id: ${book.author} does not exist`)
                }
            throw e
        }
    }

    async find(id: number) : Promise<Book> {
       return this.prisma.book.findUnique({
           where: {id : id},
           include: { author : true}
       });
    }

    async findAll(incldueAuthor? : boolean) : Promise<Book[]> {
        return this.prisma.book.findMany({ include: {author : incldueAuthor} });
    }

    async update(id : number, bookUpdated: BookDTO): Promise<Book> {
        
        let authorConenction = this.getAuthor(bookUpdated);

        const data : Prisma.BookUpdateInput = {
            title: bookUpdated.title,
            description: bookUpdated.description?? null,
            stockCount: bookUpdated.stockCount?? 0,
            publishedYear: bookUpdated.publishedYear,
            author: authorConenction 
        }
        
        try{
            return await this.prisma.book.update({
                data: data,
                where: {id : id}
            });
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if (e.code === PrismaService.prismaRecordNotFoundCode){
                    let optionalcause = ''
                    if(Number.isInteger(bookUpdated.author)){
                        optionalcause = ` or the author with id: ${bookUpdated.author}`
                    }
                    throw new NullPointerException(`The book with id: ${id}${optionalcause} does not exist`)
                }
            }
            throw e
        }
    }
    

    async remove(id:  number) : Promise<Book>{
        try{
            return await this.prisma.book.delete({where : {id}});
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if (e.code === PrismaService.prismaRecordNotFoundCode)
                    throw new NullPointerException(`The book with id: ${id} does not exist`)              
            }
            throw e
        }
    }

    
    /**
     * Method to get the connection with the author for the book
     * 
     * If the author is an ID, then it returns the connection to the existing author
     * 
     * if the author is a name and a bio, then it return the creation
     * @param book 
     * @returns 
     */
    private getAuthor(book: BookDTO) {
        let authorConenction : Prisma.AuthorCreateNestedOneWithoutPublishedBooksInput;

        if (typeof book.author === "number") {
            let authorId = book.author;
            authorConenction = {
                connect: { id: Number(authorId) }
            };
        } else {
            const { name, bio } = book.author;
            authorConenction = {
                create: { name, bio }
            };
        }
        return authorConenction;
    }


}