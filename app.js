require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const ConnectMongo = require("connect-mongo");
const MongoStore = ConnectMongo?.create
  ? ConnectMongo
  : (ConnectMongo?.default?.create ? ConnectMongo.default : ConnectMongo);
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

// --- Config ---
const PORT = Number(process.env.PORT) || 8080;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI manquant dans .env");
  process.exit(1);
}

// --- Middlewares ---
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session (API privée) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_me",
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

// --- Routes (minimum viable) ---
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Port de Russell API",
    status: "ok",
    port: PORT,
    docs: "/api-doc (à ajouter)",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// --- Start ---
(async () => {
  try {
    mongoose.set("strictQuery", true);
    console.log("⏳ Connexion à MongoDB...", MONGO_URI);
    await mongoose.connect(MONGO_URI, {  
    serverSelectionTimeoutMS: 5000,
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
