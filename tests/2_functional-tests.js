/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var ObjectId = require("mongodb").ObjectID
var invalidId = new ObjectId();

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
    chai.request(server)
     .post('/api/books/')
     .send({title: 'new'})
     .end((err, res) => {
      chai.request(server)
       .get('/api/books')
       .end(function(err, res){
         assert.equal(res.status, 200);
         assert.isArray(res.body, 'response should be an array');
         assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
         assert.property(res.body[0], 'title', 'Books in array should contain title');
         assert.property(res.body[0], '_id', 'Books in array should contain _id');
         done();
       });
          });
            });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    var id;

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
    chai.request(server)
      .post('/api/books')
      .send({ title: 'title'})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.title, 'title');
        assert.isArray(res.body.comments);
        assert.property(res.body, '_id');
        id = res.body._id;
        done();
      });
  });

    test('Test POST /api/books with no title given', function(done) {
  chai.request(server)
    .post('/api/books')
    .send({})
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.text, 'missing title');
      done();
    });
 });

});


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
     chai.request(server)
       .get('/api/books')
       .end(function(err, res) {
         assert.equal(res.status, 200);
         done();
         });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){


      test('Test GET /api/books/[id] with id not in db',  function(done){
             chai.request(server)
                 .get('/api/books/'+ invalidId)
                 .end( (err, res) => {
                     assert.equal(res.text, 'no book exists');
                 done();
            })
          })

         test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
           .get("/api/books")
           .end((err, res) => {
              id = res.body[0]._id;

             chai.request(server)
               .get('/api/books/'+id)
               .end((err, res) => {
                 assert.equal(res.status, 200);
                 assert.isObject(res.body, "Response should be an object");
                 assert.property(res.body, "_id", "Book object should contain _id");
                 assert.property(res.body, "title", "Book object should contain title");
                 assert.property(res.body, "comments", "Book object should contain comments");
                 assert.isArray(res.body.comments, "Book object comments property should be an Array");
                 done();
               });
           });
       });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){

          chai.request(server)
           .post('/api/books/'+id)
           .send({
                       comment: 'Comment'
                     })
           .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'comments', 'Books in array should contain comments');
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          assert.equal(res.body._id, id);
          assert.isArray(res.body.comments, 'comments should be an array');
          assert.include(res.body.comments, 'Comment', 'comments should contain new comment');

               done();
            });
          });
       });

     });

   });
