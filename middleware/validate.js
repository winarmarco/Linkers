const { Console } = require("console");
const path = require("path");

const { linkSchema, userSchema, loginSchema } = require(path.join(__dirname, "../schemas"));

module.exports.validateLink = (req, res, next) => {
  const link = req.body;


  if (typeof link.links == "string") {
      const temp = [];
      temp.push(link.links);
      link.links = temp;
  }

  const { error } = linkSchema.validate(link, { abortEarly: false });

  if (error) {
    const errorData = error.details.map((err) => {
      return {
        name: err.path[0],
        value: err.context.value,
        message: err.message,
      };
    });

    return res.status(400).json(errorData);
  }
  next();
};

module.exports.validateRegister = (req, res, next) => {
  const user = req.body;
  


  const validate = userSchema.validate(user, { abortEarly: false });
  const { error } = validate;

  if (error) {
    req.body.username = { value: req.body.username, error: 0 };
    req.body.password = { value: req.body.password, error: 0 };
    req.body.email = { value: req.body.email, error: 0 };

    const errorData = req.body;

    error.details.forEach((err) => {
      errorData[err.path[0]] = {
        value: err.context.value,
        message: err.message,
        error: 1,
      };
    });

    return res.render("register", { data: errorData, error : {} });
  }

  next();
};

module.exports.validateLogin = (req, res, next) => {
  const user = req.body;


  const { error } = loginSchema.validate(user, { abortEarly: false });

  if (error) {
    req.body.username = { value: req.body.username, error: 0 };
    req.body.password = { value: req.body.password, error: 0 };

    const errorData = req.body;
    error.details.forEach((err) => {
      errorData[err.path[0]] = {
        value: err.context.value,
        message: err.message,
        error: 1,
      };
    });


    return res.render("login", { data: errorData , error : 0});
  }

  next();
};


module.exports.validateUser = (req,res,next) => {
    if (!req.user) {
        return res.redirect("/login");
    }

    next();
}