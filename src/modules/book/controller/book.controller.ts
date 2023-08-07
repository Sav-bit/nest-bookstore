import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, UseFilters, ParseIntPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../exception-filter/exception.filter';
import { BookService } from '../book.service';
import { ValidationPipe } from '../../../validator/validation.pipe';
import { BookDTO } from '../dto/book.dto';
import { AuthorDTO } from '../../../modules/author/dto/author.dto';



@Controller('books')
@UseFilters(HttpExceptionFilter)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body(ValidationPipe) createBookDto: BookDTO) {
    this.checkIfAuthorIsCorrectFormat(createBookDto)
    return await this.bookService.createBook(createBookDto);
  }
  
  @Get()
  findAll() {
    return this.bookService.getAllBooks();
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }
  
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateBookDto: BookDTO) {
    this.checkIfAuthorIsCorrectFormat(updateBookDto)
    return this.bookService.update(id, updateBookDto);
  }
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
  
  private checkIfAuthorIsCorrectFormat(book: BookDTO) {
    if(book.author == null || !(Number.isInteger(book.author) || ((book.author as AuthorDTO).name != null)))
      throw new SyntaxError(`The field author must be the id of the author or an object like {"name" : $nameOfTheAuthor , "bio" : $bioOfTheAuthor}`);
  }
}
