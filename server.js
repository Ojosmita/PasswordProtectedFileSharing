import dotenv from 'dotenv';
dotenv.config()

import multer from 'multer'

import mongoose from "mongoose";

import bcrypt from 'bcrypt'

import File from './modules/File.js'

import express from 'express'
const app = express()

// const router = express.Router();

const upload = multer({ dest: "uploads" })


// try{
//     mongoose.connect(process.env.DATABASE_URL);
// }
// catch(e){
//    console.log(e); 
// }

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},
    (err) => {
        if (err) {
            console.log("Unable to connect");
            console.log(err);
            return;
        } else {
            console.log("MongoDB is connected");
        }
    });



app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/upload", upload.single("file"), async (req, res) => {
        const fileData = {
            path: req.file.path,
            originalName: req.file.originalname
        }
        if (req.body.password != null && req.body.password != "") {
            fileData.password = await bcrypt.hash(req.body.password, 10)
        }

        const file = await File.create(fileData)
        res.render("index", { fileLink: '${req.headers.origin}/file/${file.id}'})
   

})

app.get("/file/:id", (req, res) => {
    res.send("hi...")
})

app.listen(process.env.PORT, () => {
    console.log("Running")
})