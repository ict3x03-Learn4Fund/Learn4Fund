process.env.NODE_ENV = "test";
const { app } = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Testing Admin.js", () => {
  it("Authentication for admin", (done) => {
    const userId = "123"
    chai
      .request(app)
      .get(`/v1/api/admin/getAllLogs/${userId}`)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});