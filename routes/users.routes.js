const express = require("express");
const { body } = require("express-validator");
const { requireAuth } = require("../middleware/auth");
const ctrl = require("../controllers/users.controller");

const router = express.Router();

// API privée -> tout /users nécessite d'être connecté
router.use(requireAuth);

router.get("/", ctrl.listUsers);
router.get("/:email", ctrl.getUser);

router.post(
  "/",
  body("username").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  ctrl.createUser
);

router.put("/:email", ctrl.updateUser);
router.delete("/:email", ctrl.deleteUser);

module.exports = router;