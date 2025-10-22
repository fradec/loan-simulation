// Initial values
let price = 300000;
let isNew = false;
let works = 0;
let downPayment = 30000;
let rate = 4.5;
let duration = 20;
let hasEditedDownPayment = false;

// DOM Elements
const priceInput = document.getElementById("price");
const downPaymentInput = document.getElementById("downPayment");
const isNewSelect = document.getElementById("isNew");
const worksInput = document.getElementById("works");
const rateInput = document.getElementById("rate");
const durationInput = document.getElementById("duration");
const warningEl = document.getElementById("warning");
const notaryFeesEl = document.getElementById("notaryFees");
const loanAmountEl = document.getElementById("loanAmount");
const monthlyPaymentEl = document.getElementById("monthlyPayment");
const totalCreditCostEl = document.getElementById("totalCreditCost");
const totalCostEl = document.getElementById("totalCost");

// Format currency
function formatCurrency(v) {
  return v.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

// Calculate & update results
function calculate() {
  // sanitize
  const sanitizedPrice = Math.max(+priceInput.value || 0, 0);
  const sanitizedWorks = Math.max(+worksInput.value || 0, 0);
  const sanitizedDownPayment = Math.max(+downPaymentInput.value || 0, 0);
  const sanitizedRate = Math.max(+rateInput.value || 0, 0);
  const sanitizedDuration = Math.min(Math.max(+durationInput.value || 1, 1), 25);

  const notaryFeesRate = isNewSelect.value === "neuf" ? 0.03 : 0.08;
  const notaryFees = sanitizedPrice * notaryFeesRate;
  const totalCostValue = sanitizedPrice + notaryFees + sanitizedWorks;
  const loanAmount = Math.max(totalCostValue - sanitizedDownPayment, 0);
  const monthlyRate = sanitizedRate / 100 / 12;
  const totalMonths = sanitizedDuration * 12;
  const monthlyPayment = loanAmount > 0 ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths)) : 0;
  const totalCreditCost = monthlyPayment * totalMonths - loanAmount;

  warningEl.textContent = sanitizedDownPayment > totalCostValue ? "⚠️ L'apport dépasse le coût total de l'opération !" : "";

  notaryFeesEl.textContent = formatCurrency(notaryFees);
  loanAmountEl.textContent = formatCurrency(loanAmount);
  monthlyPaymentEl.textContent = formatCurrency(monthlyPayment);
  totalCreditCostEl.textContent = formatCurrency(totalCreditCost);
  totalCostEl.textContent = formatCurrency(totalCostValue + totalCreditCost);
}

// Auto-fill 10% downPayment if not edited
downPaymentInput.addEventListener("input", () => {
  hasEditedDownPayment = true;
});
priceInput.addEventListener("input", () => {
  if (!hasEditedDownPayment) {
    downPaymentInput.value = Math.round(+priceInput.value * 0.1);
  }
  calculate();
});

// Other inputs
[worksInput, rateInput, durationInput, isNewSelect, downPaymentInput].forEach(el => {
  el.addEventListener("input", calculate);
});

// Initialize values
priceInput.value = price;
downPaymentInput.value = downPayment;
worksInput.value = works;
rateInput.value = rate;
durationInput.value = duration;
isNewSelect.value = isNew ? "neuf" : "ancien";

calculate();
