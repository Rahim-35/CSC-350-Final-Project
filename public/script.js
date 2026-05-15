let currentUser = "";

async function login(){
  let username = document.getElementById("user").value;
  let password = document.getElementById("pass").value;

  let res = await fetch("/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  });

  let data = await res.json();

  if(!data.success) return alert("Invalid login");

  currentUser = username;
  document.getElementById("login").style.display = "none";

  if(data.admin){
    document.getElementById("admin").style.display = "block";
    loadAdmin();
  } else {
    document.getElementById("judge").style.display = "block";
  }
}

function disableRow(input){
  let row = input.parentElement.parentElement;
  let inputs = row.querySelectorAll("input");

  inputs.forEach(i=>{
    if(i!==input && input.value!==""){
      i.disabled = true;
    } else if(input.value===""){
      i.disabled = false;
    }
  });
}

async function submitScores(){
  let inputs = document.querySelectorAll("#judge input");
  let total = 0;

  inputs.forEach(i=>{
    if(i.value) total += parseInt(i.value);
  });

  await fetch("/submit",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({user:currentUser,total})
  });

  alert("Submitted! Total: " + total);
}

async function loadAdmin(){
  let res = await fetch("/average");
  let data = await res.json();

  document.getElementById("data").innerText =
    "Submissions: " + data.count + " | Average: " + data.avg.toFixed(2);
}
