const { Router } = require("express");
const express = require("express");
const path = require("path");
const { validateLink, validateUser } = require("../middleware/validate");
const { catchAsync } = require("../utils");
const links = require(path.join(__dirname, "../controllers/links"));
const router = express.Router();

router.route("/links")
  .get(validateUser, catchAsync(links.getLinks))
  .post(validateUser, validateLink, links.createLinks)
  .put(validateUser, catchAsync(links.updateLinks))
  .delete(validateUser, catchAsync(links.deleteLinks));

module.exports = router;
