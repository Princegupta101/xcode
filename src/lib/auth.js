import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {connectDB} from './db';
import { Admin } from './models';

const SECRET = process.env.JWT_SECRET ;

export async function authenticateAdmin(email, password) {
  await connectDB();  
  let print = await Admin.find({});
  console.log(print);
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return null;
  }
  return jwt.sign({ id: admin._id, email }, SECRET, { expiresIn: '1h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}