process.env.NODE_ENV = 'test';

let Post = require('../../models/post');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');

chai.use(chaiHttp);
//Our parent block

let postIdCreated, postIdModified;
describe('Posts', () => {
  after(done => {
    Post.remove(err => {
      if(!err){
        done();
      }
    });
    server.server.close();
  });

  /*
   * Test the /GET route
   */
  describe('/GET Post', () => {
    it('it should GET all the Posts from Auth API', (done) => {
      chai.request(server.app)
        .get('/api/v1/posts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          res.body.data.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/POST a Post', () => {
    it('it should POST a post', (done) => {
      let post = {
        'title': 'Get started',
        'url': 'get-started',
        'content': 'Any content',

      };
      chai.request(server.app)
        .post('/api/v1/posts')
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.msg.should.be.eql('Post successfully added');
          postIdCreated = res.body.data.url;
          done();
        });
    });

    it('it should not POST a post without title field', (done) => {
      let post = {
        'url': 'get-started',
        'content': 'Any content'
      };
      chai.request(server.app)
        .post('/api/v1/posts')
        .send(post)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.err.should.have.be.a('object');
          res.body.err._message.should.be.eql('Post validation failed');
          done();
        });
    });
  });
  describe('/PUT a Post\n', () => {
    let post = {
      'title': 'Get started modified',
      'url': 'get-started-modified',
      'content': 'Content modified'
    };
    it('it should PUT an existint post', (done) => {
      chai.request(server.app)
        .put('/api/v1/posts/' + postIdCreated)
        .send(post)
        .end((err, res) => {
          res.should.have.status(204);
          postIdModified = post.url;
          done();
        });
    });
    it('it should GET modified post', (done) => {
      chai.request(server.app)
        .get('/api/v1/posts/' + postIdModified)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.data.title.should.be.eql(post.title);
          res.body.data.url.should.be.eql(post.url);
          res.body.data.content.should.be.eql(post.content);
          done();
        });
    });
  });
});
