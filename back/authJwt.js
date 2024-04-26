const jwt = require("jsonwebtoken");
const config = require("../back/auth.config.js");

verifyTokenAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({
      message: "Nema tokena!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Neautorizirano!",
      });
    }
    req.userId = decoded.id;
    if (decoded.uloga === 0) {
      next();
    } else {
      res.status(403).send({
        message: "Potrebna je admin uloga!",
      });
    }
  });
};

verifyTokenUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({
      message: "Nema tokena!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Neautorizirano!",
      });
    }
    req.userId = decoded.id;
  });
  next();
};

verifyTokenPosebno = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(403).send({
        message: "Nema tokena!",
      });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Neautorizirano!",
        });
      }
      req.userId = decoded.id;
      if (decoded.uloga === 0 || decoded.id === req.params.id) { //ili je admin, ili je to TAJ korisnik
        next();
      } else {
        res.status(403).send({
          message: "Potrebna je admin uloga!",
        });
      }
    });
  };

const authJwt = {
  verifyTokenAdmin: verifyTokenAdmin,
  verifyTokenUser: verifyTokenUser,
  verifyTokenPosebno: verifyTokenPosebno,
};
module.exports = authJwt;
