/** App Server */
// Import npm modules
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./helpers/logger";

// Import routes
import authRoutes from "./routes/auth.route";

// Import configs
import { PORT } from "./configs/server.config";

// Rate Limiter Middleware: Limit repeated requests to public APIs and/or endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Create express app
const app = express();

// Set various HTTP headers to help protect your app
app.use(helmet());

// Body Parser Middleware
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// Rate Limiter
app.use(limiter);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to 'PSCPL-Payroll-Server'.",
  });
});

// Plug authentication routes
authRoutes(app);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).send({
    success: false,
    message: "Internal server error",
  });
});
// Start the server
app.listen(PORT, () => {
  logger.info(`PSCPL Payroll Server started at PORT: ${PORT}`);
});
