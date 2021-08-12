const jwt = require("jsonwebtoken");
const { tokenAuthenticator } = require("./middleware");
const User = require("./schema/User");
const Audit = require("./schema/Audit");

module.exports = function (app) {
  app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({
      email: email
    }).exec();

    if (user) {
      res.sendStatus(409);
    } else {
      const newUser = new User({
        name: name,
        email: email
      });
      newUser.password = newUser.generateHash(password);
      newUser.save(err => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") }
    }).exec();

    if (user && user.validPassword(password)) {
      const token = jwt.sign(user.email, process.env.SECRET);
      res.json({ token: token });
    } else {
      res.sendStatus(404);
    }
  });

  app.get("/api/verifytoken", tokenAuthenticator, async (req, res) => {
    res.sendStatus(204);
  });

  app.get("/api/test", tokenAuthenticator, async (req, res) => {
    res.send(req.email);
  });

  app.get("/api/get-user", tokenAuthenticator, async (req, res) => {
    const user = await User.findOne({ email: req.email }).exec();
    res.send(user);
  });

  // DocuSign envelope should be sent out here
  // Send out notification emails
  app.post("/api/start-audit", tokenAuthenticator, async (req, res) => {
    const { name, id, reviewers } = req.body;

    const facilitator = await User.findOne({ email: req.email }).exec();

    let reviewersList = [];

    for (const reviewerEmail of reviewers) {
      const reviewer = await User.findOne({ email: reviewerEmail }).exec();
      if (reviewer) {
        reviewersList.push(reviewer._id);
      }
    }

    const audit = new Audit({
      name: name,
      facilitator: facilitator._id,
      reviewers: reviewersList,
      webmapID: id,
      cycle: 1,
      reviews: [],
      status: "awaiting responses"
    });

    try {
      const savedAudit = await audit.save();
      facilitator.audits.push(savedAudit._id);
      reviewersList.forEach(async reviewerID => {
        const reviewer = await User.findOne({ _id: reviewerID }).exec();
        reviewer.audits.push(savedAudit._id);
        await reviewer.save();
      });
      await facilitator.save();
      res.sendStatus(201);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/api/get-audits", tokenAuthenticator, async (req, res) => {
    const user = await User.findOne({ email: req.email }).exec();
    const audits = await Audit.find({
      $or: [{ facilitator: user._id }, { reviewers: user._id }]
    }).exec();
    res.send(audits);
  });

  app.get("/api/get-reviewers", tokenAuthenticator, async (req, res) => {
    const users = await User.find({ email: { $ne: req.email } }).exec();
    res.send(users);
  });

  app.post("/api/submit-review", tokenAuthenticator, async (req, res) => {
    console.log("submit-review");
  });

  app.post(
    "/api/submit-modifications",
    tokenAuthenticator,
    async (req, res) => {
      console.log("submit-modifications");
    }
  );

  // Integrate with DocuSign webhook to determine if a user has signed their approval
  app.post("/api/docusignwebhook", (req, res) => {
    console.log("here");
  });
};
