const express = require("express");
const router = express.Router();
const axios = require("axios");
const client = require("../elasticsearch/client");
require("log-timestamp");

const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`;

router.get("/earthquakes", async (req, res) => {
  console.log("Loading Application");
  res.json("Running application");

  indexData = async () => {
    try {
      console.log("retrieving data from USGS API");

      const EARTHQUAKES = await axios.get(`${URL}`, {
        Headers: {
          "Content-Type": ["application/json", "charset=utf-8"],
        },
      });

      console.log("Data retrieved");

      result = EARTHQUAKES.data.features;

      console.log("Indexing data...");

      result.map(
        async (result) => (
          (earthquakeObject = {
            place: result.properties.place,
            time: result.properties.time,
            tz: result.properties.tz,
            url: result.properties.url,
            detail: result.properties.detail,
            felt: result.properties.felt,
            cdi: result.properties.cdi,
            alert: result.properties.alert,
            status: result.properties.status,
            tsunami: result.properties.tsunami,
            sig: result.properties.sig,
            net: result.properties.net,
            code: result.properties.code,
            sources: result.properties.sources,
            nst: result.properties.nst,
            dmin: result.properties.dmin,
            rms: result.properties.rms,
            mag: result.properties.mag,
            magType: result.properties.magType,
            type: result.properties.type,
            longitude: result.geometry.coordinates[0],
            latitude: result.geometry.coordinates[1],
            depth: result.geometry.coordinates[2],
          }),
          await client.index({
            index: "earthquakes",
            id: result.id,
            body: earthquakeObject,
            pipeline: "earthquake_data_pipeline",
          })
        )
      );

      if (EARTHQUAKES.data.length) {
        indexData();
      } else {
        console.log("Data has been indexed successfully");
      }
    } catch (err) {
      console.log(err);
    }

    console.log("preparing for the next round of indexing");
  };
  indexData();
});

module.exports = router;
