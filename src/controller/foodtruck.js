import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import bodyParser from 'body-parser';
import Review from '../model/review';

import { authenticate } from '../middleware/authMiddleware';

export default({config,db}) => {
  let api = Router();
  // v1/resutrant/add'
  api.post('/add', authenticate , (req,res) =>{
    let newFTruck = new FoodTruck();
    newFTruck.name = req.body.name;
    newFTruck.id =  req.body.id;
    newFTruck.foodType = req.body.foodType;
    newFTruck.avgcost = req.body.avgcost;
    newFTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFTruck.save(err =>{
      if(err){
        res.send(err);
      }
      res.json({message: "foodtruck saved sucessfully"});
    });
  });

  // get all
  api.get('/',(req,res)=>{
    FoodTruck.find({},(err,foodtrucks)=>{
      if(err){
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });
//get by id
    api.get('/:id' , (req,res)=>{
      FoodTruck.findById(req.params.id, ( err, foodtruck)=>{
        if(err){
          res.send('could not find this foodtruck' + err);
        }
        res.json(foodtruck);
      });
    });
// put + update
//v1/resturant/:id
api.put('/:id', authenticate, (req,res)=>{
    FoodTruck.findById(req.params.id,(err, foodtruck)=>{
      if(err){
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.save(err =>{
        if(err){
          res.send(err);
        }
        res.json({message:" FoodTruck info updated!"});
      });
    });
});
// delete all
  api.delete('/delete',authenticate, (req,res)=>{
    FoodTruck.remove({},(err,foodtruck)=>{
      if(err){
        res.send("cannot not delete" + err);
      }
      res.json('Deleted all collections');
    });
  });

  api.delete('/delete/:id', authenticate, (req,res)=> {
      FoodTruck.remove({id: req.params.id}, (err, foodtruck)=>{
        if(err){
          res.send("Could not find document to delete " + err);
        }
        res.json("Deleted document " + req.params.id);
      });
  });

  // add review to spefcific food truck
  // v1/foodtruck/reviews/add/:id

  api.post('/reviews/add/:id' ,authenticate, (req,res) => {
    FoodTruck.findById(req.params.id, (err,foodtruck)=> {
      if(err){
        res.send(err);
      }
      let newReview = new Review();
      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save((err,review)=>{
        if(err){
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(err =>{
          if(err){
            res.send(err);
          }
          res.json({message: 'Food truck review saved!'});
        });
      });
    });
  });
  // get reviews by truck ID
  api.get('/reviews/:id' , (req,res)=>{
    Review.find({foodtruck: req.params.id}, (err, reviews) =>{
    if( err ){
      res.send(err);
    }
    res.json(reviews);
    });
  });

  // return all trucks with this food type ;//
  api.get('/foodtype/:foodType', (req,res) =>{
    FoodTruck.find({ foodType: req.params.foodType } ,(err,foodtrucks)=>{
      if(err){
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  return api;
}
