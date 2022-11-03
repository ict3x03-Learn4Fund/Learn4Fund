process.env.NODE_ENV = "test";
const { app } = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Testing Donations.js", () => {
  it("Get All donations successfully", (done) => {
    chai
      .request(app)
      .get(`/v1/api/donations`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Get total donation amount successfully", (done) => {
    chai
      .request(app)
      .get(`/v1/api/donations/total`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Get top 5 donations successfully", (done) => {
    chai
      .request(app)
      .get(`/v1/api/donations/getTop5`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Get recent donations successfully", (done) => {
    chai
      .request(app)
      .get(`/v1/api/donations/topRecent`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});