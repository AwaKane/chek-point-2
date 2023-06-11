const express = require("express");
const PORT = 5000;

const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Middleware pour gérer la disponibilité de l'application
const availabilityMiddleware = (req, res, next) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (lundi) à 6 (dimanche)
  const currentHour = currentDate.getHours(); // 0 à 23

  // Vérifier si le jour actuel est un lundi ou un vendredi
  if (currentDay === 0 || currentDay === 4) {
    // Vérifier si l'heure actuelle est entre 9h et 17h
    if (currentHour >= 9 && currentHour < 17) {
      // L'application est disponible, passer au middleware suivant
      next();
    } else {
      // En dehors des heures d'ouverture, renvoyer une réponse 503 (Service Unavailable)
      res
        .status(503)
        .sendFile(path.join(__dirname, "public", "middleware.html"));
    }
  } else {
    // En dehors des jours autorisés, renvoyer une réponse 503 (Service Unavailable)
    res.status(503).sendFile(path.join(__dirname, "public", "middleware.html"));
  }
};

// Utilisation du middleware
app.use(availabilityMiddleware);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Accueil.html"));
});

app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "services.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.listen(PORT, () => {
  console.log(`Le serveur à démqré sur le port ${PORT}`);
});
