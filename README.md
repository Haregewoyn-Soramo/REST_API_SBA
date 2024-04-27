Book Collection API
The Book Collection API is a RESTful web service designed to manage a collection of books. It provides endpoints to add, retrieve, update, and delete books from the collection.

Features
Add a new book to the collection
Retrieve details of a specific book
Update information of an existing book
Delete a book from the collection
Technologies Used
Node.js: A JavaScript runtime environment for building server-side applications.
Express.js: A minimal and flexible Node.js web application framework for building robust APIs.

Getting Started
Clone the repository:
bash
Copy code
git clone https://github.com/your-username/book-collection-api.git
Install dependencies:
bash
Copy code
cd book-collection-api
npm install

plaintext
Copy code
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book_collection_db
Start the server:
bash
Copy code
npm start
The API will be available at http://localhost:3000.
API Endpoints
Get All Books
http
Copy code
GET /api/books
Retrieve details of all books in the collection.

Get Book by title
http
Copy code
GET /api/books/:title
Retrieve details of a specific book by its title.

Add a New Book
http
Copy code
POST /api/books
Add a new book to the collection.

Request Body
json
Copy code
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Classic",
  "publication_year": 1925
}
Update Book
http
Copy code
PATCH /api/books/:title
Update information of an existing book.

Request Body
json
Copy code
{
  "genre": "Literary Fiction"
}
Delete Book
http
Copy code
DELETE /api/books/:title
Delete a book from the collection by its title.

Contributing
Contributions are welcome! Please open an issue or submit a pull request with any improvements or features you'd like to add.

License
This project is licensed under the MIT License - see the LICENSE file for details.
