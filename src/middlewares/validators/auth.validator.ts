import { NextFunction, Request, Response } from "express";
import {
  body,
  validationResult,
  check,
  ValidationError,
} from "express-validator";

const validateSignupRequestBody = [
  // Ensure that the request contains a name
  check("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .escape() // Sanitize to prevent XSS
    .notEmpty()
    .withMessage("Name cannot be empty"),

  // Validate and sanitize username
  check("username")
    .exists()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .escape() // Sanitize to prevent XSS
    .notEmpty()
    .withMessage("Username cannot be empty"),

  // Validate and sanitize email
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .escape() // Sanitize to prevent XSS
    .notEmpty()
    .withMessage("Email cannot be empty"),

  // Password validation
  check("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .trim()
    .escape(), // Sanitize to prevent XSS

  // Validate and sanitize role
  check("role")
    .exists()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string")
    .trim()
    .escape() // Sanitize to prevent XSS
    .notEmpty()
    .withMessage("Role cannot be empty"),

  // Custom error handling
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // console.log("errors in signup validator function ", errors);
    if (!errors.isEmpty()) {
      // Use type assertion to access the path property
      const firstError = errors.array({
        onlyFirstError: true,
      })[0] as ValidationError & { path?: string };

      return res.status(401).json({
        success: false,
        message: firstError.msg,
        field: firstError.path,
      });
    }
    next();
  },
];

const validateLoginRequestBody = [
  // First, ensure that the request contains either username or email
  (req: Request, res: Response, next: NextFunction) => {
    const { username, email } = req.body;

    if (username === undefined && email === undefined) {
      return res.status(401).json({
        success: false,
        message: "Either username or email is required.",
        field: "username or email",
      });
    }
    next();
  },

  // Validate and sanitize username if it exists
  check("username")
    .optional()
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .escape() // Sanitize to prevent XSS
    .notEmpty()
    .withMessage("Username cannot be empty"),

  // Validate and sanitize email if it exists
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .escape() // Sanitize to prevent XSS
    .notEmpty()
    .withMessage("Email cannot be empty"),

  // Password validation
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .trim()
    .escape(), // Sanitize to prevent XSS

  // Custom error handling
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Use type assertion to access the path property
      const firstError = errors.array({
        onlyFirstError: true,
      })[0] as ValidationError & { path?: string };

      return res.status(401).json({
        success: false,
        message: firstError.msg,
        field: firstError.path,
      });
    }
    next();
  },
];

export { validateLoginRequestBody, validateSignupRequestBody };
