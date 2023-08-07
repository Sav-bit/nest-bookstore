import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BookService } from "./../book.service";
import { Book, CreateBook} from "./../dto/book.model";

@Resolver()
export class BookResolver {
    constructor( private readonly bookService: BookService){}

    @Query(() => [Book])
    async getBooks(){
        return this.bookService.getAllBooks(true);
    }

    @Query(() => Book)
    async findBook(@Args({name : "id", type: ()=> Int}) id : number){
        return this.bookService.findOne(id);
    }

    @Mutation(() => Book)
    async createBook(@Args("newBook") newBook : CreateBook){
        return this.bookService.createBook(newBook)
    }

    @Mutation(() => Book)
    async removeBook(@Args({name : "id", type: ()=> Int}) id : number){
        return this.bookService.remove(id)
    }

    @Mutation(() => Book)
    async updateBook(@Args({name : "id", type: ()=> Int}) id : number,@ Args("updatedBook") updatedBook : CreateBook){
        return this.bookService.update(id,updatedBook)
    }
}