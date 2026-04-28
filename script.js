let deal = {};

function num(id){
  return Number((document.getElementById(id)?.value || "0").replace(/,/g,"")) || 0;
}

function val(id){
  return document.getElementById(id)?.value || "";
}

function money(n){
  return "$" + (Number(n)||0).toLocaleString(undefined,{maximumFractionDigits:0});
}

function openZillow(){
  window.open("https://www.zillow.com/homes/" + encodeURIComponent(val("address")), "_blank");
}

function openRedfin(){
  window.open("https://www.redfin.com/search?q=" + encodeURIComponent(val("address")), "_blank");
}

function openUSDA(){
  window.open("https://eligibility.sc.egov.usda.gov/", "_blank");
}

function analyzeDeal(){
  const arv = num("arv");
  const price = num("price");
  const repairs = num("repairs");
  const fee = num("assignmentFee");
  const overage = arv - price;
  const profit = arv - price - repairs - fee;
  const mao = (arv * .70) - repairs - fee;
  const label = profit > 50000 ? "🔥 SOLID DEAL" : "⚠️ CHECK DEAL";

  deal = {arv, price, repairs, fee, overage, profit, mao};

  document.getElementById("result").innerHTML = `
    <h3>💰 Deal Analysis</h3>
    ARV: ${money(arv)}<br><br>
    Purchase / Offer: ${money(price)}<br><br>
    Rehab: ${money(repairs)}<br><br>
    Assignment Fee: ${money(fee)}<br><br>
    Overage: ${money(overage)}<br><br>
    MAO: ${money(mao)}<br><br>
    Estimated Profit Spread: ${money(profit)}<br><br>
    <b>${label}</b>
  `;
}

function resetDeal(){
  location.reload();
}

function payment(principal, annualRate, years){
  const r = annualRate / 12;
  const n = years * 12;
  return principal * r / (1 - Math.pow(1 + r, -n));
}

function balance(principal, annualRate, years, paidMonths){
  const pmt = payment(principal, annualRate, years);
  const r = annualRate / 12;
  return principal * Math.pow(1+r, paidMonths) - pmt * ((Math.pow(1+r, paidMonths)-1)/r);
}

function run3Tier(){
  const arv = num("tierArv");
  const cash = arv * .50;
  const sellerCarry = arv * .65;
  const sellerFinance = arv * .75;

  const down = sellerCarry * .05;
  const carryLoan = sellerCarry - down;
  const carryPay = payment(carryLoan, .05, 30);
  const carryBalloon = balance(carryLoan, .05, 30, 48);

  const financePay = payment(sellerFinance, .06, 30);
  const financeBalloon = balance(sellerFinance, .06, 30, 60);

  document.getElementById("tierOut").innerHTML = `
    <h4>All Cash</h4>
    Cash Offer: ${money(cash)}

    <h4>Seller Carry</h4>
    Purchase Price: ${money(sellerCarry)}<br>
    Buyer Down Payment: ${money(down)}<br>
    Seller Carry Balance: ${money(carryLoan)}<br>
    Monthly Payment: ${money(carryPay)}<br>
    4-Year Balloon: ${money(carryBalloon)}<br><br>
    Buyer to pay ${money(down)} down, Seller to Carry 1st mortgage in the amount of ${money(carryLoan)} at 5.00% fully amortizing for 30 years, with monthly payments of ${money(carryPay)} and a 4 year balloon payment of ${money(carryBalloon)}.

    <h4>Seller Financing</h4>
    Purchase Price: ${money(sellerFinance)}<br>
    Buyer Down Payment: $0<br>
    Seller Financing Balance: ${money(sellerFinance)}<br>
    Monthly Payment: ${money(financePay)}<br>
    5-Year Balloon: ${money(financeBalloon)}<br><br>
    Buyer to pay $0 down, Seller to Carry 1st mortgage in the amount of ${money(sellerFinance)} at 6.00% fully amortizing for 30 years, with monthly payments of ${money(financePay)} and a 5 year balloon payment of ${money(financeBalloon)}.
  `;
}

function selectedRepairs(){
  const items = ["roof","electrical","plumbing","hvac","kitchen","bathroom","flooring","windows","foundation","garage"];
  return items.filter(id => document.getElementById(id)?.checked).join(", ") || "To be confirmed";
}

function buildDealText(){
  if(!deal.arv){ analyzeDeal(); }

  return `RO’Lyfe Deal Package

Property: ${val("address")}
ARV: ${money(deal.arv)}
Offer / Purchase: ${money(deal.price)}
Rehab: ${money(deal.repairs)}
Assignment Fee: ${money(deal.fee)}
MAO: ${money(deal.mao)}
Estimated Profit: ${money(deal.profit)}

Exit Strategy: ${val("exitStrategy")}
Loan Type: ${val("loanType")}

Prepared By:
Richardson L.
Root Of Lyfe Holdings LLC
Private Capital Broker
richman@rootoflyfe.com
267-808-5844`;
}

function copyDeal(){
  navigator.clipboard.writeText(buildDealText());
  alert("Deal copied.");
}

function emailDeal(){
  const body = encodeURIComponent(buildDealText());
  window.open(`mailto:?subject=RO’Lyfe Deal Package&body=${body}`);
}

function textDeal(){
  const body = encodeURIComponent(buildDealText());
  window.open(`sms:?body=${body}`);
}

function oneClickClose(){
  generatePDF();
  copyDeal();
  emailDeal();
  alert("Deal package generated, copied, and email opened.");
}

function generatePDF(){
  if(!deal.arv){ analyzeDeal(); }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 15;

  function pageCheck(space=10){
    if(y + space > 275){
      doc.addPage();
      y = 15;
    }
  }

  function section(title){
    pageCheck(18);
    doc.setFontSize(13);
    doc.setTextColor(0,0,0);
    doc.text(title, 10, y);
    y += 5;
    doc.setDrawColor(180);
    doc.line(10, y, 200, y);
    y += 7;
  }

  function line(text, gap=5){
    pageCheck(12);
    doc.setFontSize(10);
    doc.setTextColor(0,0,0);
    const split = doc.splitTextToSize(String(text || ""), 185);
    doc.text(split, 10, y);
    y += split.length * gap;
  }

  doc.setFontSize(16);
  doc.text("RO’Lyfe Holdings LLC", 10, y);
  y += 8;

  doc.setFontSize(11);
  doc.text("Deal Structure & Funding Preview", 10, y);
  y += 10;

  line("Prepared By: Richardson L.");
  line("Root Of Lyfe Holdings LLC | Private Capital Broker");
  line("richman@rootoflyfe.com | 267-808-5844", 8);

  section("PROPERTY");
  line("Address: " + val("address"));
  line("Property Type: " + val("propertyType"));
  line("Beds / Baths: " + val("bedsBaths"));
  line("Sq Ft: " + val("sqft"));
  line("Garage / Yard: " + val("garageYard"));
  line("Agent / Source: " + val("agentName"), 8);

  section("BUYER / CONTRACTOR");
  line("Name: " + val("buyerName"));
  line("Company: " + val("buyerCompany"));
  line("Phone: " + val("buyerPhone"));
  line("Email: " + val("buyerEmail"), 8);

  section("PROPERTY NUMBERS");
  line("Estimated ARV: " + money(deal.arv));
  line("Asking / Offer Price: " + money(deal.price));
  line("Estimated Rehab: " + money(deal.repairs));
  line("Assignment Fee: " + money(deal.fee));
  line("Estimated Profit Spread: " + money(deal.profit));
  line("MAO: " + money(deal.mao), 8);

  section("THREE-TIER OFFER STRUCTURE");
  const tierText = document.getElementById("tierOut").innerText || "Run 3 Tier Engine before generating PDF.";
  line(tierText, 5);

  section("PRIVATE / HARD MONEY LOAN PREVIEW");
  line("Loan Type: " + val("loanType"));
  line("Estimated Loan Amount: " + val("loanAmount"));
  line("Estimated Interest Rate: " + val("interestRate") + "%");
  line("Estimated Points: " + val("points"));
  line("Estimated Cash to Close: " + val("cashToClose"), 8);

  section("REHAB / COGO SUMMARY");
  line("Major Repair Items: " + selectedRepairs());
  line("Estimated Rehab Total: " + money(deal.repairs));
  line("Contractor Notes: " + val("contractorNotes"), 8);

  section("EXIT STRATEGY");
  line("Primary Exit: " + val("exitStrategy"));
  line("Backup Exit: Assignment, Double Close, Lender-Funded Flip, or Walk Away During Inspection", 8);

  section("PROTECTED CLAUSES");
  line("Buyer may assign this agreement to Richardson L. and/or Assigns, partners, affiliates, buyer entities, contractors, lenders, or funding partners.");
  line("Property is evaluated AS-IS, WHERE-IS, subject to inspection, contractor validation, title review, and final due diligence.");
  line("Buyer reserves the right to market, package, review, and share the deal with contractors, buyers, lenders, affiliates, and capital partners for transaction execution.");
  line("Seller and parties agree not to circumvent buyer, buyer’s partners, funding partners, contractors, assignees, or affiliates introduced through this transaction.");
  line("Final terms are subject to inspection period, funding review, title, liens, taxes, insurance, appraisal, and lender underwriting.", 8);

  section("RO’LYFE EXECUTION PLAN");
  line("1. Request full property address and access details");
  line("2. Schedule walkthrough with contractor present");
  line("3. Confirm rehab scope and max buy price");
  line("4. Submit offer under Richardson L. and/or Assigns");
  line("5. Lock contract with inspection period and assignability");
  line("6. Execute through assignment or double close");
  line("7. Send full deal package to lender");
  line("8. Close and collect profit", 8);

  section("INVESTMENT RULES");
  line("Do NOT lock deals without contractor validation.");
  line("Do NOT rely on estimated ARV without comps.");
  line("Do NOT overpay based on emotion.");
  line("ALWAYS maintain assignability.");
  line("ALWAYS confirm title, access, liens, taxes, and seller authority.", 8);

  section("DISCLOSURE");
  line("This document is for internal deal review, buyer review, and funding discussion purposes only. It does not represent a loan commitment, guarantee of financing, appraisal, legal advice, or financial advice. All final terms are subject to contract, underwriting, title review, inspection, lender approval, and buyer due diligence.", 6);

  section("SIGNATURES");
  line("Prepared By: Richardson L. | Root Of Lyfe Holdings LLC");
  line("Broker / Buyer Signature: Richardson L.");

  try{
    const canvas = document.getElementById("sig");
    const img = canvas.toDataURL("image/png");
    pageCheck(50);
    doc.addImage(img, "PNG", 10, y + 5, 80, 30);
    y += 42;
  }catch(e){}

  line("Seller Signature: ______________________________");
  line("Buyer / Contractor Signature: ______________________________");
  line("Date: ______________________________");

  doc.save("ROlyfe_Deal_Package.pdf");
}

function initSignature(){
  const canvas = document.getElementById("sig");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = 180;

  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#111";

  let drawing = false;

  function pos(e){
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return {x:t.clientX-rect.left, y:t.clientY-rect.top};
  }

  function start(e){
    e.preventDefault();
    drawing = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x,p.y);
  }

  function move(e){
    e.preventDefault();
    if(!drawing) return;
    const p = pos(e);
    ctx.lineTo(p.x,p.y);
    ctx.stroke();
  }

  function end(e){
    e.preventDefault();
    drawing = false;
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", end);
  canvas.addEventListener("mouseleave", end);
  canvas.addEventListener("touchstart", start, {passive:false});
  canvas.addEventListener("touchmove", move, {passive:false});
  canvas.addEventListener("touchend", end, {passive:false});
}

function clearSig(){
  const canvas = document.getElementById("sig");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

window.onload = initSignature;
