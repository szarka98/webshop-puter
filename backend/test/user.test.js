const chai = require('chai');
const {
  expect,
} = require('chai');
const chaiHttp = require('chai-http');
const user = require('../controller/user.controller');

const baseUrl = 'http://localhost:8080/user';
chai.use(chaiHttp);

// Simple Base Examples
describe('user', () => {
  describe('profile()', () => {
    it('response statusCode equal to 200', (done) => {
      chai.request(baseUrl)
        .get('/profile')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');
          done();
        });
    });
  });
  describe('login()', () => {
    it('response statusCode equal to 200', (done) => {
      chai.request(baseUrl)
        .post('/login')
        .send({ username: 'Peter@gmail.com', password: 'Peter' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('register()', () => {
    it('response statusCode equal to 200', (done) => {
      chai.request(baseUrl)
        .post('/register')
        .send({ username: 'Bogi', email: 'Bogi@gmail.com', password: 'Bogi' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

