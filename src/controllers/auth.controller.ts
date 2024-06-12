// Import npm modules
// import { hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Request, Response } from "express";

// Import database
import { db } from "src/configs/db.config";

// Import configs
import { authConfig } from "../configs/auth.config";
import { userStatus } from "../utils/constants";

// Function for admin signup
export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { Username, Email, Password, Role } = req.body;
  console.log("Request api body: ", req.body);
  console.log("authConfig: ", authConfig);

  // Check if salt is set
  if (!authConfig.salt) {
    console.error("Authentication error: Salt is not set in auth config.");

    return res.status(500).send({
      status: 500,
      success: false,
      error: "Internal server error during user registration.",
    });
  }

  // Check if secret is set
  if (!authConfig.secret) {
    console.error("Authentication error: Secret is not set in auth config.");

    return res.status(500).send({
      status: 500,
      success: false,
      error: "Internal server error during user registration.",
    });
  }

  // Encrypt password
  const PasswordHash = Password;
  // const PasswordHash = hashSync(Password, parseInt(authConfig.salt));

  // Fetch and store user data in user object
  const userData = {
    Username,
    Email,
    PasswordHash,
    Role,
    status: userStatus.active,
  };

  // Create user
  try {
    const userCreated = await db.users.create({
      data: userData,
    });

    const { PasswordHash: _, ...userWithoutPassword } = userCreated;

    console.log(`${userWithoutPassword.Username} created.`);

    // Issue jwt token and add user name and email to payload
    const token = sign(
      {
        name: userCreated.Username,
        email: userCreated.Email,
        purpose: "Authentication",
      },
      authConfig.secret,
      {
        expiresIn: authConfig.jwtExpiryTime ? authConfig.jwtExpiryTime : "1d",
      }
    );

    return res.status(201).send({
      success: true,
      message: `${userWithoutPassword.Username} registered.`,
      accessToken: token,
      user: userWithoutPassword,
    });
  } catch (err) {
    // console.log("Error while creating user: ", err.message);
    return res.status(500).send({
      status: 500,
      success: false,
      error: "Internal server error while registering user.",
    });
  }
};
