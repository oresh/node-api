// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

var mongoose = require('mongoose');
var Modules = require('../app/models/drupal');
var ModulesModel = mongoose.model('Drupal', Modules);

chai.use(chaiHttp);
var $chai = chai.request(server);


describe('Modules', function() {
  //Before each test we empty the database
  beforeEach( function(done) {
    ModulesModel.remove({}, function(err, modules) { done(); });
  });

  describe('/GET modules', function() {
    it('it should GET all the modules', function(done) {
      $chai.get('/api/modules')
        .end( function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.message.should.be.eql('No modules found.');
          done();
        });
    });
  });

  describe("/POST new module", function() {
    // error on posting
    it('it should NOT post a module without link field', function(done) {

      var drupalModule = {
        name: "The Lord of the Rings",
        project_type: "Theme"
      }

      $chai.post('/api/modules').send(drupalModule)
        .end( function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('link');
          res.body.errors.link.should.have.property('type').eql('required');
          done();
      });
    });

    // success on posting
    it('it should create a new module', function(done) {

      var drupalModule = {
        name: "The Lord of the Rings",
        project_type: "Theme",
        link: 'http://test.com'
      }

      $chai.post('/api/modules').send(drupalModule)
        .end( function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('module');
          res.body.module.name.should.be.eq(drupalModule.name);
          res.body.module.project_type.should.be.eq(drupalModule.project_type);
          res.body.module.link.should.be.eq(drupalModule.link);
          done();
      });
    });
  });

});
