const express = require("express");
const fs = require("fs")
const path = require("path")

const router = express.Router();

router.get("/gallery", (req, res)=>{
    const galleryPath = path.join(__dirname, "../public/gallery");
    fs.readdir(galleryPath, (err, files)=>{
        if(err) return res.status(500).json({error: "Unable to read directory"})
    })
     const imageUrls = files
     .filter(file => /\.(jpg|jpeg|png|gif)$/.test(file))
     .map(file => `/gallery/${file}`)

     res.json({ image :imageUrls })
})

module.exports = router;