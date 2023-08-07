import { AuthorService } from "../../src/modules/author/author.service";
import { DeepMockProxy, mockDeep} from 'jest-mock-extended';
import { Test, TestingModule } from "@nestjs/testing";
import { AuthorRepository } from "../../src/modules/author/author.repository";
import { NullPointerException } from "../../src/exception-filter/nullpointer.exception";

/**
 * Here's the unit test for the AuthorService
 * 
 * Since I'm using the repository pattern (in case someday the ORM is changed from Prisma to something else)
 * 
 * the methods:
 *      -createAuthor
 *      -findAllAuthors
 *      -remove
 *      -update
 * 
 * are just a call to the repository layer, so, their behavior is tested inside author.repository.spec.ts
 * 
 * so what i want to test here is two thing:
 * 
 * a) that when i search for an author the service will return that author
 * b) that if an author doesn't exist the service will throw a nullpointer exception
 * 
 */



describe(`Author service`, ()=> {
    let service : AuthorService;
    let repository : DeepMockProxy<AuthorRepository>;
    let mockedAuthors = [{
        id : 1,
        name : `some name 1`,
        bio : `some Bio 1`
    },
    {
        id : 2,
        name : `some name 2`,
        bio : `some Bio 2`
    } ]

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers : [AuthorService, AuthorRepository],
        })
        .overrideProvider(AuthorRepository)
        .useValue(mockDeep<AuthorRepository>())
        .compile();

        service = module.get(AuthorService);
        repository = module.get(AuthorRepository)
    });

    describe('findAuthor', () => {

        beforeEach(async () => {
            repository.find.mockImplementation( async (searchedId : number) => {
                return mockedAuthors.find(e => e.id === searchedId)
            })
        });
         
        it(`should return the searched author`, async () => {
            await expect(service.findAuthor(2)).resolves.toBe(mockedAuthors[1]);
        });

        it(`should throw a NullPointerException if the author doesn't exists`, async () => {
            // This one does not work 
            //    expect(await service.findAuthor(1200)).toThrow(NullPointerException);
            
            try{
                await service.findAuthor(1200)
                throw Error(`The nullpointer wan't caught!`)
            }catch(err){
                expect(err).toBeInstanceOf(NullPointerException);
            }

        })
    
    });
        

})