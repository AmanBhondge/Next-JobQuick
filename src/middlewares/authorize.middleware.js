import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import Auth from '../models/auth.model.js';

const authorize = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; 
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await Auth.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; 
    next(); 

  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

export default authorize;