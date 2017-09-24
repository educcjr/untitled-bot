process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('chai').assert;

const app = require('./../api/index');

chai.use(chaiHttp);
const kind = 'UserTESTKIND';

describe('user-router.js', function () {
  this.timeout(10000);
  let key;

  describe('/POST user', () => {
    let data;

    it('insert new user', (done) => {
      data = { id: 'XXXXXXXXXXX', name: 'Test User' };
      chai.request(app)
        .post('/user')
        .send(data)
        .end((err, res) => {
          if (err) console.log(err);
          key = res.body.user.key.id;
          assert.exists(res.body.user.key);
          assert.strictEqual(res.body.user.key.kind, kind);
          assert.deepEqual(res.body.user.data, { discordId: data.id, name: data.name });
          done();
        });
    });

    it('update existing user', (done) => {
      data = { id: 'XXXXXXXXXXX', name: 'Test User Updated' };
      chai.request(app)
        .post('/user')
        .send(data)
        .end((err, res) => {
          if (err) console.log(err);
          assert.exists(res.body.user.key);
          assert.strictEqual(res.body.user.key.id, key);
          assert.deepEqual(res.body.user.data, { discordId: data.id, name: data.name });
          done();
        });
    });
  });

  describe('/GET user', () => {
    it('get all users', (done) => {
      chai.request(app)
        .get('/user')
        .end((err, res) => {
          if (err) console.log(err);
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          done();
        });
    });
  });

  describe('/DELETE user', () => {
    it('delete user', (done) => {
      chai.request(app)
        .delete(`/user/${key}`)
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.body.key, key);
          done();
        });
    });
  });
});
