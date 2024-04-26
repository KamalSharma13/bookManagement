

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

Features
User Login: Users can log in to access their accounts and manage their books.
Admin Login: Admins have special privileges to manage all books and user accounts.
Book Management:  Admins can perform CRUD operations on books, including adding, editing, deleting, and viewing books(with filter).
Users can viewing books(with filter),search books 

