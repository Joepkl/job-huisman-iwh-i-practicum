require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PAT_TOKEN;

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
};

const ufcFightersObjectTypeId = "2-139796957";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get("/", async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${ufcFightersObjectTypeId}?properties=fighter_name,fighting_style,fight_record`;

  try {
    const response = await axios.get(url, { headers });
    res.render("homepage", {
      title: "UFC Fighters | Integrating With HubSpot I Practicum",
      fighters: response.data.results || [],
    });
  } catch (err) {
    console.error(err);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post("/update-cobj", async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${ufcFightersObjectTypeId}`;

  const body = {
    properties: {
      fighter_name: req.body["fighter-name"],
      fighting_style: req.body["fighting-style"],
      fight_record: req.body["fight-record"],
    },
  };

  try {
    await axios.post(url, body, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("updates", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
      error: "There was an issue processing your request. Please try again.",
    });
  }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
