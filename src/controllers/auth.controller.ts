// Import npm modules
import { compareSync, hashSync } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";

// Import database
import { db } from "../configs/db.config";

// Import configs
import { authConfig } from "../configs/auth.config";
import { userStatus } from "../utils/constants";

// Function for admin signup
export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, username, email, password, role } = req.body;

  // Check if salt is set
  if (!authConfig.salt) {
    console.error("Authentication error: Salt is not set in auth config.");

    return res.status(500).send({
      status: 500,
      success: false,
      message: "Internal server error during user registration.",
    });
  }

  // Check if secret is set
  if (!authConfig.secret) {
    console.error("Authentication error: Secret is not set in auth config.");

    return res.status(500).send({
      status: 500,
      success: false,
      message: "Internal server error during user registration.",
    });
  }

  // Check if username already exists
  const existingUsername = await db.users.findUnique({
    where: { Username: username },
  });

  if (existingUsername) {
    return res.status(409).send({
      success: false,
      message: "Username must be unique.",
    });
  }

  // Check if username already exists
  const existingEmail = await db.users.findUnique({
    where: { Email: email },
  });

  if (existingEmail) {
    return res.status(409).send({
      success: false,
      message: "Email must be unique.",
    });
  }

  // Encrypt password
  // const PasswordHash = password;
  const PasswordHash = hashSync(password, parseInt(authConfig.salt));

  // Fetch and store user data in user object
  const userData = {
    Name: name,
    Username: username,
    Email: email,
    PasswordHash: PasswordHash,
    Role: role,
    Status: userStatus.active,
  };

  // Create user
  try {
    const userCreated = await db.users.create({
      data: userData,
    });

    const { PasswordHash: _, ...userWithoutPassword } = userCreated;

    console.info(
      `${userWithoutPassword.Role} ${userWithoutPassword.Username} created.`
    );

    // Issue jwt token and add user name and email to payload
    const token = sign(
      {
        username: userCreated.Username,
        role: userCreated.Role,
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
      message: `${userWithoutPassword.Role} ${userWithoutPassword.Username} registered.`,
      accessToken: token,
      user: userWithoutPassword,
    });
  } catch (err: any) {
    console.error("Error while creating user: ", err.message);

    return res.status(500).send({
      status: 500,
      success: false,
      message: "Internal server error while registering user.",
    });
  }
};

// Function for user login
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  // Check if secret is set
  if (!authConfig.secret) {
    console.error("Authentication error: Secret is not set in auth config.");

    return res.status(500).send({
      status: 500,
      success: false,
      message: "Internal server error during user authentication.",
    });
  }

  try {
    // Fetch user by username
    const user = await db.users.findFirst({
      where: { Username: username },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Validate password
    if (!user.PasswordHash) {
      console.error("User password hash is not found in database.");

      return res.status(500).send({
        success: false,
        message: "Internal server error during user authentication.",
      });
    }

    const passwordIsValid = compareSync(password, user.PasswordHash);

    if (!passwordIsValid) {
      return res.status(401).send({
        success: false,
        message: "Wrong password.",
      });
    }

    // Issue jwt token
    const token = sign(
      {
        username: user.Username,
        role: user.Role,
        email: user.Email,
        purpose: "Authentication",
      },
      authConfig.secret,
      {
        expiresIn: authConfig.jwtExpiryTime ? authConfig.jwtExpiryTime : "1d",
      }
    );

    const { PasswordHash: _, ...userWithoutPassword } = user;

    console.info(
      `${userWithoutPassword.Role} ${userWithoutPassword.Username} logged in.`
    );

    return res.status(200).send({
      success: true,
      message: `${userWithoutPassword.Role} ${userWithoutPassword.Username} logged in.`,
      accessToken: token,
      user: userWithoutPassword,
    });
  } catch (err: any) {
    console.error("Error during user authentication: ", err.message);
    return res.status(500).send({
      status: 500,
      success: false,
      message: "Internal server error during user authentication.",
    });
  }
};

// Function for user logout
export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token = req.headers["x-access-token"] as string;

  if (!token) {
    console.error("Token is required for logout.");

    return res.status(400).send({
      success: false,
      message: "Token is required for logout.",
    });
  }

  try {
    // Check if secret is set
    if (!authConfig.secret) {
      console.error("Authentication error: Secret is not set in auth config.");
      return res.status(500).send({
        status: 500,
        success: false,
        message: "Internal server error during user logout.",
      });
    }

    // Verify the token to get the user info
    const decodedToken = verify(token, authConfig.secret) as JwtPayload;

    // Check if the token is blacklisted
    const tokenIsBlacklisted = await db.tokenblacklist.findFirst({
      where: { token },
    });

    // If the token is blacklisted, return an error
    if (tokenIsBlacklisted) {
      console.error("Token is blacklisted.");

      return res.status(401).send({
        success: false,
        message: "Token is blacklisted. Please login again.",
      });
    }

    // Add the token to the blacklist
    await db.tokenblacklist.create({
      data: { token },
    });

    // Update user's status to inactive
    await db.users.update({
      where: { Username: decodedToken.username },
      data: { Status: userStatus.inactive },
    });

    console.info(`${decodedToken.role} ${decodedToken.username} logged out.`);

    return res.status(200).send({
      success: true,
      message: `${decodedToken.role} ${decodedToken.username} logged out.`,
    });
  } catch (err: any) {
    console.error("Error during user logout: ", err.message);
    return res.status(500).send({
      status: 500,
      success: false,
      message: "Internal server error during user logout.",
    });
  }
};