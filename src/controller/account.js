import mongoose from 'mongoose';
import { Router } from 'express';
import Account  from '../model/account';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';

import { generateAcessToken, respond, authenticate } from '../middleware/authMiddleware';

export default ({ config, db}) => {
  let api = Router();

  //v1/account register
  api.post('/register' , (req,res) => {
    Account.register(new Account({username: req.body.email}), req.body.password, function(err,account){
      if(err){
        res.send(err);
      }
      passport.authenticate(
        'local', {
          session: false
        })(req,res, () =>{
          res.status(200).send('sucessfully created new account!');
        });
      });
    });

 //v1/accountlogin
api.post('/login',passport.authenticate(
  'local', {
    session: false,
    scope: []
  }), generateAcessToken, respond);


api.get('/logout',authenticate , (req,res)=>{
  res.logout();
  res.status(200).send('Sucessfully logged out');

});

api.get('/me',authenticate, (req,res)=>{
  res.status(200).json(req.user);
});


  return api;
}