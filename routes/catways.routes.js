const express = require("express");
const { requireAuth } = require("../middleware/auth");

const catwaysCtrl = require("../controllers/catways.controller");
const reservationsCtrl = require("../controllers/reservations.controller");

const router = express.Router();
router.use(requireAuth);

// Catways CRUD (routes demandées)
router.get("/", catwaysCtrl.listCatways);           // GET /catways
router.get("/:id", catwaysCtrl.getCatway);          // GET /catways/:id  (id = catwayNumber)
router.post("/", catwaysCtrl.createCatway);         // POST /catways
router.put("/:id", catwaysCtrl.updateCatway);       // PUT /catways/:id  (modifie seulement catwayState)
router.delete("/:id", catwaysCtrl.deleteCatway);    // DELETE /catways/:id

// Reservations (sous-ressource d'un catway)
router.get("/:id/reservations", reservationsCtrl.listReservationsForCatway);                 // GET /catways/:id/reservations
router.get("/:id/reservations/:idReservation", reservationsCtrl.getReservation);             // GET /catways/:id/reservations/:idReservation
router.post("/:id/reservations", reservationsCtrl.createReservation);                         // POST /catways/:id/reservations
router.put("/:id/reservations/:idReservation", reservationsCtrl.updateReservation);           // PUT /catways/:id/reservations/:idReservation
router.delete("/:id/reservations/:idReservation", reservationsCtrl.deleteReservation);        // DELETE /catways/:id/reservations/:idReservation

module.exports = router;