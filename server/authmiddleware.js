
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

export const adminAuthentication = (req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, username) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.username = username;
      next();
    });
  }else {
    res.sendStatus(401);
  }  
}

export const userAuthentication =  (req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
      ;
      if(err){
        return res.sendStatus(403);
      }
      req.user_id = user.user_id;
      next();
    })
  }else{
    res.sendStatus(401);
  }
}