const jwt = require("jsonwebtoken");
const axios = require("axios");
const btoa = require("btoa");
const docusign = require("docusign-esign");

const { tokenAuthenticator } = require("./middleware");

const User = require("./schema/User");
const Audit = require("./schema/Audit");
const Review = require("./schema/Review");

/**
 * Creates document 1
 * @function
 * @private
 * @param {Object} args parameters for the envelope:
 *   <tt>signerEmail</tt>, <tt>signerName</tt>, <tt>ccEmail</tt>, <tt>ccName</tt>
 * @returns {string} A document in HTML format
 */

function document(auditName, mapID, facilitator, reviewers) {
  return `
  <!DOCTYPE html>
  <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family:sans-serif;margin-left:2em;">
      <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
          color: darkblue;margin-bottom: 0;">${auditName}</h1>
      <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
        margin-top: 0px;margin-bottom: 3.5em;font-size: 1em;
        color: darkblue;">Facilitated by ${facilitator.name} (${
    facilitator.email
  })</h2>
  <a href="http://localhost:3000/viewmap/${mapID}">Link to map: http://localhost:3000/viewmap/${mapID}</a>
      <!-- Note the anchor tag for the signature field is in white. -->
      ${reviewers.map(
        reviewer => `
        <h3 style="margin-top:3em;">Approved: <span style="color:white;">**signature_${reviewer._id}**/</span> ${reviewer.name} (${reviewer.email})</h3>
      `
      )}
      </body>
  </html>
`;
}

function reviewDocument(reviews) {
  // let reviews = [];
  // for (const review of cycleData.reviews) {
  //   Review.findOne({ _id: review }, (err, review) => {
  //     console.log("HELLO", review);
  //     reviews.push(review);
  //   });
  // }
  // console.log("REVIEWS", reviews);
  console.log(`
  <!DOCTYPE html>
  <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family:sans-serif;margin-left:2em;">
      ${reviews.map(
        review => `
      <h3>${review.author}</h3>
      <p>${review.verdict}</p>
      <img src="${review.screenshot}" />
      `
      )}
      </body>
  </html>
`);
  return `
  <!DOCTYPE html>
  <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family:sans-serif;margin-left:2em;">
      ${reviews.map(
        review => `
      <h3>${review.author.name} (${review.author.email})</h3>
      <p>${review.verdict}</p>
      <img src="${review.screenshot}" />
      ${
        review.file
          ? `<a href=https://docusign2021.herokuapp.com/${review.file}>File: ${review.file}</a>`
          : ``
      }
      `
      )}
      </body>
  </html>
`;
}

function makeEnvelope(args, auditData, reviewsData, imageData) {
  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = "Please sign the finalized map";

  let docs = [];

  docs.push(
    new docusign.Document.constructFromObject({
      documentBase64: Buffer.from(
        document(
          auditData.name,
          auditData.webmapID,
          auditData.facilitator,
          auditData.reviewers
        )
      ).toString("base64"),
      name: "Document 1",
      fileExtension: "html",
      documentId: 1
    })
  );

  docs.push(
    new docusign.Document.constructFromObject({
      documentBase64: Buffer.from(reviewDocument(reviewsData)).toString(
        "base64"
      ),
      name: "Document 2",
      fileExtension: "html",
      documentId: 2
    })
  );

  // console.log("cycle", auditData.cycle);

  // for (let i = 0; i < auditData.cycle; i++) {
  //   docs.push(
  //     new docusign.Document.constructFromObject({
  //       documentbase64: Buffer.from(
  //         reviewDocument(i + 1, auditData.cycles[i]).toString("base64")
  //       ),
  //       name: `Document ${i + 2}`,
  //       fileExtension: "html",
  //       documentId: i + 2
  //     })
  //   );
  // }

  // let doc = new docusign.Document.constructFromObject({
  //   documentBase64: Buffer.from(document(args, imageData)).toString("base64"),
  //   name: "Document 1",
  //   fileExtension: "html",
  //   documentId: 1
  // });

  console.log(docs);

  env.documents = docs;

  // let signers = [];

  // for (const signer of args) {
  //   let newSigner = docusign.Signer.constructFromObject({
  //     email: signer.signerEmail,
  //     name: signer.signerName,
  //     recipientId: (Math.random() * 100 + 1).toString(),
  //     routingOrder: "1"
  //   })
  //   signers.push(newSigner)
  // }

  let signers = [];
  let signHeres = [];

  let i = 1;
  for (const reviewer of auditData.reviewers) {
    let signer = docusign.Signer.constructFromObject({
      email: reviewer.email,
      name: reviewer.name,
      recipientId: i,
      routingOrder: i
    });
    let signHere = docusign.SignHere.constructFromObject({
      anchorString: `**signature_${reviewer._id}**`,
      anchorYOffset: "10",
      anchorUnits: "pixels",
      anchorXOffset: "20"
    });
    let signerTabs = docusign.Tabs.constructFromObject({
      signHereTabs: [signHere]
    });
    signer.tabs = signerTabs;
    signers.push(signer);
    signHeres.push(signHere);
    i++;
  }

  // let signer = docusign.Signer.constructFromObject({
  //   email: args.signerEmail,
  //   name: args.signerName,
  //   recipientId: "1",
  //   routingOrder: "1"
  // });

  // let signHere = docusign.SignHere.constructFromObject({
  //   anchorString: "**signature_1**",
  //   anchorYOffset: "10",
  //   anchorUnits: "pixels",
  //   anchorXOffset: "20"
  // });

  //asign which signer signs where
  // let signerTabs = docusign.Tabs.constructFromObject({
  //   signHereTabs: [signHere]
  // });
  // signer.tabs = signerTabs;

  // Add the recipients to the envelope object
  let recipients = docusign.Recipients.constructFromObject({
    signers: signers
  });

  env.recipients = recipients;

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = args.status;

  return env;
}

async function sendEnvelope(
  envelopeArgs,
  userAccessToken,
  auditData,
  reviewsData,
  imageData
) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath("https://demo.docusign.net/restapi");
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + userAccessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
    results = null;

  // Make the envelope request body
  let envelope = makeEnvelope(envelopeArgs, auditData, reviewsData, imageData);

  // Call Envelopes::create API method
  // Exceptions will be caught by the calling function
  try {
    results = await envelopesApi.createEnvelope(process.env.DS_API_ACCOUNT_ID, {
      envelopeDefinition: envelope
    });
    let envelopeId = results.envelopeId;
    console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
    return { envelopeId: envelopeId };
  } catch (err) {
    console.log(err);
  }
}

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

  app.get("/api/get-user-by-id", async (req, res) => {
    const id = req.query.id;
    const user = await User.findOne({ _id: id }).exec();
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
      cycles: [
        {
          reviews: [],
          comments: ""
        }
      ],
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

  app.post(
    "/api/get-audit-by-webmapid",
    tokenAuthenticator,
    async (req, res) => {
      const { id } = req.body;
      const audit = await Audit.findOne({ webmapID: id }).exec();
      res.send(audit);
    }
  );

  app.post("/api/get-audit-status", tokenAuthenticator, async (req, res) => {
    const { auditID } = req.body;
    const user = await User.findOne({ email: req.email }).exec();
    const audit = await Audit.findOne({ _id: auditID }).exec();

    if (
      audit.facilitator.toString() === user._id.toString() &&
      audit.status === "awaiting revisions"
    ) {
      res.send("Action required: pending revisions");
    } else if (
      audit.facilitator.toString() === user._id.toString() &&
      audit.status === "awaiting responses"
    ) {
      res.send("Awaiting reviewers");
    } else {
      let found = false;

      for (const reviewID of audit.cycles[audit.cycle - 1].reviews) {
        const review = await Review.findOne({ _id: reviewID }).exec();
        // console.log(review.author.toString(), user._id.toString());
        // console.log(typeof review.author, typeof user._id);
        if (review.author.toString() === user._id.toString()) {
          found = true;
        }
      }

      if (found && audit.status !== "completed") {
        res.send("Awaiting map modifications");
      } else if (!found) {
        res.send("Action required: Review map");
      } else {
        res.send("Audit completed");
      }
    }
  });

  app.post("/api/submit-review", tokenAuthenticator, async (req, res) => {
    const { auditID, sketchLayer, comments } = req.body;
    const user = await User.findOne({ email: req.email }).exec();
    const audit = await Audit.findOne({ _id: auditID }).exec();

    const review = new Review({
      author: user._id,
      sketchLayer: sketchLayer,
      verdict: "changes requested",
      comments: comments
    });

    try {
      const reviewDoc = await review.save();
      audit.cycles[audit.cycle - 1].reviews.push(reviewDoc._id);
      await audit.save();
      // check if all reviews have been submitted
      if (
        audit.cycles[audit.cycle - 1].reviews.length === audit.reviewers.length
      ) {
        audit.status = "awaiting revisions";
        // audit.cycle = audit.cycle + 1;
        // audit.cycles[audit.cycle - 1] = {
        //   reviews: [],
        //   comments: ""
        // };
        await audit.save();
      }
      res.send(reviewDoc);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  app.post(
    "/api/submit-modifications",
    tokenAuthenticator,
    async (req, res) => {
      const { auditID } = req.body;
      const audit = await Audit.findOne({ _id: auditID }).exec();
      audit.cycle = audit.cycle + 1;
      audit.status = "awaiting responses";
      audit.cycles.push({
        reviews: [],
        comments: ""
      });
      await audit.save();
    }
  );

  app.post("/api/finalize-map", tokenAuthenticator, async (req, res) => {
    const { auditID } = req.body;
    const audit = await Audit.findOne({ _id: auditID }).exec();
    // Send out DocuSign
    audit.status = "completed";
    await audit.save();
  });

  // Integrate with DocuSign webhook to determine if a user has signed their approval
  app.post("/api/docusignwebhook", (req, res) => {
    console.log("here");
  });

  app.post("/api/file-upload", tokenAuthenticator, (req, res) => {
    // const {reviewID}
    console.log(req);
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded"
        });
        return;
      }
      //data is the name of the input field
      let file = req.files.file;

      //probably want to autogen name here
      file.mv("./uploads/" + file.name);

      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size
        }
      });
    } catch (err) {
      res.sendStatus(500);
    }
  });

  app.post("/api/oauth", tokenAuthenticator, async (req, res) => {
    const { accessToken } = req.body;

    try {
      const user = await User.findOne({ email: req.email }).exec();
      user.docusign = accessToken;

      await user.save();
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post("/api/send-documents", tokenAuthenticator, async (req, res) => {
    const { auditID } = req.body;
    const audit = await Audit.findOne({ _id: auditID })
      .populate("facilitator")
      .populate("reviewers")
      .exec();
    const user = await User.findOne({ email: req.email }).exec();

    // let docusign_args = [];

    // audit.reviewers.forEach(reviewer => {
    //   docusign_args.push({
    //     signerName: reviewer.name,
    //     signerEmail: reviewer.email,
    //     status: "sent"
    //   });
    // });

    let reviews = [];
    let images = [];
    for (const cycle of audit.cycles) {
      for (const review of cycle.reviews) {
        const reviewDoc = await Review.findOne({ _id: review })
          .populate("author")
          .exec();
        // console.log("review", reviewDoc);
        reviews.push(reviewDoc);
        images.push(reviewDoc.screenshot);
      }
    }

    //  example args
    let docusign_args = {
      signerName: "Alex",
      signerEmail: "alexyu2624@gmail.com",
      status: "sent"
    };

    let accessToken = user.docusign; //get access Token from db
    // let image_data = "";
    await sendEnvelope(docusign_args, accessToken, audit, reviews, images);
    audit.status = "completed";
    await audit.save();
    res.sendStatus(200);
  });

  app.post(
    "/api/get-reviews-for-cycle",
    tokenAuthenticator,
    async (req, res) => {
      const { id, cycle } = req.body;
      const audit = await Audit.findOne({ webmapID: id });
      let reviews = [];

      if (cycle !== -1) {
        for (const review of audit.cycles[cycle - 1].reviews) {
          const reviewDoc = await Review.findOne({ _id: review }).exec();
          reviews.push(reviewDoc);
        }
      } else {
        for (const review of audit.cycles[audit.cycle - 1].reviews) {
          const reviewDoc = await Review.findOne({ _id: review }).exec();
          reviews.push(reviewDoc);
        }
      }
      res.send(reviews);
    }
  );

  app.post("/api/save-image", tokenAuthenticator, async (req, res) => {
    const { reviewID, imageUrl } = req.body;
    const review = await Review.findOne({ _id: reviewID }).exec();
    review.screenshot = imageUrl;
    try {
      await review.save();
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
