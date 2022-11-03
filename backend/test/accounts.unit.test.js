process.env.NODE_ENV = "test";
const { app } = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Testing Accounts.js", () => {
  it("Email Input validation error for Register", (done) => {
    const req = {
      firstName: "Lucas",
      lastName: "Chua",
      email: "shengyu98123",
      emailSubscription: true,
      password: "Password123456",
      phone: "92282700",
      countryCode: "+65",
    };
    chai
      .request(app)
      .post("/v1/api/accounts/register")
      .type("json")
      .send(req)
      .end((err, res) => {
        const body = res.body;
        res.should.have.status(400);
        done();
      });
  });
  it("Password Input validation error for Register", (done) => {
    const req = {
      firstName: "Lucas",
      lastName: "Chua",
      email: "test@hotmail.com",
      emailSubscription: true,
      password: "",
      phone: "92282700",
      countryCode: "+65",
    };
    chai
      .request(app)
      .post("/v1/api/accounts/register")
      .type("json")
      .send(req)
      .end((err, res) => {
        const body = res.body;
        res.should.have.status(400);
        done();
      });
  });
  it("Invalid credentials for Login", (done) => {
    const req = {
      email: "test@test.com",
      password: "",
    };
    chai
      .request(app)
      .post("/v1/api/accounts/login")
      .type("json")
      .send(req)
      .end((err, res) => {
        const body = res.body;
        res.should.have.status(400);
        done();
      });
  });
  it("Invalid user for 2fa verification", (done) => {
    const req = {
      userId: "",
      token: "",
    };
    chai
      .request(app)
      .post("/v1/api/accounts/verify2FA")
      .type("json")
      .send(req)
      .end((err, res) => {
        const body = res.body;
        res.should.have.status(400);
        done();
      });
  });
  it("Successful Register", (done) => {
    const req = {
      firstName: "Lucas",
      lastName: "Chua",
      email: "test@test.com",
      emailSubscription: true,
      password: "Password123456",
      phone: "92282700",
      countryCode: "+65",
    };
    chai
      .request(app)
      .post("/v1/api/accounts/register")
      .type("json")
      .send(req)
      .end((err, res) => {
        const body = res.body;
        res.body.should.have.property("_id");
        res.body.should.have.property("secret");
        done();
      });
  });
  it("Successful Login", (done) => {
    const req = {
      email: "test@test.com",
      password: "Password123456",
    };
    chai
      .request(app)
      .post("/v1/api/accounts/login")
      .type("json")
      .send(req)
      .end((err, res) => {
        const body = res.body;
        res.should.have.status(200);
        res.body.should.have.property("_id");
        done();
      });
  });
  it("Email Validation for password reset", (done) => {
    const req = {
      email: "testcom",
      token: "",
    };
    chai
      .request(app)
      .post("/v1/api/accounts/reset")
      .send(req)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it("Token validation for password reset", (done) => {
    const req = {
      email: "testcom",
      token: "1234567",
    };
    chai
      .request(app)
      .post("/v1/api/accounts/reset")
      .send(req)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it("Authentication to retrieve user", (done) => {
    chai
      .request(app)
      .get("/v1/api/accounts/getAccount")
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
