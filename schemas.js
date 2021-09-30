const baseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (Joi) => ({
  type: "string",
  base: Joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = baseJoi.extend(extension);

module.exports.userSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required()
    .escapeHTML()
    .messages({
      "any.required": "Username is required",
      "string.empty": "Username is required",
      "string.pattern.base":
        "Username should be 3 - 30 characters and contains letters and numbers",
    }),
  email: Joi.string().email().required().escapeHTML().messages({
    "any.required": "Email is required",
    "string.email": "Email is invalid",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .escapeHTML()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password should be at least 8 characters and contains uppercase, lowercase, and numbers",
    }),
});
module.exports.loginSchema = Joi.object({
  username: Joi.string().required().escapeHTML().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
  }),

  password: Joi.string().required().escapeHTML().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
});

module.exports.linkSchema = Joi.object({
  title: Joi.string().required().escapeHTML().messages({
    "any.required": "Title is required",
  }),
  links: Joi.array().items(
    Joi.string().required().uri().messages({
      "any.required": "{{#label}} is required",
      "string.uri": "Links with value {:[.]} is invalid",
    })
  ),
  description: Joi.string().escapeHTML().allow("").optional(),
});
