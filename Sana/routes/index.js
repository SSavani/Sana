const log = require("./log");
const userRoutes = require("./users");
const courseRoutes = require("./course");
const coachRoutes = require("./coach");
const adminRoutes = require("./admin");

const constructorMethod = app => {
  app.use("/", log);
  app.use("/users", userRoutes);
  app.use("/course", courseRoutes);
  app.use("/coach", coachRoutes);
  app.use("/admin", adminRoutes);

  app.use("*", (req, res) => {
      res.render("about");
  });
};

module.exports = constructorMethod;