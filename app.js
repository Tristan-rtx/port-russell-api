// app.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// connect-mongo exports differ by version (CJS/ESM). This adapter supports both.
const ConnectMongo = require("connect-mongo");
const MongoStore = ConnectMongo?.create
  ? ConnectMongo
  : (ConnectMongo?.default?.create ? ConnectMongo.default : ConnectMongo);

// App
const app = express();

// --- Config ---
const PORT = Number(process.env.PORT) || 8080;
const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || "change_me";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI manquant dans .env");
  process.exit(1);
}

// --- Imports (models + middleware + routes) ---
const Reservation = require("./models/Reservation");
const { requireAuth } = require("./middleware/auth");

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const catwaysRoutes = require("./routes/catways.routes");

// --- Middlewares ---
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static + views (EJS)
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Session (API privée) ---
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store:
      typeof MongoStore.create === "function"
        ? MongoStore.create({ mongoUrl: MONGO_URI })
        : MongoStore({ mongoUrl: MONGO_URI }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // à activer en HTTPS en prod
    },
  })
);

// --- Routes (pages) ---
app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  return res.render("home", { error: null });
});

app.get("/api-doc", (req, res) => res.render("api-doc"));

app.get("/dashboard", requireAuth, async (req, res) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const currentReservations = await Reservation.find({
    startDate: { $lte: end },
    endDate: { $gte: start },
  }).sort({ startDate: 1 });

  return res.render("dashboard", {
    user: req.session.user,
    today: now.toLocaleDateString(),
    currentReservations,
  });
});

// Placeholders (menu dashboard) — on fera les CRUD après
app.get("/dashboard/catways", requireAuth, (req, res) => {
  res.send("CRUD Catways (à faire)");
});

app.get("/dashboard/reservations", requireAuth, (req, res) => {
  res.send("CRUD Réservations (à faire)");
});

app.get("/dashboard/users", requireAuth, (req, res) => {
  res.send("CRUD Users (à faire)");
});

// --- Routes (API) ---
app.use("/", authRoutes);
app.use("/users", usersRoutes);
app.use("/catways", catwaysRoutes);
app.use("/catway", catwaysRoutes); // alias (au cas où)

// --- Health check ---
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// --- Start ---
(async () => {
  try {
    mongoose.set("strictQuery", true);
    console.log("⏳ Connexion à MongoDB...", MONGO_URI);

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast si Mongo ne répond pas
    });

    console.log("✅ MongoDB connecté");

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré : http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erreur démarrage serveur:", err);
    process.exit(1);
  }
})();