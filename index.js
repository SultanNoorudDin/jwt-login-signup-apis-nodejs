const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");
const auth = require("./middlewares/auth");
const errors = require("./middlewares/errors");

const unless = require("express-unless"); // Import express-unless
const app = express();

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("database connected");
    },
    (error) => {
      console.log("couldn't connect" + error);
    }
  );

// Configure unless for auth.authenticateToken
auth.authenticateToken.unless = unless;

// Set up authentication middleware
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] },
    ],
  })
);

// Apply authentication middleware to all routes
// app.use(authenticationMiddleware);

app.use(express.json());
app.use("/users", require("./routes/user.route"));
app.use(errors.errorHandler);

app.listen(process.env.PORT || 4000, function () {
  console.log("ready...");
});
