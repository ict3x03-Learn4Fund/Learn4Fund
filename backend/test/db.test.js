const mongoose = require("mongoose");

function connect() {
  return new Promise((resolve, reject) => {
    const Mockgoose = require("mockgoose").Mockgoose;
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage().then(() => {
      mongoose
        .connect(process.env.COURSES_DB_URI)
        .then((res, err) => {
          if (err) return reject(err);
          console.log(res)
          resolve(res);
        })
    });
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
