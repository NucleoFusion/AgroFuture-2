import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { default as mongodb } from 'mongodb';


let MongoClient = mongodb.MongoClient;


var username = "";
var password = "";
var type = "";
var variant = "";
var get_recommend_locn="";
var get_recommend_type="";
var max_yield = {name: "NOT FOUND"};


const client = new MongoClient("mongodb://localhost:27017");
const _dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const db = client.db("AgroFuture");
const users = db.collection("UserInfo");
const seedData = db.collection("seedData");
const track = db.collection("TrackCreate");

var cursor_seed = await seedData.findOne({
    "type" : "Not Selected"
});

var cursor = await users.findOne({"username" : "None"});

var cursor_recommend;

var cursor_track;
var cursor_track_type;

async function setNot(){
    cursor_seed = await seedData.findOne({
        "type" : "Not Selected"
    });
}

async function getLoginInfo(){
    try{
        if(await users.findOne({
            "username": username
        })){
            cursor = await users.findOne({
                "username": username
            });
        }
        if(cursor.password == password){
            return true;
        }
        else{
            false;
        }
    }
    catch(ex){
        console.log("ERROR");
    }
}

async function getVariant(){
    try{
        cursor_seed = await seedData.findOne({
            type: type,
            name: variant
        });
        //
    }
    catch(ex){
        console.log("ERROR");
    }
}

async function insertUser(username,password){
    await users.insertOne({
        "username" : username,
        "password" : password
    });
}


async function getRecommend(){
    // try{
        cursor_seed = await seedData.find({
            type: get_recommend_type,
            location: get_recommend_locn
        }).toArray();
        max_yield = cursor_seed[0];
        for(let i=0;i<cursor_seed.length;i++){
            if(max_yield.Yield < cursor_seed[i].Yield){
                cursor_seed = max_yield;
            }
        }
//    }
    // catch(ex){
    //     console.log(cursor_seed);
    //     console.log("ERROR");
    // }
}

async function getTrack(){
    cursor_track_type =await track.findOne({"user": username});
}

async function getTrackDet(){
    console.log(username);
    console.log(cursor_track_type.name);
    cursor_track =await seedData.findOne({"name" : cursor_track_type.name});
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));



//sign-up

app.post("/signup-data", (req,res) => {
    insertUser(req.body.username,req.body.password);
});

// Login


app.get("/", (req,res)=> {
    res.render("login.ejs", {});
});

app.get("/login-pass", (req,res)=> {
    res.send({"password": cursor.password});
});

app.post("/login", (req,res) => {
    username = req.body.username;
    password = req.body.password;
    if(getLoginInfo()){
        console.log("YESSS");
        //res.send('<script>window.location.href="https://localhost:3000/home";</script>');
    }
    else{
        console.log("NOOO");
    }
});


//seedData

app.get("/seedLoad", (req,res)=> {
    res.send({"password": password});
});


app.post("/seedVar", (req,res) => {
    type = req.body.type;
    variant = req.body.name;
    getVariant();
    if(cursor_seed.name != "Not Selected"){
        //res.send('<script>window.location.href="https://localhost:3000/home";</script>');
    }
    else{
    }
});


//getCrop


app.post('/get-recommend', (req,res) => {
    get_recommend_type = req.body.type;
    get_recommend_locn = req.body.locn;
    getRecommend();
});

app.get("/recommended", (req,res)=> {
    console.log(max_yield.name);
    res.send({"name":max_yield.name});
});


app.get("/home", (req,res)=> {
    res.render("homepage.ejs", {});
});

app.get("/seedBuffer", (req,res)=> {
    res.render("seedBuffer.ejs", {});
    setNot();
});

app.get("/weather", (req,res)=> {
    res.sendFile(_dirname + "/index2.html");
});

app.get("/contact", (req,res)=> {
    res.render("contact.ejs", {});
});

app.get("/seedData", (req,res) => {
    res.render("seedShowcase_Maize.ejs", {
        type : cursor_seed.type,
        name : cursor_seed.name,
        creationLocation : cursor_seed.creationLocation,
        location : cursor_seed.location,
        rainfall : cursor_seed.rainfall,
        pest_dis : cursor_seed.pest_dis,
        Yield : cursor_seed.Yield,
        spec_ft : cursor_seed.spec_ft,
        flowering : cursor_seed.flowering,
        maturing : cursor_seed.maturing,   
        height : cursor_seed.height,
        description : cursor_seed.description
    });
});

app.get("/track", (req,res)=> {
    getTrack();
    getTrackDet();
    res.render("grid.ejs", {
        type : cursor_track.type,
        name : cursor_track.name,
        creationLocation : cursor_track.creationLocation,
        location : cursor_track.location,
        rainfall : cursor_track.rainfall,
        pest_dis : cursor_track.pest_dis,
        Yield : cursor_track.Yield,
        spec_ft : cursor_track.spec_ft,
        flowering : cursor_track.flowering,
        maturing : cursor_track.maturing,   
        height : cursor_track.height,
        description : cursor_track.description
    });
});

app.get("/signup", (req,res)=> {
    res.render("sign.ejs", {});
});

app.get("/about", (req,res)=> {
    res.render("about.ejs", {});
});

app.get("/getCrop", (req,res)=> {
    res.render("reccomend.ejs", {});
});

app.listen(port, (req,res) => {
    console.log("Listening on Port 3000.");
});