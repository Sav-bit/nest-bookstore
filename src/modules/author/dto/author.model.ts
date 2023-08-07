import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Book, BookLight } from "../../book/dto/book.model";

@ObjectType()
export class AuthorLight {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    bio?: string;
}

@ObjectType()
export class Author extends AuthorLight{

    @Field(()=> [BookLight], {nullable : true})
    publishedBooks : [BookLight]

}