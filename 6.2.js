const express=require("express")
const jwt =require("jsonwebtoken")
const app=express();
const JWT_SECRET="AtharvAggarwal"

app.use(express.json());

const users=[];


//localhost 3000, then this file called
app.get("/", function(req,res){
    res.sendFile(__dirname+ "/public/index.html");
})



app.post('/signup', function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    users.push({
        username:username,
        password:password
    })

    res.json({
        message:"You are signed up"
    })
    console.log((users));
    

})

app.post('/signin', function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    let foundUser=null;

    for(let i=0;i<users.length;i++){
        if(users[i].username==username && users[i].password==password){
            foundUser=users[i];
        }
    }
    if(foundUser){
        const token=jwt.sign({
            username:username
        }, JWT_SECRET);

        res.json({
            token:token
        })
    }
    
    else{
        res.status(403).json({
            messgae:"Invalid username or password"
        })
    }
    console.log(users);
    
})

function AuthMiddleware(req,res,next){
    const token=req.headers.token;
    const decodeInformation=jwt.verify(token,JWT_SECRET);
    const username=decodeInformation.username;
    req.username=username;
    if(username){
        next();
    }
    else{
        res.json({
            messgae:"You are not logged in"
        })
    }
} 

app.get('/me',AuthMiddleware,function (req,res){

    const username=req.username;

    let foundUser=null;

    for(let i=0;i<users.length;i++){
        if(users[i].username==username){
            foundUser=users[i];
        }
    }
    res.json({
        username:foundUser.username,
        password:foundUser.password
    })
      
})
app.listen(3000);