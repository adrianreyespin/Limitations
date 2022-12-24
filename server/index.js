const express = require("express");
const app = express();
const mongoose = require('mongoose')
const LimitationModel = require('./models/Limitations')

//helps api/backend connect with react front end
const cors = require('cors');

app.use(express.json());
app.use(cors());


mongoose.connect("/Add Connection Here/")

//req gets info from frontend and res sends info from backend to frontend
app.get("/getLimitations", (req, res) =>{
    LimitationModel.find({}, (err, result) =>{
        if (err){
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});

app.put("/updateLimitation", async(req, res) => {
    const newCurrent = req.body.newCurrent;
    const id = req.body.id;

    try {
        await LimitationModel.findById(id, (error, limitationToUpdate) => {
            limitationToUpdate.current = Number(newCurrent);
            limitationToUpdate.save()
        }).clone() 
    } catch (err) {
        console.log(err);
    }

    res.send("updated limitation");
});

app.post("/createLimitation", async(req, res) =>{
    const limitation = req.body;
    const newLimitation = new LimitationModel(limitation);
    await newLimitation.save(); 
    res.json(limitation);
});

app.delete("/deleteLimitation/:id", async(req, res) => {
    const id = req.params.id;
    await LimitationModel.findByIdAndRemove(id).exec();
    res.send("deleted");
})

app.delete("/deleteSameLimitations/:title", async(req, res) => {
    const title = req.params.title;
    await LimitationModel.deleteMany({title: title})
    res.send("deleted");
})

app.listen(3001, () => {
    console.log("SERVER RUNS");
});