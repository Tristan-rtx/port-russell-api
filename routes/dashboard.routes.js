const express = require("express");
const bcrypt = require("bcrypt");

const { requireAuth } = require("../middleware/auth");
const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");
const User = require("../models/User");

const router = express.Router();
router.use(requireAuth);

/* =======================
   CATWAYS CRUD (pages)
======================= */
router.get("/catways", async (req, res) => {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.render("dashboard-catways", { user: req.session.user, catways });
});

router.post("/catways", async (req, res) => {
  try {
    const catwayNumber = Number(req.body.catwayNumber);
    const catwayType = req.body.catwayType;
    const catwayState = req.body.catwayState;

    await Catway.create({ catwayNumber, catwayType, catwayState });
    return res.redirect("/dashboard/catways");
  } catch (e) {
    return res.status(400).send(`Erreur création catway: ${e.message}`);
  }
});

router.post("/catways/:id", async (req, res) => {
  // HTML form -> PUT via _method
  res.status(405).send("Use PUT via _method");
});

router.put("/catways/:id", async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    // règle énoncé : seul catwayState modifiable
    await Catway.findOneAndUpdate(
      { catwayNumber },
      { catwayState: req.body.catwayState },
      { runValidators: true }
    );
    return res.redirect("/dashboard/catways");
  } catch (e) {
    return res.status(400).send(`Erreur update catway: ${e.message}`);
  }
});

router.delete("/catways/:id", async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    await Reservation.deleteMany({ catwayNumber });
    await Catway.findOneAndDelete({ catwayNumber });
    return res.redirect("/dashboard/catways");
  } catch (e) {
    return res.status(400).send(`Erreur delete catway: ${e.message}`);
  }
});

/* =======================
   RESERVATIONS CRUD (pages)
======================= */
router.get("/reservations", async (req, res) => {
  const reservations = await Reservation.find().sort({ startDate: -1 });
  res.render("dashboard-reservations", { user: req.session.user, reservations });
});

router.post("/reservations", async (req, res) => {
  try {
    const catwayNumber = Number(req.body.catwayNumber);
    const clientName = req.body.clientName;
    const boatName = req.body.boatName;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    // Option: vérifier que le catway existe
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) return res.status(400).send("Catway inexistant");

    await Reservation.create({ catwayNumber, clientName, boatName, startDate, endDate });
    return res.redirect("/dashboard/reservations");
  } catch (e) {
    return res.status(400).send(`Erreur création réservation: ${e.message}`);
  }
});

router.put("/reservations/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Reservation.findByIdAndUpdate(
      id,
      {
        catwayNumber: Number(req.body.catwayNumber),
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      },
      { runValidators: true }
    );
    return res.redirect("/dashboard/reservations");
  } catch (e) {
    return res.status(400).send(`Erreur update réservation: ${e.message}`);
  }
});

router.delete("/reservations/:id", async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    return res.redirect("/dashboard/reservations");
  } catch (e) {
    return res.status(400).send(`Erreur delete réservation: ${e.message}`);
  }
});

/* =======================
   USERS CRUD (pages)
======================= */
router.get("/users", async (req, res) => {
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
  res.render("dashboard-users", { user: req.session.user, users });
});

router.post("/users", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).send("Email déjà utilisé");

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });
    return res.redirect("/dashboard/users");
  } catch (e) {
    return res.status(400).send(`Erreur création user: ${e.message}`);
  }
});

router.put("/users/:email", async (req, res) => {
  try {
    const email = String(req.params.email).toLowerCase().trim();
    const update = {};
    if (req.body.username) update.username = String(req.body.username).trim();
    if (req.body.password) update.password = await bcrypt.hash(String(req.body.password), 10);

    await User.findOneAndUpdate({ email }, update, { runValidators: true });
    return res.redirect("/dashboard/users");
  } catch (e) {
    return res.status(400).send(`Erreur update user: ${e.message}`);
  }
});

router.delete("/users/:email", async (req, res) => {
  try {
    const email = String(req.params.email).toLowerCase().trim();
    await User.findOneAndDelete({ email });
    return res.redirect("/dashboard/users");
  } catch (e) {
    return res.status(400).send(`Erreur delete user: ${e.message}`);
  }
});

module.exports = router;