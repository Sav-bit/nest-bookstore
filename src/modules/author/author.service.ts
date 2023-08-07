import { Injectable } from "@nestjs/common";
import { AuthorRepository } from "./author.repository";
import { Author } from "@prisma/client";
import { AuthorDTO } from "./dto/author.dto";
import { NullPointerException } from "../../exception-filter/nullpointer.exception";

@Injectable()
export class AuthorService {
    constructor(private repository : AuthorRepository){}

    async createAuthor(newAuthor : AuthorDTO) : Promise<Author> {
        AuthorService.formatAuthorName(newAuthor);
        return this.repository.insert(newAuthor);
    }

    /**
     * method to search for an author by its id
     * 
     * @param id 
     * @returns the searched author
     * @throws NullPointerException if the author with the searched id doesn't exist
     */
    async findAuthor(id : number) : Promise<Author> {
        const author = await this.repository.find(id);
        if(author == null)
           throw new NullPointerException(`The author with id: ${id} does not exist`);
        return author
    }

    /**
     * Method to find all authors
     * 
     * @param includePublishedBooks if true, in the object returns also the list of published book of the author 
     * @returns list of all authors
     */
    async findAllAuthors(includePublishedBooks? : boolean) : Promise<Author[]>{
        return this.repository.findAll(includePublishedBooks);
    }

    /**
     * Method to remove an author by its id
     * 
     * @param id id of the author 
     * @returns the removed author
     */
    async remove(id:number): Promise<Author> {
        return this.repository.remove(id);
    }

    /**
     * Method to update an author by its id 
     * 
     * @param id id of the author
     * @param author the updated data, if a field is null then is overwritten
     * @returns the updated author
     * @throws NullPointerException if the author with the searched id doesn't exist
     */
    async update(id:number, author: AuthorDTO){
        AuthorService.formatAuthorName(author);
        return this.repository.update(id,author);
    }

    /**
     * Method to format the name of the author by trimming the whitespaces from the start and the end of it
     * 
     * @throws SyntaxError if the name is empty/only whitespaces character
     * 
     * @param author - author we want to formats
     */
    static formatAuthorName(author : AuthorDTO) : void{
        author.name = author.name.trim()
        if(author.name.length === 0)
            throw new SyntaxError(`The author's name can't be an empty value!`)
    }

}