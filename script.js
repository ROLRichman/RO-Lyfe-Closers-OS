let deal = {};

function openZillow(){
window.open("https://www.zillow.com/homes/" + encodeURIComponent(address.value));
}
function openRedfin(){
window.open("https://www.redfin.com/search?q=" + encodeURIComponent(address.value));
}
function openUSDA(){
window.open("https://eligibility.sc.egov.usda.gov/");
}

function analyzeDeal(){
let arv = Number(arvInput());
let price = Number(priceInput());

let overage = arv - price;
let profit = (arv * 0.7) - price;

deal = {arv, price, overage, profit};

result.innerHTML = `
ARV: $${arv}<br>
Price: $${price}<br>
Overage: $${overage}<br>
Profit: $${profit}
`;
}

function arvInput(){
return document.getElementById("arv").value.replace(/,/g,"");
}
function priceInput(){
return document.getElementById("price").value.replace(/,/g,"");
}

function run3Tier(){
let arv = Number(document.getElementById("tierArv").value);

tierOut.innerHTML = `
Cash: $${(arv*.5).toFixed(0)}<br>
Carry: $${(arv*.65).toFixed(0)}<br>
Finance: $${(arv*.75).toFixed(0)}
`;
}

function calcRepairs(){
let total =
(+r1.value||0)+(+r2.value||0)+(+r3.value||0)+(+r4.value||0);
repairOut.innerHTML = "Total: $" + total;
}

function copyDeal(){
let text = buildText();
navigator.clipboard.writeText(text);
alert("Copied");
}

function emailDeal(){
let text = encodeURIComponent(buildText());
window.open(`mailto:?subject=Deal&body=${text}`);
}

function textDeal(){
let text = encodeURIComponent(buildText());
window.open(`sms:?body=${text}`);
}

function buildText(){
return `
RO’Lyfe Deal

${address.value}

ARV: ${arv.value}
Price: ${price.value}

Richardson L.
`;
}

function oneClickClose(){
copyDeal();
emailDeal();
textDeal();
alert("Deal Sent");
}

function clearSig(){
let c = sig.getContext("2d");
c.clearRect(0,0,sig.width,sig.height);
}

window.onload = function(){
let canvas = document.getElementById("sig");
let ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = 150;

let draw=false;

canvas.onmousedown=()=>draw=true;
canvas.onmouseup=()=>draw=false;

canvas.onmousemove=(e)=>{
if(!draw) return;
let r=canvas.getBoundingClientRect();
ctx.lineTo(e.clientX-r.left,e.clientY-r.top);
ctx.stroke();
};
};
