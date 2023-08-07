import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookDTO } from './dto/book.dto';
import { NullPointerException } from '../../exception-filter/nullpointer.exception';
import { AuthorService } from '../author/author.service';

@Injectable()
export class BookService {
    constructor(private repository : BookRepository){}

    /**
     * Method to create a new book
     * 
     * this method checks for validity of the fields
     * 
     * With this method, it is possible to associate the new book with an existing author or create a new author and then link them.
     * 
     * For example, if the property "BookDTO.author" is an integer, that integer will represent the ID of the existing author, and the new book will be linked to that author.
     * If, on the other hand, the property "BookDTO.author" is an AuthorDTO object, that object will represent the new author that you want to create. It will be created and then associated with the new book.
     * 
     * @throws SyntaxError if the fields are not valid, to more info look checkValidity
     * 
     * @param book a BookDTO containing the info of the new book 
     * @returns the new created book
     * 
     */
    async createBook( book : BookDTO){
        this.checkValidity(book);
        const newBook = await this.repository.insert(book);
        return newBook;
    }
    
    /**
     * Method to get all books
     * 
     * @param includeAuthor if set to true, the books will also have the detail of the author
     * @returns list of all authors
     */
    async getAllBooks(includeAuthor? : boolean) {
        return this.repository.findAll(includeAuthor);
    }
    
    /**
     * Method to find a specific book by its id
     * 
     * @param id id of the searched book
     * @throws NullPointerException if the book is not present
     * @returns the searchedBook
     */
    async findOne(id : number){
        const book = await this.repository.find(id);
        if(book == null)
            throw new NullPointerException(`the book with id : ${id} does not exist`);
        return book;
    }
    
    /**
     * Method to update a book
     * 
     * this method checks for validity of the fields
     * 
     * Through this method, it is possible to associate the updated book with an existing author or create a new author and then link them.
     * 
     * For example, if the property "BookDTO.author" is an integer, that integer will represent the ID of the existing author, and the updated book will be linked to that author.
     * If, on the other hand, the property "BookDTO.author" is an AuthorDTO object, that object will represent the new author that you want to create. It will be created and then associated with the updated book.
     * 
     * @throws SyntaxError if the fields are not valid, to more info look checkValidity
     * 
     * @param id of the book we want to update
     * @param updateBookDto a BookDTO containing the info to update the book 
     * @returns the updated book
     */
    async update(id : number, updateBookDto: BookDTO){
        this.checkValidity(updateBookDto)
        return this.repository.update(id, updateBookDto);
    }
    
    /**
     * Method to remove an author by its id
     * 
     * @param id of the book we want to remove
     * @returns the removed book
     */
    async remove(id: number){
        return this.repository.remove(id);
    }
    
    /***********************Utilities***************************/
    
    /**
     * This method check for validity before creating or updating a book
     * 
     * We can create/insert a book if:
     * -The book is not published in the future
     * -The stock count is at least 0
     * -The author's name is not an empty string or just whitespaces
     * -The book's title is not an empty string or just whitespaces
     * 
     * if these two conditions are not met a SyntaxError is raised
     * 
     * @throws SyntaxError if the data inside book are invalid
     * 
     * @param book the book whose data I want to check for validity 
     */
    private checkValidity(book: BookDTO) {
        
        if((book.publishedYear != null)){
            if (book.publishedYear > new Date().getFullYear())
                throw new SyntaxError("The book can't be published on the future!");
            if(!Number.isInteger(book.publishedYear))
                throw new SyntaxError("The published year must be a year in the format yyyy")
        }
        
        if (!Number.isInteger(book.publishedYear) || book.stockCount < 0)
            throw new SyntaxError("The stock count must be an integer number greater than 0!");

        if(typeof book.author !== "number"){
            AuthorService.formatAuthorName(book.author);
        }

        BookService.formatBookTitle(book)
    }

    /**
     * Method to format the title of the book by trimming the whitespaces from the start and the end of it
     * 
     * @throws SyntaxError if the title is empty/only whitespaces character
     * 
     * @param book - book we want to format 
     */
    static formatBookTitle(book : BookDTO) : void {
        book.title = book.title.trim()
        if(book.title.length === 0)
            throw new SyntaxError(`The book's title can't be an empty value!`)
    }
}
