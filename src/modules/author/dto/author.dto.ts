import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class AuthorDTO {
    
    //Graphql decorator
    @Field()
    //Validator decorator
    @IsString()
    @IsNotEmpty()
    name : string;
    
    //Graphql decorator
    @Field({nullable : true})
    //Validator decorator
    @IsString()
    @IsOptional()
    bio? : string;
}