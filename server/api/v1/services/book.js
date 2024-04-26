import bookModel from "../../../models/book";
import statuss from '../../../enums/status';

const bookServices = {

  createBook: async (insertObj) => {
    return await bookModel.create(insertObj);
  },

  findBook: async (query) => {
    return await bookModel.findOne(query);
  },
  findBookAll: async (query) => {
    return await bookModel.find(query);
  },
  searchBooks: async (validatedBody) => {
    let query = {
      bookTitle: {
        $regex: validatedBody.search,
        $options: 'i'
      },
      status: statuss.ACTIVE
    }
    let options = {
      page: Number(validatedBody.page) || 1,
      limit: Number(validatedBody.limit) || 10,
    };
    return await bookModel.paginate(query, options);
  },
  bookCount: async (query) => {
    return await bookModel.countDocuments(query);
  },
  updateBook: async (query, updateObj) => {
    return await bookModel.findOneAndUpdate(query, updateObj, {
      new: true
    });
  },

  bookCheck: async (bookTitle) => {
    let query = {
      $and: [{
        status: {
          $ne: statuss.DELETE
        },
        bookTitle: bookTitle
      }]
    };
    return await bookModel.findOne(query);
  },

  updateBookById: async (query, updateObj) => {
    return await bookModel.findByIdAndUpdate(query, updateObj, {
      new: true
    });
  },

  paginateBook: async (validatedBody) => {
    let query = {
      status: {
        $ne: statuss.DELETE
      }
    };
    const {
      search,
      fromDate,
      toDate,
      page,
      limit,
      status,author,year
    } = validatedBody;

    if (search) {
      query.$or = [{
          bookTitle: {
            $regex: validatedBody.search,
            $options: 'i'
          }
        },

      ]

    }
    if (status) {
      query.status = status
    }
    if (author) {
      query.$or = [{
        author: {
            $regex: validatedBody.author,
            $options: 'i'
          }
        },

      ]

    }
    if (year) {
      query.publicationYear = year
    }
    if (fromDate && !toDate) {
      query.publicationYear = {
        $gte: fromDate
      };
    }
    if (!fromDate && toDate) {
      query.publicationYear = {
        $lte: toDate
      };
    }
    if (fromDate && toDate) {
      query.$and = [{
        publicationYear: {
            $gte: fromDate
          }
        },
        {
          publicationYear: {
            $lte: toDate
          }
        },
      ]
    }
    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };
    return await bookModel.paginate(query, options);
  }

}

module.exports = {
  bookServices
};