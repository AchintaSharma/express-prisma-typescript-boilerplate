/** App Server */
// Import npm modules
import express from "express";
import bodyParser from "body-parser";

// Import routes
import authRoutes from "./routes/auth.route";

// Import configs
import { PORT } from "./configs/server.config";

// Create express app
const app = express();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to 'PSCPL-Payroll-Server'.",
  });
});

// Plug app routes
authRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`PSCPL Payroll Server started at PORT : ${PORT}`);
});
