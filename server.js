
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let history = [];
let currentResult = null;
let currentPeriod = "";

function getPeriod() {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  let date = ist;
  if (ist.getHours() < 5 || (ist.getHours() === 5 && ist.getMinutes() < 30)) {
    date = new Date(ist.getTime() - 86400000);
  }
  const ymd = date.toISOString().slice(0,10).replace(/-/g,"");
  const minutes = Math.floor((ist - new Date(date.setHours(5,30,0,0))) / 60000);
  return ymd + "100010000" + (minutes < 0 ? 0 : minutes);
}

setInterval(() => {
  const sec = new Date().getSeconds();
  if (sec === 30) {
    currentResult = Math.floor(Math.random() * 10);
    currentPeriod = getPeriod();
  }
  if (sec === 0 && currentResult !== null) {
    history.unshift({ period: currentPeriod, result: currentResult });
    history = history.slice(0, 10);
  }
}, 1000);

app.get("/data", (req, res) => {
  res.json({ result: currentResult, history });
});

app.listen(PORT, () => console.log("Server running"));
