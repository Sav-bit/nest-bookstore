import { AuthorRepository } from "../../src/modules/author/author.repository"
import { Test, TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "../../src/db-connector/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/client";
import { NullPointerException } from "../../src/exception-filter/nullpointer.exception";
import { ForbiddenException } from "../../src/exception-filter/forbidden.exception"

/**
 *In this unit test, I am testing the AuthorRepository class. Specifically, I want to ensure that it behaves correctly in the following methods: update and remove, as the find method is tested in the AuthorService unit test.
 *
 * What I want to make sure of is that:
 * ***********************************
 * For removal:
 * 
 * If an author does not exist, the repository catches the PrimaClientKnownException and understands that it is an author that does not exist, and a NullPointerException is thrown.
 * If an author has books associated with them, the repository catches the PrismaClientKnownException and understands that the removal was not successful because the author has books registered in the system.
 * ************************************
 * For the update:
 * 
 * If an author does not exist, the repository catches the PrimaClientKnownException and understands that it is an author that does not exist, and a NullPointerException is thrown.
 * 
 * The rest of the methods are calls to the Prisma library, which can be avoided for this demo. 
 * 
 * Unfortunately, I had to use the "ts-ignore" tag because it caused issues with the circular dependency between Author and Book. However, for the purpose of the test, it's not a problem, as the focus is on the correct functioning of the class methods.
 * Within each "describe" block, mockup methods for update and deletion are mapped to mimic the behavior of Prisma, while the operations are performed within the "fake database" called mockedAuthors.
 * 
 * 
 */

describe(`Auhtor repository`, ()=> {
    let repository : AuthorRepository;
    let prismaService : DeepMockProxy<PrismaClient>;

    let mockedAuthors = [{
        id : 1,
        name : `some name 1`,
        bio : `some Bio 1`
    },
    {
        id : 2,
        name : `some name 2`,
        bio : `some Bio 2`
    },
    {
        id: 3,
        name : `author with books`,
        bio : null,
        books : [ {
            id : 1,
        }]
    }
    ]

    beforeEach(async () => {
        const module : TestingModule = await Test.createTestingModule({
            providers : [AuthorRepository, PrismaService]
        })
        .overrideProvider(PrismaService)
        .useValue(mockDeep<PrismaClient>())
        .compile()

        repository = await module.get(AuthorRepository);
        prismaService = await module.get(PrismaService);
    });

    describe(`update author`, () => {

        /**
         * mocking of the prima method update
         */
        beforeEach(async () => {
            //@ts-ignore
            prismaService.author.update.mockImplementation(async (args)=>{
                let existingAuthor = mockedAuthors.find(e => e.id === args.where.id)

                if(existingAuthor == null)
                    throw new PrismaClientKnownRequestError("some-error", {code: PrismaService.prismaRecordNotFoundCode, clientVersion: "some-client-version"})

                existingAuthor.name = args.data.name.toString()
                existingAuthor.bio = args.data.bio.toString()

                return existingAuthor;
            })
        })
    
        it(`should update the author if the author is present`, async () => {

            let authorWithNewInfo =  {
                name : "brand-new-name",
                bio: "brand-new-bio"
            }

            let idToUpdate = 1

            expect(await repository.update(idToUpdate,authorWithNewInfo)).toStrictEqual({id : idToUpdate, name : authorWithNewInfo.name, bio: authorWithNewInfo.bio})

        })

        it(`Should throw a nullpointerException if the author is not present`, async () => {
            
            try {
                await repository.update(9999, {name : "some data", bio:"some bio"})
                throw Error(`The nullpointer wasn't caught!`)
            }catch(err){
                expect(err).toBeInstanceOf(NullPointerException);
            }
            
        }) 
    })

    describe(`delete author`, () => {

        /**
         * mocking of the prima method update
         */
        beforeEach( () => {
            //@ts-ignore
            prismaService.author.delete.mockImplementation( async (args) => {
                let idToRemove = args.where.id

                let authorIndex = mockedAuthors.findIndex(e => e.id === idToRemove)

                if(authorIndex === -1)
                    throw new PrismaClientKnownRequestError("some-error", {code: PrismaService.prismaRecordNotFoundCode, clientVersion: "some-client-version"})

                let author = mockedAuthors[authorIndex]

                if(author.books != null)
                    throw new PrismaClientKnownRequestError("some-error", {code: PrismaService.prismaForeignKeyError, clientVersion: "some-client-version"})

                author = mockedAuthors.splice(authorIndex,1)[0];

                return author;
            })
        })

        it(`should remove the author if the author is present`, async () => {
            const oldMockedAuthor = mockedAuthors.slice()

            expect(mockedAuthors).toEqual(oldMockedAuthor)

            let idToRemove = 2

            let removedAuthor = oldMockedAuthor.find(e => e.id===idToRemove);
            
            expect(await repository.remove(idToRemove)).toBe(removedAuthor)

            let mockedAuthorsAfter = oldMockedAuthor.filter(e => e.id !== idToRemove)

            expect(mockedAuthors).toEqual(mockedAuthorsAfter)

        })

        it(`should throw a NullPointerException if the author with the searched id is not present`, async ()=> {
           try{
                expect(await repository.remove(99999))
                throw Error("NullpointerEception wasn't caught!")
            }catch(err){
                expect(err).toBeInstanceOf(NullPointerException)
            }
        })

        it(`should throw a ForbiddenException if in the bookstore there are books published by the author`, async ()=> {
            try{
                 expect(await repository.remove(3))
                 throw Error("ForbiddenException wasn't caught!")
             }catch(err){
                 expect(err).toBeInstanceOf(ForbiddenException)
             }
         })

    })
})