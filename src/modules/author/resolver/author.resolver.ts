import { Resolver, Query, Int, Args, Mutation} from "@nestjs/graphql";
import { AuthorService } from "../author.service";
import { Author } from "../dto/author.model";
import { AuthorDTO } from "../dto/author.dto";


@Resolver()
export class AuthorResolver{
    constructor(private readonly authorService: AuthorService){}

    @Query(()=> [Author])
    async getAuthors(){
        return this.authorService.findAllAuthors(true);
    }

    @Query(() => Author)
    async findAuthor(@Args({name : "id", type: ()=> Int}) id: number){
        return this.authorService.findAuthor(id);
    }

    @Mutation(()=> Author)
    async createAuthor(@Args("newAuthor") newAuthor : AuthorDTO){
        return this.authorService.createAuthor(newAuthor);
    }

    @Mutation(()=> Author)
    async updateAuthor(@Args({name : "id", type: ()=> Int}) id : number, @Args("updatedAuthor") updatedAuthor : AuthorDTO){
        return this.authorService.update(id,updatedAuthor)
    }

    @Mutation(()=> Author)
    async removeAuthor(@Args({name : "id", type: ()=> Int}) id : number){
        return this.authorService.remove(id);
    }

}