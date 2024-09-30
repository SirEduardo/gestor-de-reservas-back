const fs = require("fs");
const mongoose = require("mongoose");
const Restaurant = require("../../api/models/restaurant");

const readAndInsertRestaurants = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://eduardosaanchezlopez:ogBV5Vm0RqNIpSve@gestion-de-reservas.gdlcc.mongodb.net/?retryWrites=true&w=majority&appName=gestion-de-reservas"
    );
    const data = fs.readFileSync(__dirname + "/restaurants.csv", "utf-8");
    const rows = data.split("\r\n");

    const arrayRestaurants = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;

      const columns = row.split("\t");
      if (columns.length < 9) {
        console.error("Invalid row format:", row);
        continue;
      }

      const objectRestaurant = {
        name: columns[1],
        location: columns[2],
        category: columns[4],
        img: columns[5],
        telephone: columns[6],
        opening: columns[7],
        closing: columns[8],
      };
      arrayRestaurants.push(objectRestaurant);
    }
    await Restaurant.insertMany(arrayRestaurants);
    console.log("Restaurants inserted in the DB");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

readAndInsertRestaurants();
