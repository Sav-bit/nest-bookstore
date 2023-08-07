# Nest bookstore

Nest Bookstore is a simple system designed to perform CRUD operations on a library using both **REST API** and **GraphQL API**. It is developed using **NestJS** and utilizes **Prisma** as the ORM to connect to a **MySQL database**.

# Project structure
I know what you're thinking: 

> "Dang, an **introduction**?! How long this guy is planning to write? how can I just see if what he did runs?"

And the answer for that is: *not much* but **you can try the whole thing by launching**

    docker compose up -d
When launching the Docker Compose, the following will be instantiated:

-   The **application** on port 80 so you can just go for `localhost/${resource}`.
-   A **MySQL database** with a sample database inside, and without volumes on the disk. This way, once the test is concluded, it can be removed without any further concerns.

*Note*: The Docker Compose is not production-ready. I just thought it would be more convenient for you to run a single command rather than setting up the database, populating it, and so on.

## Structure
![Simple structure of the project](https://i.imgur.com/MdEzfWU.png)

Since the system's logic revolves solely around CRUD operations, there wasn't much room for creativity:

1.  Users can interact with the system through **REST APIs** or **GraphQL APIs**, and the data is *syntactically* validated by the **validator** (Are the types correct?)
2.  If they are, the data is passed to the resource's service where the *semantics* are checked (Do they make sense? For example, I expect books to be published in the past and stock count to be a positive number!)
3.  Once the data is validated, the operation is performed within the respective repository, which in this case uses the **PrismaClient**.

> Using the Repository pattern allows us not to be overly dependent on Prisma. 
> For example, imagine that one day we want to replace Prisma with something else; we would only need to modify the repository's implementation.

4.  If the data is correct and the operation is successful, a positive outcome is returned to the user. 
Otherwise, an exception is thrown, which is intercepted by the **Exception Filter** and translated into an **understandable HTTP status + message for the user** (404, 400, 403, etc.).

## Rest APIs

The REST API documentation is aviable on postman [on this link](https://documenter.getpostman.com/view/28632754/2s9XxztXoj), i'll also put the collection inside the folder `/api-documentation`

## Graphql APIs
The Graphql API documentation cannot be shared with postman but you can easly go for `localhost/graphql` and import the schema from `src/graphql/schema.gql` beacuse since I created the container with a production profile to avoid loading all development dependencies, introspection is not available.

## Error handling

As mentioned in the preceding sections, in case of deviations from the intended use case flow, **specific defined errors** rather than **HTTP errors** will be thrown.
This choice was made in case the application logic within the services needs to be used beyond these REST APIs.

However, it's still necessary to present an HTTP error to the user who is utilizing the APIs. For this reason, the `HttpExceptionFilter` class was implemented, which implements the NestJS `ExceptionFilter`. 
Its responsibility is **to catch errors thrown by the application and translate them into clear HTTP responses for the user.**

For example:

-   **SyntaxError** -> **400** Bad request
-   **NullPointerException** -> **404** Not Found 

and so on.

## Validation

To validate the data input in the POST and PUT requests, as suggested by the NestJS documentation, I have implemented a validator by creating a custom pipe. 
I modified a `PipeTransform` using the `class-validator` and `class-transformer` libraries.

This approach is very convenient and scalable. In fact, you only need to apply the decorators from these two libraries to `BookDTO` and `AuthorDTO` to automatically define the syntactical checks.

If, for example, we need to add a class like CD in the future, we would simply add the decorators to its attributes to validate its incoming and updating data.

## Test

Regarding unit testing, I have focused on testing only the **critical methods**, avoiding testing the methods that were simply calling another class (e.g., methods that only call `PrismaService`).

Tests are conducted using `Jest` + `MockDeep`, which, in my opinion, makes the code more **clear** and **saves time**.

All the tests are located in `/test directory`, and you can check them by running `npm run test`.
