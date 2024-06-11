/** App Server */
// Import npm modules
import express from "express";

// Import configs
import { PORT } from "./configs/server.config";

// Create express app
const app = express();

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to 'PSCPL-Payroll-Server'.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`PSCPL Payroll Server started at PORT : ${PORT}`);
});
