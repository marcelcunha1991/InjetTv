var timeDisplay = document.getElementById("time");

function refreshTime() {
   var dateString = new Date().toLocaleTimeString("pt-BR");
   timeDisplay.innerHTML = dateString;
}

setInterval(refreshTime, 1000);