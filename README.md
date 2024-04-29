

Book Management Node Project

Welcome to the Book Management Node Project! This project allows users and admins to manage books in a Node.js environment.

Installation
To get started, follow these steps:

Clone this repository to your local machine:

git clone <repository-url>

Navigate to the project directory:

cd <project-directory>

Install all required packages using npm:

npm install

Install nodemon globally to automatically restart the server upon file changes:

npm install -g nodemon
Usage
Once you've installed the dependencies, you can start the project by running:

nodemon
This command will start the server, and you can access the application in your browser at http://localhost:<port>. Replace <port> with the port number configured in your environment.

Enter http://localhost:2005/api-docs/#/ 
By using this url you can directly call apis in browser through swagger

Default Admin:-
email :ksharma@mailinator.com
password: Kamal@1


Default User:-
email :kamal@xyz.com
password: Kamal@1

For input validation i use Joi .

Features
User Login: Users can log in to access their accounts and manage their books.
Admin Login: Admins have special privileges to manage all books and user accounts.
Book Management:  Admins can perform CRUD operations on books, including adding, editing, deleting, and viewing books(with filter).
Users can viewing books(with filter),search books 

Api endpoints(http://localhost:2005/api/v1/book/)

1. /login : This api is for login .It is current for both user and admin . But we can change it for specific userType.

******************ADMIN APIS**********************

2. /addBook : This api is for adding new books .We have to pass bookTitle,bookDescription,Author and publicationYear. Title will not be same for any book.

3. /editBook : This api helps in edit or changing any info of the book.

4./activeDeactiveBook : this api is for changing active status for the book.

5. /deleteBook: This api is for delete any book.

6. /listBook : This api gave list of books .It has some filters like:

search: search book by title.
fromDate and toDate : to get books in between from year to specific to year.

status: It is for getting books with specific status(ACTIVE/BLOCK)

author: to get books of specific author.

year : for getting books of specific single year

7. /viewBook : to saw details of specific book


******************USER APIS**********************

1. /userBookList : to get books list with user token all filters are same but only get books which are active.

2. /searchBook : this is for global search after login user.

3. /userViewBook : this is to view details of specific book.