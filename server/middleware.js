const jwt = require("jsonwebtoken");

function tokenAuthenticator(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "4E9CA52E96CB9F57D9363FEEE2DC5", (err, email) => {
    if (err) return res.sendStatus(403);

    req.email = email;

    next();
  });
}

module.exports = {
  tokenAuthenticator: tokenAuthenticator
};
