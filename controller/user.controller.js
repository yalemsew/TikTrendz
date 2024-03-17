const User = require("../model/user.model.js");

// Create and Save a new User
exports.create = (req, res) => {
  // TODO: Add your logic here
  //test
  // test111
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.findAll()
    .then((users) => {
      console.log(users);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  // TODO: Add your logic here
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // TODO: Add your logic here
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  // TODO: Add your logic here
};
