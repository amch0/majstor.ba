const express = require("express");
const { Router } = express;
const router = Router();

const contact = require("./contact");

router.post("/", contact);

module.exports = router;
