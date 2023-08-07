import { Allow, IsInt, IsOptional, IsString } from "class-validator";
import { AuthorDTO } from "../../../modules/author/dto/author.dto";

export class BookDTO {
    @IsString()
    title: string;
    @IsString()
    @IsOptional()
    description?: string;
    @IsInt()
    @IsOptional()
    publishedYear?: number;
    @IsInt()
    @IsOptional()
    stockCount?: number;

    /**
     * This one is not mapped because i like that i can create an author when i create a book!
    */
    @Allow()
    author : number | AuthorDTO;
}
