const fs = require("fs");
const User = require("../../api/models/users");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const readAndInsertUsers = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://eduardosaanchezlopez:ogBV5Vm0RqNIpSve@gestion-de-reservas.gdlcc.mongodb.net/?retryWrites=true&w=majority&appName=gestion-de-reservas"
    );

    const data = fs.readFileSync(__dirname + "/users.csv", "utf-8");
    const rows = data.split("\r\n");

    const arrayUsers = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row.trim()) continue;

      const columns = row.split("\t");
      if (columns.length < 4) {
        console.error("Invalid row format:", row);
        continue;
      }

      const objectUsers = {
        userName: columns[1],
        email: columns[2],
        role: columns[3],
        password: bcrypt.hashSync(columns[1].split(" ")[0] + "123", 10),
      };
      arrayUsers.push(objectUsers);
    }

    await User.insertMany(arrayUsers);
    console.log("Users inserted in the DB");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

readAndInsertUsers();
