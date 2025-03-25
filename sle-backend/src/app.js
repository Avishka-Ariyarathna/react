import express from "express";
import path from "path"; // Import path module
import { checkConnection } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import cors from "cors";
import plantRoutes from "./routes/plantRoutes.js";
import deduruoyaRoutes from "./routes/deduruoyaRoutes.js";
import biomedRoutes from "./routes/biomedRoutes.js";
import kumbalRoutes from "./routes/kumbalRoutes.js";
import mempRoutes from "./routes/mempRoutes.js";
import productionRoutes from "./routes/productionRoutes.js";
import aluminumRoutes from "./routes/aluminumRoutes.js";
import aluminlabourRoutes from "./routes/aluminlabourRoutes.js";
import aluminstatusRoutes from "./routes/aluminStatusRoutes.js";
import eventRoutes from "./routes/eventRouter.js";
import plantDataRoutes from "./routes/plantDataRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";
import getuseridRoutes from "./routes/getuseridRoutes.js";
import commentRoutes from "./routes/commentRoutes.js"; // Import comment routes
import expenditureRoutes from "./routes/expenditureRoutes.js"; // Import comment routes
import receivableRoutes from "./routes/receivableRoutes.js"; // Import comment routes
import machineRoutes from "./routes/machineRoutes.js"; // Import comment routes
import KmachineRoutes from "./routes/KmachineRoutes.js"; // Import comment routes
import BmachineRoutes from "./routes/BmachineRoutes.js"; // Import comment routes
import mempmachineRoutes from "./routes/mempmachineRoutes.js"; // Import comment routes
import DailyImgRoutes from "./routes/deduruDailyImagesRoutes.js"; // Import comment routes
import kumbalImageRoutes from "./routes/kumbalImageRoutes.js"; // Import comment routes
import biomedImageRoutes from "./routes/biomedImageRoutes.js"; // Import comment routes
import mempImageRoutes from "./routes/mempImageRoutes.js"; // Import comment routes
import aluminImageRoutes from "./routes/aluminImageRoutes.js"; // Import comment routes
import solorImageRoutes from "./routes/solorImageRoutes.js"; // Import comment routes
import manpowerRoutes from "./routes/manpowerRoutes.js";
import projectSummaryRoutes from "./routes/projectSummaryRoutes.js";

const app = express();

// Use path to correctly resolve the uploads folder
const __dirname = path.resolve(); // ES module equivalent of __dirname

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); // Middleware to parse JSON bodies
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // Use auth routes for API calls
app.use("/uploads", express.static("uploads"));

app.use("/api/plants", plantRoutes);
app.use("/api/deduruoya-data", deduruoyaRoutes);
app.use("/api/biomed-data", biomedRoutes);
app.use("/api/kumbalgamuwa-data", kumbalRoutes);
app.use("/api/memp-data", mempRoutes);
app.use("/api/memp-productn", productionRoutes);
app.use("/api/aluminum-data", aluminumRoutes);
app.use("/api/aluminumlabour-data", aluminlabourRoutes);
app.use("/api/aluminumstatus-data", aluminstatusRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/plant-data", plantDataRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/getusers", getuseridRoutes);
app.use("/api/comments", commentRoutes); // Add comments route
app.use("/api/expenditure", expenditureRoutes); // Add comments route
app.use("/api/receivable", receivableRoutes); // Add comments route
app.use("/api/machines", machineRoutes); // Add comments route
app.use("/api/kmachines", KmachineRoutes); // Add comments route
app.use("/api/bmachines", BmachineRoutes); // Add comments route
app.use("/api/mempmachines", mempmachineRoutes); // Add comments route
app.use("/api/deduru-daily-images", DailyImgRoutes); // Add comments route
app.use("/api/kumbal-daily-images", kumbalImageRoutes); // Add comments route
app.use("/api/biomed-daily-images", biomedImageRoutes); // Add comments route
app.use("/api/memp-daily-images", mempImageRoutes); // Add comments route
app.use("/api/alumin-daily-images", aluminImageRoutes); // Add comments route
app.use("/api/solor-daily-images", solorImageRoutes); // Add comments route
app.use("/api/manpower", manpowerRoutes);
app.use("/api/project-summary", projectSummaryRoutes);

app.listen(4000, async () => {
  console.log("Server running on port 4000");
  try {
    await checkConnection();
    await createAllTable();
  } catch (error) {
    console.log("Failed to initialize the database", error);
  }
});
