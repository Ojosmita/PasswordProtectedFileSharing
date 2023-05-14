import dotenv from 'dotenv';
dotenv.config()

import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from 'multer'
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import File from './modules/File.js'
import express from 'express'
import bodyParser from 'body-parser';

const app = express()
app.use(express.urlencoded({ extended: true })) // bodyParser -> expresss

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + '/public'));
app.use(express.json());

// const router = express.Router();

const upload = multer({ dest: "uploads" })


// try{
//     mongoose.connect(process.env.DATABASE_URL);
// }
// catch(e){
//    console.log(e); 
// }


// connecting to database
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
// connection done successfully


//first page to launch when run the code
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("home")
})
//launched successfully

app.get("/uploadfile", async(req, res) => {
    res.render("index");
})

app.get("/downloadfile", async(req, res) => {
    res.render("download");
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
    res.render("upload", { fileLink: `${req.headers.origin}/file/${file.id}` })
})

app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req, res) {
    try {
        console.log(req.params.id) 
        const file = await File.findById(req.params.id)
        console.log(req.body);

        if (file.password != null) {
            if (req.body.password == null) {
                res.render("password")
                return
            }

            if (!(await bcrypt.compare(req.body.password, file.password))) {
                res.render("password", { error: true })
                return;
            }
        }

        file.downloadCount++
        await file.save()
        console.log(file.downloadCount)

        res.download(file.path, file.originalName)
    } catch (e) {
        console.log(e);
    }
}

app.listen(process.env.PORT, () => {
    console.log("Running")
})
