import { Module } from '@nestjs/common';
import { BookModule } from './modules/book/book.module';
import { AuthorModule } from './modules/author/author.module';
import { AuthorController } from './modules/author/controller/author.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { AuthorResolver } from './modules/author/resolver/author.resolver';
import { BookController } from './modules/book/controller/book.controller';
import { BookResolver } from './modules/book/resolver/book.resolver';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      formatError: (error: GraphQLError) => {
        const {message, locations, path} = error

        const graphQLFormattedError: GraphQLFormattedError = {
          message, locations, path
        };
        return graphQLFormattedError;
      }
    }),
    BookModule, AuthorModule],
  controllers: [BookController, AuthorController],
  providers : [BookResolver, AuthorResolver]
})
export class AppModule {}
