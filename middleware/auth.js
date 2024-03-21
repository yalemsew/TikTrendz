const jwt = require("jsonwebtoken");

// jwt middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if (token == null) return res.redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");

    req.user = user;
    next();
  });
}

// check role
function requireRoles(roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role);
      return res.redirect("/unauthorized");
    }
    next();
  };
}

module.exports = { authenticateToken, requireRoles };
