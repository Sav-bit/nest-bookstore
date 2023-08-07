import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { BookController } from "../../../src/modules/book/controller/book.controller"
import { BookService } from "../../../src/modules/book/book.service"
import { Test, TestingModule } from "@nestjs/testing"

/**
 * In this test class, I want to test the functionality of the Book controller. we know that :
 * The input validity is covered by pipes (Boolean, Int, and a custom ValidationPipe specifically created).
 * The error handling is covered by filters (HttpExceptionFilter)
 * 
 * Unfortunatley is not possible to test that with unit tests, and if I have time, I would like to test it with end-to-end (e2e) tests.
 * 
 * But for now, I want to check how the controller reacts to the "author" parameter of BookDTO, as it is the only parameter not intercepted by pipes. The expected behavior in the Book controller is as follows:
 * 
 * - If "author" is an integer, it represents the ID of the author, and the book being created will be associated with that author.
 * - If "author" is an instance of AuthorDTO, a new author will be created and then associated with the created book.
 * 
 * - If it is neither of the above cases, a SyntaxError will be thrown. I had to use the "ts-ignore" tag because otherwise, it would have prevented me from testing using "author" with invalid fields.
 */

describe(`book controller`, () => {
    let controller : BookController
    let service : DeepMockProxy<BookService>

    beforeEach(async () => {
        const module : TestingModule = await Test.createTestingModule({
            providers : [BookController,BookService]
        })
        .overrideProvider(BookService)
        .useValue(mockDeep<BookService>())
        .compile()

        controller = await module.get(BookController)
        service = await module.get(BookService)
    })

    describe(`create book`, ()=> {

        const mockedBook = {
            id : 1,
            title : "sample", 
            description: "sampleDescr",
            authorId :1,
            publishedYear : 1990,
            stockCount : 10
        }

        beforeEach( () => {
            service.createBook.mockResolvedValue(mockedBook)
        })
        
        it(`should create correctly a book if the author is in the correct format`, async ()=> {
    
            
            /**
             * Attempting to create a book published by an author already existing in the database
             */

            expect( 
                await controller.create(
                    {
                        title: mockedBook.title,
                        description: mockedBook.description,
                        publishedYear: mockedBook.publishedYear, 
                        stockCount: mockedBook.stockCount, 
                        author: mockedBook.authorId
                    }
                ))
            .toStrictEqual(mockedBook)

            /**
             * Attempting to create a book published by an author who doesn't exist in the database
             * so if the object is an AuthorDTO the service will create an author while creating the book
             */

            expect( 
                await controller.create(
                    {
                        title: mockedBook.title,
                        description: mockedBook.description,
                        publishedYear: mockedBook.publishedYear, 
                        stockCount: mockedBook.stockCount, 
                        author: {
                            name : "some name"
                        }
                    }
                ))
            .toStrictEqual({
                id : 1,
                title : "sample", 
                description: "sampleDescr",
                authorId :1,
                publishedYear : 1990,
                stockCount : 10
            })

        })

        it(`should throw a syntax error if author isn't in the correct format`, async ()=> {
            
            try{
                //Here i'm using the ts-ignore tag because otherwise typescript will prevent me to insert invalid values, and the author field is the only field in the BookDTO which is not checked by the validator
                await controller.create({
                    title: "sample",
                    description: "sampleDescr", 
                    publishedYear: 1990, 
                    stockCount:10, 
                    //@ts-ignore
                    author: {fakefield: "notCorrectAuthor"}
                })
                throw Error(`Syntax error not caught`)
            }catch(err){
                expect(err).toBeInstanceOf(SyntaxError)
            }
        })
        
    })

})