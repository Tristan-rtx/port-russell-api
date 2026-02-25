const Reservation = require("../models/Reservation");
const Catway = require("../models/Catway");

async function listReservationsForCatway(req, res) {
  const catwayNumber = Number(req.params.id);
  const list = await Reservation.find({ catwayNumber }).sort({ startDate: -1 });
  res.json(list);
}

async function getReservation(req, res) {
  const catwayNumber = Number(req.params.id);
  const idReservation = req.params.idReservation;

  const reservation = await Reservation.findOne({ _id: idReservation, catwayNumber });
  if (!reservation) return res.status(404).json({ error: "Réservation introuvable" });

  res.json(reservation);
}

async function createReservation(req, res) {
  const catwayNumber = Number(req.params.id);

  // Vérifie que le catway existe
  const catway = await Catway.findOne({ catwayNumber });
  if (!catway) return res.status(404).json({ error: "Catway introuvable" });

  const { clientName, boatName, startDate, endDate } = req.body;

  const created = await Reservation.create({
    catwayNumber,
    clientName,
    boatName,
    startDate,
    endDate,
  });

  res.status(201).json(created);
}

async function updateReservation(req, res) {
  const catwayNumber = Number(req.params.id);
  const idReservation = req.params.idReservation;

  const { clientName, boatName, startDate, endDate } = req.body;

  const updated = await Reservation.findOneAndUpdate(
    { _id: idReservation, catwayNumber },
    { clientName, boatName, startDate, endDate },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ error: "Réservation introuvable" });
  res.json(updated);
}

async function deleteReservation(req, res) {
  const catwayNumber = Number(req.params.id);
  const idReservation = req.params.idReservation;

  const deleted = await Reservation.findOneAndDelete({ _id: idReservation, catwayNumber });
  if (!deleted) return res.status(404).json({ error: "Réservation introuvable" });

  res.json({ ok: true });
}

module.exports = {
  listReservationsForCatway,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};