const mongoose = require('mongoose')
require('dotenv').config()

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required:true
  },
  comments: [String],
  commentcount: {
    type: Number,
    default: 0,
  },
})

const Book = new mongoose.model('book', bookSchema)

const connectDB = async () => {
  await mongoose.connect(
    process.env.DB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    () => console.log('connected to database')
  )
}
connectDB()
module.exports = Book
