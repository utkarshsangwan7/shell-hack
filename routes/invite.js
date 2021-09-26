const express = require("express");
const passport = require("passport");
const { v4: uuidv4 } = require('uuid');

// * Middleware
const { login } = require("../Middleware/auth");


// * Model
const User = require("../models/User");

// * API Endpoints -->
const router = express.Router();

// * Invite Participant

// * End of API Endpoints -->
module.exports = router;