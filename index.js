import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose, { Schema } from 'mongoose';

mongoose.connect("mongodb+srv://haryannvi-coder:Raosahab@cluster0.bj2jgzm.mongodb.net/todoDB?retryWrites=true&w=majority")
.then(() => console.log("Connection with mongodb is successful"))
.catch((error) => console.log("Couldn't connect to mongoDB!!!", error));

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// schema for items in database
const itemsSchema = new  mongoose.Schema({
    name: String,
});

// model for above schema
const Item =  mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: "Welcome to this WebApp",
});
const item2 = new Item({
    name: "Click on + to add new items",
});
const item3 = new Item({
    name: "Click on any item to delete it",
});

const defaultItems = [item1, item2, item3];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", (req, res)=>{
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date();
    let day = today.toLocaleDateString("en-US", options);

    async function findItems(){
        const foundItems = await Item.find({});
        // console.log(foundItems);

        if(foundItems.length === 0){
            Item.insertMany(defaultItems)
            .then(() => console.log("Default items added to items collection in taskmanagerDB!!"))
            .catch((error) => console.log("Couldn't add default items!!", error));

            res.redirect("/");
        }
        else{
            res.render("index.ejs", {
                dayX : day,
                listItem : foundItems,
            });            
        }
    };
    findItems();
});


app.post("/", (req, res)=>{
    console.log(req.body);

    const item = new Item({
        name: req.body["addItem"], 
    });

    item.save();

    res.redirect("/");
});

app.post("/delete", (req, res)=>{
    console.log(req.body.checkbox);

    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId)
    .then(() => {
        console.log("Successfully deleted checked item");
        res.redirect("/");
    })  
    .catch((error) => console.log("Deletion failed!!", error));
});


app.listen(port, ()=>{
    console.log(`server is running at port: ${port}`);
});