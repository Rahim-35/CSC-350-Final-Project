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

// disable opposite column rule (kept same but safer)
document.addEventListener("input", (e) => {
  if(e.target.type !== "number") return;

  let row = e.target.closest("tr");
  if(!row) return;

  let dev = row.children[1]?.querySelector("input");
  let acc = row.children[2]?.querySelector("input");

  if(dev && acc){
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
  }
});

async function submitScores(){
  let total = 0;

  // ONLY score rows (prevents NaN from non-score inputs)
  document.querySelectorAll(".rowTotal").forEach(cell => {
    let row = cell.parentElement;

    let dev = row.children[1]?.querySelector("input");
    let acc = row.children[2]?.querySelector("input");

    let devVal = Number(dev?.value);
    let accVal = Number(acc?.value);

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
