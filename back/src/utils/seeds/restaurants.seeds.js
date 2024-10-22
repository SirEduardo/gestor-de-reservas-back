const fs = require("fs");
const mongoose = require("mongoose");
const Restaurant = require("../../api/models/restaurant");

const readAndInsertRestaurants = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    const data = fs.readFileSync(__dirname + "/restaurants.csv", "utf-8");
    const rows = data.split("\r\n");

    const arrayRestaurants = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;

      const columns = row.split("\t");

      if (columns.length < 9) {
        console.error("Formato de fila inválido:", row);
        continue;
      }

      const [name, location, category, img, telephone, opening, closing] =
        columns;
      if (
        !name ||
        !location ||
        !category ||
        !img ||
        !telephone ||
        !opening ||
        !closing
      ) {
        console.error("Datos incompletos en la fila:", row);
        continue;
      }

      const objectRestaurant = {
        name: name.trim(),
        location: location.trim(),
        category: category.trim(),
        img: img.trim(),
        telephone: telephone.trim(),
        opening: opening.trim(),
        closing: closing.trim(),
      };

      arrayRestaurants.push(objectRestaurant);
    }

    if (arrayRestaurants.length > 0) {
      await Restaurant.insertMany(arrayRestaurants);
      console.log(
        `${arrayRestaurants.length} restaurantes insertados en la base de datos`
      );
    } else {
      console.log("No se encontraron restaurantes válidos para insertar");
    }
  } catch (error) {
    console.error("Ocurrió un error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  }
};

readAndInsertRestaurants();
