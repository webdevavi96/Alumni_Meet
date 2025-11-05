import dotenv from "dotenv";

dotenv.config({
  path: "./.env"
});


import connectDB from "../src/database/connection.js";
import { app } from "./app.js"


connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw (error);
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Seerver is running on Port ${process.env.PORT}`);
    });
  })

  .catch((error) => {
    console.log("MongoDB connection error: ", error);
  });