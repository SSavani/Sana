const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");

const Handlebars = require("handlebars");
const app = express();

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ["views/partials/"]
});

app.use("/public", static);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, function() {
    console.log(
      "Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it"
    );
  });
