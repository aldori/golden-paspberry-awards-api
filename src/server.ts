import express from "express";
import movieRoutes from "./routes/movie.routes";
import producerRoutes from "./routes/producer.routes";
import studioRoutes from "./routes/studio.routes";
import cors from "cors";
import { setupDatabase } from "../src/config/db";
import { importData } from "./services/importaData.service";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../docs/swagger"

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/movies", movieRoutes);
app.use("/producers", producerRoutes);
app.use("/studios", studioRoutes);

app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

const startServer = async () => {
  try {
    console.log("===== Creating database =====");
    await setupDatabase();
    console.log("Finished!");
    console.log("===== Importing data from CSV file =====");
    await importData();
    console.log("Finished!");
    app.listen(PORT, () => {
      console.log(`====  API - Listen port: ${PORT}  ====`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
