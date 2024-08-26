import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    
    if (email!=="" && password!=="") {
      const user = await User.create({ email, password });
      res.cookie("jwt", createToken(email, user.id), {
        maxAge,
        secure: true,  //https
        sameSite: "None",
      });

      return res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          password: user.password,
          profileSetup: user.profileSetup,
        },
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
