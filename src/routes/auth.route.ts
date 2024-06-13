// Import controllers
import {
  login,
  logout,
  signUp,
  // resetPassword,
} from "../controllers/auth.controller";

import {
  validateLoginRequestBody,
  validateSignupRequestBody,
} from "../middlewares/validators/auth.validator";
// Import types
import { Application } from "express";

// APIs
const authRoutes = (app: Application) => {
  // API for user sign up
  app.post("/pscpl/api/v1/auth/signup", validateSignupRequestBody, signUp);

  // API for user sign in
  app.post("/pscpl/api/v1/auth/login", validateLoginRequestBody, login);

  // API for user sign out
  app.post("/pscpl/api/v1/auth/logout", logout);

  // API for password reset
  // app.post("/pscpl/api/v1/auth/reset-password", resetPassword);

  // Add other auth-related routes here
};

export default authRoutes;
