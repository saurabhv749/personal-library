/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
module.exports = function (app,Book) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

        Book.find({}, { comments: 0, __v: 0 }, function (err, docs) {
        if (err) res.status(500).end()
        else res.json(docs)
      })
    })
    
    .post(function (req, res){
         let title = req.body.title
      //response will contain new book object including atleast _id and title
      if (title === ''|| title===undefined) res.send('missing required field title')
      else {
        const book = new Book({ title:title })
        book
          .save((err,data)=>{
            if(err)
              res.end()
            else
            res.json({ title:data.title, _id: data._id })

          })
          
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
       Book.deleteMany({}, function (err) {
        if (!err) res.send('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
     let bookid = req.params.id
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid,
        { title: 1,_id:1, comments: 1 },
        (err, doc) => {
          if (err ||doc === null) res.send('no book exists')
          else res.json(doc)
        }
      )
    })
    
    .post(function(req, res){
      let bookid = req.params.id
      let comment = req.body.comment
      //json res format same as .get
      if (comment === ''|| comment===undefined) res.send('missing required field comment')
      else
        Book.findByIdAndUpdate(
          { _id: bookid },
          {
            $push: { comments: comment },
            $inc: { commentcount: 1 },
          },
          { new: true, upsert: false },
          (err, doc) => {
            if (err || doc === null) res.send('no book exists').end()
            else
              res.json({
                _id: doc._id,
                title: doc.title,
                comments: doc.comments,
              })
          }
        )
    })
    
    .delete(function(req, res){
      let bookid = req.params.id
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, function (err, deleted) {
        if (deleted!==null) res.send('delete successful')
        else res.send('no book exists')
      })
    });
  
};
