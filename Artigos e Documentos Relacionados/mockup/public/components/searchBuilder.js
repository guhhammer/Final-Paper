
const query = window.location.href.split("?")[1];

const s = query.split("s=")[1];

document.getElementById("s_relate").innerHTML = s+":";

console.log(s);
