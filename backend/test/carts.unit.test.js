process.env.NODE_ENV = "test";
const { app } = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Testing Carts.js", () => {
  it("Authentication for carts", (done) => {
    const userId = "123"
    chai
      .request(app)
      .get(`/v1/api/carts/${userId}`)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});