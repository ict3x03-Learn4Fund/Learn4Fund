process.env.NODE_ENV = "test";
const { app } = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Testing Payments.js", () => {
  it("Authentication for payment", (done) => {
    const userId = "123"
    chai
      .request(app)
      .get(`/v1/api/payments/${userId}`)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});