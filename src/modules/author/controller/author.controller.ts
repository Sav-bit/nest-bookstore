import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query, UseFilters } from "@nestjs/common";
import { AuthorService } from "../author.service";
import { AuthorDTO } from "../dto/author.dto";
import { HttpExceptionFilter } from "../../../exception-filter/exception.filter";
import { ValidationPipe } from "../../../validator/validation.pipe";

@Controller('authors')
@UseFilters(HttpExceptionFilter)
export class AuthorController {
    constructor(private readonly authorService : AuthorService) {}


    @Post()
    create(@Body(ValidationPipe) author: AuthorDTO) {
        return this.authorService.createAuthor(author);
    }

    @Get()
    findAll(@Query("include-books",new DefaultValuePipe(false), ParseBoolPipe) includeBooks? : boolean) {
        return this.authorService.findAllAuthors(includeBooks);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.authorService.findAuthor(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) author: AuthorDTO) {
        return this.authorService.update(id, author);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.authorService.remove(id);
    }

}
