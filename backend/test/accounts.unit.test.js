const expect = require("chai").expect;
const request = require("supertest");
const mongoose = require("mongoose");
const {app} = require("../server");
const conn = require("./db.test");
let chai = require("chai")
let chaiHttp = require("chai-http");
chai.should()
chai.use(chaiHttp)
const bodyParser = require('body-parser');


const Mockgoose = require("mockgoose").Mockgoose;
const mockgoose = new Mockgoose(mongoose);

describe("Register account", () => {
  it("Successful creation", (done) => {
    console.log("hi");
    req = {
      firstName: "Lucas",
      lastName: "Chua",
      email: "shengyu98@hotmail.com",
      emailSubscription: true,
      password: "Password123456",
      phone: "92282700",
      countryCode: "+65",
    }
    chai.request(app)
      .post("/v1/api/accounts/register")
      .type('json')
      .send(req)
      .end((err, res) => {
        console.log("Hhii");
        const body = res.body;
        console.log("hi", body);
        res.body.should.have.status(200);
        done();
      })
    
  })
});

// describe("Register account", () => {
//   before(function (done) {
//     mockgoose.prepareStorage().then(function () {
//       mongoose.connect(process.env.COURSES_DB_URI, function (err) {
//         done(err);
//       });
//     });
//     // before(async (done) => {
//     //   await conn
//     //     .connect()
//     //     .then(() => done())
//     //     .catch((err) => done(err));
//   });

//   after((done) => {
//     conn
//       .close()
//       .then(() => done())
//       .catch((err) => done(err));
//   });
//   it("Successful creation", (done) => {
//     console.log("hi");
//     request(server)
//       .post("/register")
//       .send({
//         firstName: "Lucas",
//         lastName: "Chua",
//         email: "shengyu98@hotmail.com",
//         emailSubscription: true,
//         password: "Password123456",
//         phone: "92282700",
//         countryCode: "+65",
//       })
//       .then((res) => {
//         console.log("Hhii");
//         const body = res.body;
//         console.log("hi", body);
//         expect(body).to.contain.property("_id");
//         done();
//       })
//       .catch((err) => {
//         console.log(err);
//         done();
//       });
    
//   })
// });