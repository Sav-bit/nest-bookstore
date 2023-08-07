import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { BookRepository } from "../../src/modules/book/book.repository"
import { Author, Book, PrismaClient } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../src/db-connector/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BookDTO } from "../../src/modules/book/dto/book.dto";
import { NullPointerException } from "../../src/exception-filter/nullpointer.exception";

/**
 * This is the unit test for the BookRepository class.
 * 
 * As with other repositories, we won't test all the methods that contain just a single call to the Prisma libraries, such as "find[All]". 
 * Instead, we'll focus on the more critical ones: insert, delete, and update (although the latter won't be tested separately as its implementation is very similar to insert).
 * 
 * We will fully test the "getAuthor" method.
 * *******************************************************
 * For the insert method, we want to verify the following:
 * 
 * - The insertion should be successful if the "author" in BookDTO is an integer (associating a new book with an existing author).
 * - The insertion should be successful if the "author" in BookDTO is an instance of AuthorDTO (creating a new author and book together and linking them).
 * - A NullPointerException should be thrown if the "author" is an ID of an author that does not exist in the database.
 * 
 * Note: The validity of BookDTO.author won't be tested here as it is the controller's responsibility (no filters are used for this attribute).
 * *******************************************************
 * For the delete method, we want to verify the following:
 * 
 * - The deletion should be successful if the book is present in the database.
 * - A NullPointerException should be thrown if the ID provided does not belong to any book in the database.
 * 
 */

describe(`book repository`, () => {
    let repository : BookRepository;
    let prismaService : DeepMockProxy<PrismaClient>

    beforeEach(async ()=>{
        const module : TestingModule = await Test.createTestingModule({
            providers : [BookRepository, PrismaService]
        })
        .overrideProvider(PrismaService)
        .useValue(mockDeep<PrismaClient>())
        .compile()

        repository = await module.get(BookRepository);
        prismaService = await module.get(PrismaService)
    });

    let mockedBooksDatabase : Book[] = new Array()
    let mockedAuthors : Author[] = [ 
        {id: 1, name: "test1", bio : null},
        {id: 2, name: "test2", bio: "bio2"},
        {id: 3, name: "test3", bio: null}
    ]

    describe(`insert`, ()=>{


        /**
         * Mocking of the prisma create method
         */
        beforeEach(async ()=>{
            //@ts-ignore
            prismaService.book.create.mockImplementation((args)=>{
                
                const {connect, create, connectOrCreate} = args.data.author

                if(connectOrCreate != null)
                    console.warn(`currently connectOrCreate is not used!`)

                /**
                 * If both connect and create properties are specified, an error will be thrown, but it doesen't matter in the test scenario, so we're not watching for it
                 */
                if(connect != null && create != null)
                    throw new Error(`invalid connection, only one between connect or create should be specified`)

                
                const {title, description, stockCount, publishedYear} = args.data

                let author : Author

                /**
                 * If the connect propery is specified, prisma will connect the book with the author, 
                 * if the author with the specified id doesn't exists a PrismaClientKnownError will be trhown
                 */

                if(connect != null){
                    let authorId = connect.id

                    author = mockedAuthors.find(e => e.id === authorId)

                    if(author == null)
                       throw new PrismaClientKnownRequestError("some-error", {code: PrismaService.prismaRecordNotFoundCode, clientVersion: "some-client-version"})
                       
                }

                /**
                 * If the create property is specified, prisma will create the author first, then it will connect to the new book with him
                 */

                if(create != null){
                    let {name, bio} = create
                    
                    author = {
                        id : (mockedAuthors.length + 1),
                        name,
                        bio, 
                    }

                    mockedAuthors.push(author)
                }


                let newBook : Book = {
                    id : (mockedBooksDatabase.length + 1),
                    title,
                    description,
                    stockCount,
                    publishedYear,
                    authorId : author.id
                }

                mockedBooksDatabase.push(newBook)
                
                return newBook
            })
        })

        it(`should create a book if the author already exist`, async () =>{

            let newBook : BookDTO = {
                title : "test-title",
                description : "description",
                publishedYear : 1990,
                stockCount : 10,
                author : 1
            }

            let databaseBeforeInsert = mockedBooksDatabase.slice();

            //the two databases are the same?
            expect(mockedBooksDatabase).toEqual(databaseBeforeInsert)

            const expectedBook : Book = {
                id : (mockedBooksDatabase.length + 1),
                title : newBook.title,
                description : newBook.description,
                publishedYear : newBook.publishedYear,
                stockCount: newBook.stockCount,
                authorId : Number(newBook.author)
            }

            //the insert operation return the book just created?
            expect(await repository.insert(newBook)).toStrictEqual(expectedBook)

            //After the insertion operation the database state is the same as before, with the addition of the new book?
            expect(mockedBooksDatabase).toEqual([...databaseBeforeInsert,expectedBook])

        })


        it(`should create a book and his author if the author field in the book dto is an authorDTO`, async ()=>{
            let newBook : BookDTO = {
                title : "test-title",
                description : "description",
                publishedYear : 1990,
                stockCount : 10,
                author : {name : "brand-new-test-author"}
            }

            let databaseBeforeInsert = mockedBooksDatabase.slice();
            
            //the two databases are the same?
            expect(mockedBooksDatabase).toEqual(databaseBeforeInsert)

            const expectedBook : Book = {
                id : (mockedBooksDatabase.length + 1),
                title : newBook.title,
                description : newBook.description,
                publishedYear : newBook.publishedYear,
                stockCount: newBook.stockCount,
                authorId : (mockedAuthors.length + 1)
            }

            //the insert operation return the book just created?
            expect(await repository.insert(newBook)).toStrictEqual(expectedBook)

            //After the insertion operation the database state is the same as before, with the addition of the new book?
            expect(mockedBooksDatabase).toEqual([...databaseBeforeInsert, expectedBook])
        })

        it(`should throw a NullPointerException if the author with the inserted id is not present `, async ()=>{
            let newBook : BookDTO = {
                title : "test-title",
                description : "description",
                publishedYear : 1990,
                stockCount : 10,
                author : 999999999999
            }

            try{
                await repository.insert(newBook);
                throw Error(`NullPointerException not thrown`)
            }catch(err){
                expect(err).toBeInstanceOf(NullPointerException)
            }
        })
    })


    describe(`remove`, ()=>{
        beforeEach(() => {
            //@ts-ignore
            prismaService.book.delete.mockImplementation( (args) => {
                let id = args.where.id
                
                let indexOfBook = mockedBooksDatabase.findIndex(e => e.id === id)

                if(indexOfBook === -1)
                    throw new PrismaClientKnownRequestError("some-error", {code: PrismaService.prismaRecordNotFoundCode, clientVersion: "some-client-version"})

                return mockedBooksDatabase.splice(indexOfBook)[0]
            })
        })

        it(`should remove the element correctly if the element is present`, async () => {
            if(mockedBooksDatabase.length === 0)
                mockedBooksDatabase.push({
                    id : (mockedBooksDatabase.length + 1),
                    title : "sampleBook",
                    description : null,
                    publishedYear : 1900,
                    stockCount: 10,
                    authorId : (mockedAuthors.length)
                })
            
            let oldDatabase = mockedBooksDatabase.slice()

            expect(oldDatabase).toEqual(mockedBooksDatabase)

            //the id of the last element is the lenght of the array, since the id:1 is at 0. id:2 is at 1 etc etc
            let idToRemove = mockedBooksDatabase.length

            expect(await repository.remove(idToRemove)).toStrictEqual(oldDatabase[idToRemove-1])

            expect(mockedBooksDatabase).toEqual(oldDatabase.filter(e => e.id !== idToRemove))
        })

        it(`should throw a NullPointerException if the book with the passed id is not present`, async ()=> {
            try {
                await repository.remove(99999999);  
                throw new Error(`NullPointerException wasn't thrown`) 
            }catch (error) {
                expect(error).toBeInstanceOf(NullPointerException)
            }
        })
    })

})