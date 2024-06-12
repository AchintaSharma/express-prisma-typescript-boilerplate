// Import npm modules
// import { hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
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
  const PasswordHash = password;
  // const PasswordHash = hashSync(Password, parseInt(authConfig.salt));

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

    console.log(
      `${userWithoutPassword.Role} ${userWithoutPassword.Username} created.`
    );

    // Issue jwt token and add user name and email to payload
    const token = sign(
      {
        username: userCreated.Username,
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
    console.log("Error while creating user: ", err.message);
    return res.status(500).send({
      status: 500,
      success: false,
      error: "Internal server error while registering user.",
    });
  }
};

// // Function for user login
// export const login = async (req: Request, res: Response): Promise<Response> => {
//   const { username, password } = req.body;

//   // Check if secret is set
//   if (!authConfig.secret) {
//     console.error("Authentication error: Secret is not set in auth config.");

//     return res.status(500).send({
//       status: 500,
//       success: false,
//       error: "Internal server error during user authentication.",
//     });
//   }

//   try {
//     // Fetch user by username
//     const user = await db.users.findUnique({
//       where: { Username: username },
//     });

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         error: "User not found.",
//       });
//     }

//     // Validate password
//     // const passwordIsValid = compareSync(password, user.PasswordHash);
//     const passwordIsValid = true;

//     if (!passwordIsValid) {
//       return res.status(401).send({
//         success: false,
//         error: "Invalid password.",
//       });
//     }

//     // Issue jwt token
//     const token = sign(
//       {
//         username: user.Username,
//         email: user.Email,
//         purpose: "Authentication",
//       },
//       authConfig.secret,
//       {
//         expiresIn: authConfig.jwtExpiryTime ? authConfig.jwtExpiryTime : "1d",
//       }
//     );

//     const { PasswordHash: _, ...userWithoutPassword } = user;

//     return res.status(200).send({
//       success: true,
//       message: "User authenticated successfully.",
//       accessToken: token,
//       user: userWithoutPassword,
//     });
//   } catch (err: any) {
//     console.error("Error during user authentication: ", err.message);
//     return res.status(500).send({
//       status: 500,
//       success: false,
//       error: "Internal server error during user authentication.",
//     });
//   }
// };
