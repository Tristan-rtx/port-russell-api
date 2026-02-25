const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

async function listCatways(req, res) {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.json(catways);
}

async function getCatway(req, res) {
  const catwayNumber = Number(req.params.id);
  const catway = await Catway.findOne({ catwayNumber });
  if (!catway) return res.status(404).json({ error: "Catway introuvable" });
  res.json(catway);
}

async function createCatway(req, res) {
  const { catwayNumber, catwayType, catwayState } = req.body;
  const created = await Catway.create({ catwayNumber, catwayType, catwayState });
  res.status(201).json(created);
}

async function updateCatway(req, res) {
  // Important : l'énoncé dit que seul catwayState est modifiable
  const catwayNumber = Number(req.params.id);
  const { catwayState } = req.body;

  const updated = await Catway.findOneAndUpdate(
    { catwayNumber },
    { catwayState },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ error: "Catway introuvable" });
  res.json(updated);
}

async function deleteCatway(req, res) {
  const catwayNumber = Number(req.params.id);

  // Optionnel : supprimer aussi les réservations liées
  await Reservation.deleteMany({ catwayNumber });

  const deleted = await Catway.findOneAndDelete({ catwayNumber });
  if (!deleted) return res.status(404).json({ error: "Catway introuvable" });

  res.json({ ok: true });
}

module.exports = {
  listCatways,
  getCatway,
  createCatway,
  updateCatway,
  deleteCatway,
};