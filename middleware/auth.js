import jwt from "jsonwebtoken";

const SECRET = "VCET";

export const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, SECRET);
      req.userId = user.id;
      console.log(req.userId);
    } else {
      res.status(401).json({ message: "unauthorized user" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "unauthozied usr" });
  }
};
