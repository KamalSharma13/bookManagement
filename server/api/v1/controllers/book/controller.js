import Joi from "joi";
import _ from "lodash";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import commonFunction from "../../../../helper/util";
import bcrypt from "bcryptjs";
import {
  bookServices
} from "../../services/book";
const {createBook,findBook,findBookAll,searchBooks,bookCheck,updateBookById,paginateBook} = bookServices;
import {
  userServices
} from "../../services/user";
const {
  findUser
} = userServices;
import status from "../../../../enums/status";
import userType, {
  ADMIN
} from "../../../../enums/userType";

export class BookController {

    /**
   * @swagger
   * /book/login:
   *   post:
   *     tags:
   *       - USER
   *     description: login with email and password
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: email
   *         in: query
   *         required: true
   *       - name: password
   *         description: password
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

    async login(req, res, next) {
      var validationSchema = {
        email: Joi.string().required(),
        password: Joi.string().required(),
      };
      try {
        if (req.body.email) {
          req.body.email = req.query.email.toLowerCase();
        }
        var results;
  
        var validatedBody = await Joi.validate(req.query, validationSchema);
        const {
          email,
          password
        } = validatedBody;
        let userResult = await findUser({
          email: email,
          status: {
            $ne: status.DELETE,
          },
        });
        if (!userResult) {
          throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }
        if (userResult.status == status.BLOCK) {
          throw apiError.badRequest(responseMessage.BLOCK_BY_ADMIN);
        }
  
        if (!bcrypt.compareSync(password, userResult.password)) {
          throw apiError.conflict(responseMessage.INCORRECT_LOGIN);
        } else {
          var token = await commonFunction.getToken({
            _id: userResult._id,
            email: userResult.email,
            userType: userResult.userType,
          });
          results = {
            _id: userResult._id,
            email: email,
            userType: userResult.userType,
            token: token,
          };
        }
        return res.json(new response(results, responseMessage.LOGIN));
      } catch (error) {
        console.log(error);
        return next(error);
      }
    }
  /**
   * @swagger
   * /book/addBook:
   *   post:
   *     tags:
   *       - ADMIN_Book_MANAGEMENT
   *     description: addBook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: bookTitle
   *         description: bookTitle
   *         in: formData
   *         required: true
   *       - name: bookDescription
   *         description: bookDescription
   *         in: formData
   *         required: true
   *       - name: author
   *         description: author
   *         in: formData
   *         required: true
   *       - name: publicationYear
   *         description: publicationYear
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addBook(req, res, next) {
    let validationSchema = {
      bookTitle: Joi.string().required(),
      bookDescription: Joi.string().required(),
      author: Joi.string().required(),
      publicationYear: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({
        _id: req.userId,
        userType: {
          $ne: userType.USER
        },
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }

      var book = await bookCheck(validatedBody.bookTitle);
      if (book) {
        throw apiError.notFound(responseMessage.BOOK_ALREADY_EXIST);
      }
      var result = await createBook(validatedBody);
      return res.json(new response(result, responseMessage.BOOK_CREATED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /book/listBook:
   *   get:
   *     tags:
   *       - ADMIN_Book_MANAGEMENT
   *     description: listBook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: status
   *         description: status (ACTIVE/BLOCK)
   *         in: query
   *         required: false
   *       - name: fromDate
   *         description: fromDate
   *         in: query
   *         required: false
   *       - name: toDate
   *         description: toDate
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *       - name: author
   *         description: author
   *         in: query
   *         required: false
   *       - name: search
   *         description: search
   *         in: query
   *         required: false
   *       - name: year
   *         description: year
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listBook(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
      status: Joi.string().optional(),
      author: Joi.string().optional(),
      year: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({
        _id: req.userId,
        userType: {
          $ne: userType.USER
        },
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await paginateBook(validatedBody);
      if (dataResults.docs.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }



  /**
   * @swagger
   * /book/userBookList:
   *   get:
   *     tags:
   *       - USER_Book_MANAGEMENT
   *     description: userBookList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: fromDate
   *         description: fromDate
   *         in: query
   *         required: false
   *       - name: toDate
   *         description: toDate
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *       - name: author
   *         description: author
   *         in: query
   *         required: false
   *       - name: search
   *         description: search
   *         in: query
   *         required: false
   *       - name: year
   *         description: year
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async userBookList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
      author: Joi.string().optional(),
      year: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({
        _id: req.userId,
        userType: userType.USER,
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }

      validatedBody.status = "ACTIVE"
      let dataResults = await paginateBook(validatedBody);
      if (dataResults.docs.length == 0) {
        throw apiError.notFound(responseMessage.BOOK_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /book/searchBook:
   *   get:
   *     tags:
   *       - USER_Book_MANAGEMENT
   *     description: searchBook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async searchBook(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      page: Joi.string().optional(),
      limit: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      if (!validatedBody.search) {
        throw apiError.notFound(responseMessage.BOOK_NOT_FOUND);
      }
      let userResult = await findUser({
        _id: req.userId,
        userType: userType.USER,
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await searchBooks(validatedBody);
      if (dataResults.docs.length == 0) {
        throw apiError.notFound(responseMessage.BOOK_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /book/deletebook:
   *   delete:
   *     tags:
   *       - ADMIN_Book_MANAGEMENT
   *     description: deletebook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async deleteBook(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({
        _id: req.userId,
        userType: {
          $ne: userType.USER
        },
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var bookInfo = await findBook({
        _id: validatedBody._id,
        status: {
          $ne: status.DELETE
        },
      });
      if (!bookInfo) {
        throw apiError.notFound(responseMessage.BOOK_NOT_FOUND);
      }
      let deleteRes = await updateBookById({
        _id: bookInfo._id
      }, {
        status: status.DELETE
      });
      return res.json(new response(deleteRes, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /book/editbook:
   *   put:
   *     tags:
   *       - ADMIN_Book_MANAGEMENT
   *     description: editbook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: formData
   *         required: true
   *       - name: bookTitle
   *         description: bookTitle
   *         in: formData
   *         required: false
   *       - name: bookDescription
   *         description: bookDescription
   *         in: formData
   *         required: false
   *       - name: author
   *         description: author
   *         in: formData
   *         required: false
   *       - name: publicationYear
   *         description: publicationYear
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editBook(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      bookTitle: Joi.string().optional(),
      bookDescription: Joi.string().optional(),
      author: Joi.string().optional(),
      publicationYear: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);

      let userResult = await findUser({
        _id: req.userId,
        userType: {
          $ne: userType.USER
        },
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let books = await findBook({
        _id: validatedBody._id,
        status: {
          $ne: status.DELETE
        },
      });
      if (!books) {
        throw apiError.notFound(responseMessage.BOOK_NOT_FOUND);
      }

      if (validatedBody.bookTitle != books.bookTitle) {
        var book = await bookCheck(validatedBody.bookTitle);
        if (book) {
          throw apiError.notFound(responseMessage.BOOK_ALREADY_EXIST);
        }
      }


      var result = await updateBookById({
        _id: books._id
      }, validatedBody);
      return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /book/viewbook:
   *   get:
   *     tags:
   *       - ADMIN_Book_MANAGEMENT
   *     description: viewbook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewBook(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({
        _id: req.userId,
        userType: {
          $ne: userType.USER
        },
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var bookInfo = await findBook({
        _id: validatedBody._id,
        status: {
          $ne: status.DELETE
        },
      });
      if (!bookInfo) {
        throw apiError.notFound(responseMessage.BOOK_NOT_FOUND);
      }
      return res.json(new response(bookInfo, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /book/userViewBook:
   *   get:
   *     tags:
   *       - USER_Book_MANAGEMENT
   *     description: viewbook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async userViewBook(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({
        _id: req.userId,
        userType: userType.USER,
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var bookInfo = await findBook({
        _id: validatedBody._id,
        status: status.ACTIVE,
      });
      if (!bookInfo) {
        throw apiError.notFound(responseMessage.BOOK_NOT_FOUND);
      }
      return res.json(new response(bookInfo, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /book/activeDeactiveBook:
   *   put:
   *     tags:
   *       - ADMIN_Book_MANAGEMENT
   *     description: activeDeactivebook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async activeDeactiveBook(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({
        _id: req.userId,
        userType: {
          $ne: userType.USER
        },
        status: status.ACTIVE
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.BOOK_NOT_FOUND);
      }
      var bookInfo = await findBook({
        _id: validatedBody._id,
      });
      if (!bookInfo) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }

      let changedStatus =
        bookInfo.status == status.ACTIVE ? status.BLOCK : status.ACTIVE;
      var resData = await updateBookById({
        _id: bookInfo._id
      }, {
        status: changedStatus
      });
      if (changedStatus == status.BLOCK) {
        return res.json(new response(resData, responseMessage.BOOK_BLOCKED));
      } else {
        return res.json(new response(resData, responseMessage.BOOK_UNBLOCK));
      }
    } catch (error) {
      return next(error);
    }
  }
}
export default new BookController();