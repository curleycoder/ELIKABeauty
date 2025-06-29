const express = require("express");
const router = express.Router();
const Service = require("../models/service")

router.post("/", async(req, res)=>{
    try{
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service)
    } catch (error){
        res.status(400).json({error: "Could not add service"})
    }
})

router.get("/", async(req, res)=>{
    try{
        const services = await Service.find()
        res.json(services)
    } catch (error){
        res.status(500).json(" Could not getch services")
    }
})

module.exports = router;