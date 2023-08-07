import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { BookService } from "../../src/modules/book/book.service"
import { BookRepository } from "../../src/modules/book/book.repository"
import { Test, TestingModule } from "@nestjs/testing"
import { Book } from "@prisma/client"
import { NullPointerException } from "../../src/exception-filter/nullpointer.exception"

/**
 * This is the unit test for the BookService class.
 * 
 * As with other test classess, we won't test all the methods that contain just a single call to the Prisma libraries, 
 * such as "findAll and remove", but we will focus on the more critical ones: createBook, findOne, and update.
 * 
 * Update won't be tested, as its implementation is similar to create, and the method checkValidity is already tested with the first.
 * 
 * For createBook, we want to ensure that:
 * ***************************************
 * - The book is created correctly if the fields are valid.
 * - A SyntaxError is thrown if the publication year is in the future compared to the current year.
 * - A SyntaxError is thrown if the stockCount is a negative number.
 * 
 * For findOne, we want to ensure that:
 * ************************************
 * - A NullPointerException is thrown if the searched book does not exist.
 */

describe(`Book service`, () => {
    let bookService : BookService
    let bookRepository : DeepMockProxy<BookRepository>

    beforeEach(async () => {
        const module : TestingModule = await Test.createTestingModule({
            providers : [BookService, BookRepository]
        })
        .overrideProvider(BookRepository)
        .useValue(mockDeep<BookRepository>())
        .compile()

        bookService = await module.get(BookService)
        bookRepository = await module.get(BookRepository)
    })

    describe(`create book`, ()=> {

        it(`should create the book correctly if the field are valid`, async () => {

            const book : Book = {
                id : 1,
                title : "sample",
                description : null,
                publishedYear : 1990,
                stockCount : 10,
                authorId : 1
            }

            bookRepository.insert.mockResolvedValue(book)

            expect(await bookService.createBook({
                title : book.title,
                description : book.description,
                publishedYear : book.publishedYear,
                stockCount : book.stockCount,
                author : book.authorId
            })).toStrictEqual(book)
        })
        
        it(`should reject the creation of the book is the publishedYear is greater than the current year`, async () => {
            const book : Book = {
                id : 1,
                title : "sample",
                description : null,
                publishedYear : new Date().getFullYear() + 1,
                stockCount : 10,
                authorId : 1
            }
            
            bookRepository.insert.mockResolvedValue(book)
            
            try {
                await bookService.createBook({
                    title : book.title,
                    description : book.description,
                    publishedYear : book.publishedYear,
                    stockCount : book.stockCount,
                    author : book.authorId
                })
                throw new Error(`Syntax error not thrown`)
            }catch(error){
                expect(error).toBeInstanceOf(SyntaxError)
            }
        })
        
        it(`should reject the creation of the book if the stockCount is a negative number`, async () => {
            const book : Book = {
                id : 1,
                title : "sample",
                description : null,
                publishedYear : 1990,
                stockCount : -10,
                authorId : 1
            }
            
            bookRepository.insert.mockResolvedValue(book)
            
            try {
                await bookService.createBook({
                    title : book.title,
                    description : book.description,
                    publishedYear : book.publishedYear,
                    stockCount : book.stockCount,
                    author : book.authorId
                })
                throw new Error(`Syntax error not thrown`)
            }catch(error){
                expect(error).toBeInstanceOf(SyntaxError)
            }
        })        
    })

    describe(`findOne`, () => {
        it(`should throw a NullPointerException if the book with the searched ID does not exist`, async () => {
            bookRepository.find.mockResolvedValue(null);

            try{
                await bookService.findOne(21)
                throw new Error(`NullPointerException was not thrown`)
            }catch(error){
                expect(error).toBeInstanceOf(NullPointerException)
            }
        })
    })
})