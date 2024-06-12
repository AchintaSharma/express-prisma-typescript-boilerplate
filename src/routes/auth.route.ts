// Import controllers
import {
  signUp,
  // signIn,
  // signOut,
  // resetPassword,
} from "../controllers/auth.controller";

// Import types
import { Application } from "express";

// APIs
const authRoutes = (app: Application) => {
  // API for user sign up
  app.post("/pscpl/api/v1/auth/signup", signUp);

  // API for user sign in
  // app.post("/pscpl/api/v1/auth/signin", signIn);

  // API for user sign out
  // app.post("/pscpl/api/v1/auth/signout", signOut);

  // API for password reset
  // app.post("/pscpl/api/v1/auth/reset-password", resetPassword);

  // Add other auth-related routes here
};

export default authRoutes;
