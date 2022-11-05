process.env.NODE_ENV = "test";
const { app } = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Testing Reviews.js", () => {
  it("Authentication for reviews", (done) => {
    const user = "123"
    chai
      .request(app)
      .post(`/v1/api/reviews/create/${user}`)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});