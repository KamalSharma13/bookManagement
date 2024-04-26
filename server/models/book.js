import Mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import status from '../enums/status';
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = Mongoose.Schema;
var bookSchema = new schema({

    bookTitle: {
        type: String
    },
    bookDescription: {
        type: String,
    },
    author: {
        type: String,
    },
    publicationYear: {
        type: String,
    },
    status: {
        type: String,
        default: status.ACTIVE
    }
}, {
    timestamps: true
});

bookSchema.plugin(mongoosePaginate);
bookSchema.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("books", bookSchema);