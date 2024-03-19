const mongoose = require("mongoose");

exports.fetch = (api) => (req, res) => {
  api.public
    .explore({
      session_id: 0,
      country: "us",
    })
    .then((response) => {
      console.log(response.json);
      res.json(response.json);
    })
    .catch((err) => {
      console.log(err?.statusCode, err?.message, err?.json);
    });
};
