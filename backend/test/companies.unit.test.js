process.env.NODE_ENV = "test";
const { app } = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { v4: uuidv4 } = require("uuid");

describe("Testing Companies.js", () => {
  it("Successful verification of vouchers", (done) => {
    const req = {
      companyId: "63256fbd8bded3b2d077215b",
      voucherId: "63619512edaaf2ce9c080ace",
      voucherCode: "a0423057-43e4-4140-9b01-eb2f54c682fc",
    };
    chai
      .request(app)
      .post("/v1/api/companies/verifyVoucher")
      .type("json")
      .send(req)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
