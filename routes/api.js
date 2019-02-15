/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const DB = "mongodb://<username>:<password>@ds115613.mlab.com:15613/<dbname>";
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  function validationId(id) {

    const myregexp = /^[0-9a-fA-F]{24}$/;
      if(!id.match(myregexp)) return 1;

     }

  app.route('/api/books')
    .get(function (req, res){

  MongoClient.connect(DB, (err, db) => {
    if(err) throw(err);
      db.collection('personal-library').find().toArray((err, books) => {
        if(err) throw(err);
          res.send(books.map((book) => {
            var { _id, title, comments } = book;
              return { _id, title, commentcount: comments.length };
             }))
          db.close();
      });
   });
})

    .post(function (req, res){

  if (!req.body.title) return res.send('missing title');
      var { title } = req.body;

  MongoClient.connect(DB, (err, db) => {
    if(err) throw(err);
      db.collection('personal-library').insertOne({ title, comments: [] }, (err, doc) => {
        if(err) throw(err);
           if (doc.insertedCount === 1)
             res.json(doc.ops[0]);
        db.close();
       });
    });
 })

    .delete(function(req, res){

      MongoClient.connect(DB, (err, db) => {
        if(err) throw(err);
          db.collection('personal-library').deleteMany({ }, (err, doc) => {
            if(err) throw(err);
              doc.result.n > 0 ? res.json('complete delete successful') : res.json('no content to delete')
           db.close();
           });
        });
     });


  app.route('/api/books/:id')

    .get(function (req, res){

if(validationId(req.params.id))
 throw("Invalid Id(*id must contain 24 letters!)");
   MongoClient.connect(DB, (err, db) => {
      if(err) throw(err);
        db.collection('personal-library').findOne({ _id: ObjectId(req.params.id) }, (err, doc) => {
          if(err) throw(err);
              doc === null ? res.send('no book exists') : res.json(doc)
          db.close();
          });
       });
    })

    .post(function(req, res){

if(validationId(req.params.id))
    throw("Invalid Id(*id must contain 24 letters!)");
      MongoClient.connect(DB, (err, db) => {
        if(err) throw(err);
          db.collection('personal-library').findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
              { $push: { comments: req.body.comment } },
                { returnOriginal: false },
                 (err, doc) => {
                   if(err) throw(err);
                     if (doc.ok == 1)  res.json(doc.value);
                       else  res.send('book no exists')
             db.close();
            });
        });
     })

    .delete(function(req, res){

if(validationId(req.params.id))
  throw("Invalid Id(*id must contain 24 letters!)");
    MongoClient.connect(DB, (err, db) => {
      if(err) res.send(err.message);
        db.collection('personal-library').findOneAndDelete({ _id: ObjectId(req.params.id) }, (err, doc) => {
          if(err) throw(err);
            doc.value === null ? res.send('no book exists') : res.send('delete successful')
         db.close();
          });
       });
    });

};
