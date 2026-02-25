require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI manquant dans .env");

    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    const email = "admin@russell.fr";
    const password = "Admin1234!";

    const hash = await bcrypt.hash(password, 10);

    // upsert: crée ou remplace si déjà existant
    await User.findOneAndUpdate(
      { email },
      { username: "admin", email, password: hash },
      { upsert: true, new: true }
    );

    const check = await User.findOne({ email });
    console.log("✅ Admin prêt :", check.email, " / mot de passe :", password);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ seed-admin error:", err.message);
    process.exit(1);
  }
})();