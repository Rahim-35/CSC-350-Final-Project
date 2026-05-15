const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let scores = [];

const users = [
  {u:"judge1",p:"123"},
  {u:"judge2",p:"123"},
  {u:"judge3",p:"123"},
  {u:"judge4",p:"123"},
  {u:"admin",p:"admin"}
];

app.post("/login", (req,res)=>{
  const {username,password} = req.body;
  const found = users.find(x=>x.u===username && x.p===password);
  res.json({success: !!found, admin: username==="admin"});
});

app.post("/submit", (req,res)=>{
  const {user,total} = req.body;
  scores.push({user,total});
  res.json({message:"Saved"});
});

app.get("/average", (req,res)=>{
  if(scores.length === 0) return res.json({avg:0,count:0});

  let avg = scores.reduce((a,b)=>a+b.total,0)/scores.length;
  res.json({avg,count:scores.length});
});

app.listen(3000, ()=>console.log("Server running"));
