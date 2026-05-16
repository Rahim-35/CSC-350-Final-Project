let currentUser = "";

async function login(){
  let username = document.getElementById("user").value;
  let password = document.getElementById("pass").value;

  let res = await fetch("/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  });

  let data = await res.json();

  if(!data.success){
    alert("Invalid login");
    return;
  }

  currentUser = username;

  document.getElementById("login").style.display = "none";

  if(data.admin){
    document.getElementById("admin").style.display = "block";
    loadAdmin();
  } else {
    document.getElementById("judge").style.display = "block";
  }
}

//
// Developing = 0–10
// Accomplished = 11–15
//
document.addEventListener("input", (e) => {
  if(e.target.type !== "number") return;

  let row = e.target.closest("tr");
  if(!row) return;

  let dev = row.children[1]?.querySelector("input");
  let acc = row.children[2]?.querySelector("input");

  if(!dev || !acc) return;

  // Force numeric limits
  if(dev){
    dev.min = 0;
    dev.max = 10;
  }

  if(acc){
    acc.min = 11;
    acc.max = 15;
  }

  // ❌ Prevent both being filled
  if(dev.value !== ""){
    acc.disabled = true;
  } else {
    acc.disabled = false;
  }

  if(acc.value !== ""){
    dev.disabled = true;
  } else {
    dev.disabled = false;
  }
});

async function submitScores(){
  let total = 0;

  document.querySelectorAll(".rowTotal").forEach(cell => {
    let row = cell.parentElement;

    let dev = row.children[1]?.querySelector("input");
    let acc = row.children[2]?.querySelector("input");

    let devVal = Number(dev?.value);
    let accVal = Number(acc?.value);

    if(devVal !== 0 && (devVal < 0 || devVal > 10)){
      alert("Developing scores must be between 0 and 10");
      throw new Error("Invalid Developing score");
    }

    if(accVal !== 0 && (accVal < 11 || accVal > 15)){
      alert("Accomplished scores must be between 11 and 15");
      throw new Error("Invalid Accomplished score");
    }

    if(!isNaN(devVal)) total += devVal;
    if(!isNaN(accVal)) total += accVal;
  });

  document.getElementById("finalTotal").innerText = total;

  await fetch("/submit",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      user: currentUser,
      total
    })
  });

  alert("Submitted! Total: " + total);
}

async function loadAdmin(){
  let res = await fetch("/average");
  let data = await res.json();

  document.getElementById("data").innerText =
    `Submissions: ${data.count} | Average: ${data.avg.toFixed(2)}`;
}
