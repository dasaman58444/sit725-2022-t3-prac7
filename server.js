

var express = require("express")
var app = express()
var cors = require ('cors')
let projectCollection;

//var app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let socketPort = 8080;


app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())



app.get('/addTwoNumbers/:firstNumber/:secondNumber', function(req,res,next){
  var firstNumber = parseInt(req.params.firstNumber) 
  var secondNumber = parseInt(req.params.secondNumber)
  var result = firstNumber + secondNumber || null
  if(result == null) {
    res.json({result: result, statusCode: 400}).status(400)
  }
  else { res.json({result: result, statusCode: 200}).status(200) } 
})




//mongo db connection..

const Mongoclient = require ('mongodb').MongoClient;

//database conn
const uri = 'mongodb+srv://aman:aman@cluster0.kqd3owj.mongodb.net/?retryWrites=true&w=majority'
const client = new Mongoclient (uri, {useNewUrlParser: true})


//insert project
const insertProjects = (project,callback) => {
    projectCollection.insert(project,callback);
}

const getProjects =(callback) =>{
    projectCollection.find({}).toArray(callback);
}



const createCollection = (collectionName) => {
    client.connect((err,db) => {
      projectCollection = client.db().collection(collectionName);
       if (!err){
      
        console.log('MongoDb Connected')
       }
       else {
        console.log("DB Error: ", err);
        process.getMaxListeners(1);

       }

    
        
    } )
}



const cardList = [
    {
        title: "M Block",
        image: "images/MGR.jpg",
        link: "About M Block",
        desciption: "Demo desciption about M Block"
    },
    {
        title: "L Block",
        image: "images/LBlock.jpg",
        link: "About L Block",
        desciption: "Demo desciption about L Block"
    }
]




app.get('/api/projects',(req,res) => {
    getProjects((err, result)=> {
    if (err){
        res.json({statusCode: 400,message: err})
    }
    else{
        res.json({statusCode: 200, message:"success", data: result})
    }
    })

})
//post api
app.post('/api/projects',(req,res) => {
    console.log("New Project added", req.body)
    var newproject = req.body;

    insertProjects(newproject,(err,result)=> {
        if (err){
            res.json({statusCode: 400,message: err})
        }
        else{
            res.json({statusCode: 200, message:"project successfully added", data: result})
        }
        })
    
    })


var port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("App listening to: http://localhost: "+port)
    createCollection ("vit")
}
)


//socket test
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    setInterval(() => {
      socket.emit("number", parseInt(Math.random() * 10));
    }, 1000);
  });
  

  
  http.listen(socketPort, () => {
    console.log(`Listening on socketPort ${socketPort}`);
  });

 