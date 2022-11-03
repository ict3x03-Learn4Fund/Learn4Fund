process.env.NODE_ENV = "test";
const { app } = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("Testing Courses.js", () => {
  it("Get course successfully", (done) => {
    chai
      .request(app)
      .get("/v1/api/courses/")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Authentication validation for course", (done) => {
    const req = {
      courseName: "",
      courseImg: "",
      courseOriginalPrice: "",
      courseDiscountedPrice: "",
      canBeDiscounted: true,
      courseType: "IT",
      courseDescription: "",
      courseTutor: "KAKAK",
      quantity: 15,
    };
    chai
      .request(app)
      .post("/v1/api/courses/create")
      .send(req)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
