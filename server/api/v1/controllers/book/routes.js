import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";

export default Express.Router()


.post('/login', controller.login)
  .use(auth.verifyToken)
///****************USER BOOK MANAGEMENT */
  .get("/userBookList", controller.userBookList)
  .get("/searchBook", controller.searchBook)
  .get("/userViewBook", controller.userViewBook)



  //********************ADMIN BOOK MANAGEMENT */
  .delete("/deleteBook", controller.deleteBook)
  .get("/viewBook", controller.viewBook)
  .put("/activeDeactiveBook", controller.activeDeactiveBook)
  .get("/listBook", controller.listBook)
  .put("/editBook", controller.editBook)
  .post("/addBook", controller.addBook);