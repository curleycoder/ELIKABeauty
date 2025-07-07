const express = require("express");
const router = express.Router();
const Booking = require("../models/booking")


router.post("/", async (req, res)=>{
    try{
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);

    } catch (error){
        res.status(400).json({ error: " Could not create booking" })
    }
})

router.get("/", async (req, res) =>{
    try{
        const bookings = await Booking.find().sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({error: " Could not fetch booking "})
    }
})
router.get("/booked", async (req, res) => {
  const { date } = req.query;
  try {
    const bookings = await Booking.find({ date });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;