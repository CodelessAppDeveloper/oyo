const express = require("express");
const router = express.Router();
const { hashedPassword } = require("../Utilities/hashing");
const PricingService = require("./../services/pricing_service");
const pricing_service = new PricingService();
// Importing the model
const apiModel = require("../models/model");

// Check for persona type and set the table
const checkPersona = (personaType, res) => {
  if (personaType.toLowerCase() === "cu") {
    return "customers";
  } else if (personaType.toLowerCase() === "ho") {
    return "hotels";
  } else {
    return;
  }
};

router.get("/health", async (req, res, next) => {
  try {
    res.json(JSON.parse(JSON.stringify("I'm Up!")));
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error: Please try again",
    });
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { personaType, email, password } = req.body;
    let table = await checkPersona(personaType, res);
    if (!table) res.status(500).send("Persona not specified.");
    else {
      // Invoke the query
      const results = await apiModel.login(table, email);
      if (results.length > 0) {
        if (hashedPassword(password) === results[0].password) {
          // Return the response
          res.json(JSON.parse(JSON.stringify(results[0])));
        } else {
          // Auth Error
          res.status(401).json({
            error: "Incorrect Password",
          });
        }
      } else {
        // Auth Error
        res.status(401).json({
          error: "Incorrect Email or Password",
        });
      }
    }
  } catch (e) {
    // Server Error
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error: Please try again",
    });
  }
});

// Register User
router.post("/register", async (req, res, next) => {
  // TO-DO: check if email already exists
  try {
    console.log(req.body.password);
    let personaType = req.body.personaType;
    delete req.body.personaType;
    // Hash the password
    req.body.password = hashedPassword(req.body.password);
    let table = await checkPersona(personaType, res);
    console.log(table);
    if (!table) res.status(500).send("Persona not specified.");
    else {
      // Invoke the querybuilder
      console.log(req.body);

      await apiModel.register(req.body, table);
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("Success");
    }
  } catch (e) {
    // Server Error
    console.error(e);
    res.status(500).json({
      error: e,
    });
  }
});

router.get("/getPoints/:userId?", async (request, response) => {
  const { params } = request;
  const { room_id } = params;
  try {
    // const { status, ...data } = await room_service.getRooms(room_id);
    const rewards = await pricing_service.customer_rewards(room_id);
    console.log(rewards);
    return response.status(200).send({ rewards });
  } catch (err) {
    console.error(`HotelRoutes::GET /rooms:: Internal server error \n${err}`);
    return response.status(500).send({ msg: "Internal  Server Error" });
  }
});

module.exports = router;
