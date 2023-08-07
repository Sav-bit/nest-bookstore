import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { AuthorLight } from "../../author/dto/author.model";


@InputType()
export class CreateBook{
    @Field()
    title: string;
    @Field({nullable : true})
    description?: string;
    @Field(() => Int, {nullable : true})
    publishedYear?: number;
    @Field(() => Int, {defaultValue: 0})
    stockCount?: number;
    @Field(()=> Int)
    author: number;
}

@ObjectType()
export class BookLight {
    @Field(() => Int)
    id: number

    @Field(() => String)
    title : string

    @Field(()=> String, { nullable: true })
    description? : string

    @Field(()=> Int, { nullable: true })
    publishedYear? : number

    @Field(()=> Int)
    stockCount : number
    
    @Field(()=> Int)
    authorId : number
}

@ObjectType()
export class Book extends BookLight{

    @Field(()=> AuthorLight)
    author : AuthorLight
}
