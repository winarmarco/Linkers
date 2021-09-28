const path = require("path");
const { linkSchema } = require(path.join(__dirname, "../schemas.js"));
const User = require(path.join(__dirname, "../models/users.js"));

module.exports.getLinks = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.links.length === 0) return res.render("index", {data : user, inputBox : "", message : "You have no links in your list. Start creating one!"})

  const q = req.query.q === undefined ? "" : req.query.q;
  
  user.links = user.links.filter((e) =>
    e.title.toLowerCase().includes(q.toLowerCase())
  );

  res.render("index", { data: user, inputBox : q, message : (user.links.length === 0) && `Sorry, there are no links with title \"${q}\" :(`});
};

module.exports.createLinks = async (req, res) => {
  try {
    const newLink = req.body;

    const updatedUser = await User.findById(req.user._id);

    updatedUser.links.push(newLink);
    const temp = await updatedUser.save();
    res.redirect("/links");
  } catch (error) {
    console.dir(error);
  }
};

module.exports.updateLinks = async (req, res) => {
  const updatedLinks = req.body;
  const user = await User.findOneAndUpdate(
    { _id: req.user._id, "links._id": req.body._id },
    {
      $set: {
        "links.$.title": updatedLinks.title,
        "links.$.links": updatedLinks.links,
        "links.$.description": updatedLinks.description,
      },
    }
  );

  res.redirect("/links");
};

module.exports.deleteLinks = async (req, res) => {
  const deletedLink = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { links: { _id: req.body._id } } }
  );
  res.redirect("/links");
};
