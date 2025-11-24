// ---------- Utility helpers ----------
const $ = (id) => document.getElementById(id);

// Parse numbers with comma support
function parseNumber(str) {
  if (!str) return NaN;
  const cleaned = str.trim().replace(/,/g, ".");
  return parseFloat(cleaned);
}

// Clean input for thousands separators
function cleanInput(str) {
  return str.replace(/[^\d.,-]/g, "").replace(/,/g, ".");
}

const formatNumber = (v, decimals) => {
  if (!isFinite(v)) return "—";
  // Always use auto formatting (no forced rounding)
  return parseFloat(parseFloat(v.toFixed(6))).toString();
};

// ========== CALCULATOR 1: X% of Y ==========
const baseInput = $("base");
const percentInput = $("percent");
const calcBtn = $("calcBtn");
const clearBtn = $("clearBtn");
const copyBtn = $("copyBtn");
const swapBtn = $("swapBtn");
const errorEl = $("error");
const resultValue = $("resultValue");
const resultDetails = $("resultDetails");
const increaseBtn = $("increaseBtn");
const decreaseBtn = $("decreaseBtn");

// Calculator 1 functionality
function calculateXofY() {
  errorEl.textContent = "";

  const baseStr = cleanInput(baseInput.value);
  const pctStr = cleanInput(percentInput.value);

  if (!baseStr && !pctStr) {
    resultValue.textContent = "—";
    resultDetails.textContent = "Enter values and click Calculate.";
    return;
  }

  const base = parseNumber(baseStr);
  const pct = parseNumber(pctStr);

  if (!baseStr || isNaN(base)) {
    errorEl.textContent = "Please enter a valid number.";
    baseInput.focus();
    return;
  }

  if (!pctStr || isNaN(pct)) {
    errorEl.textContent = "Please enter a valid percentage.";
    percentInput.focus();
    return;
  }

  const raw = (base * pct) / 100;
  const resultText = formatNumber(raw, "auto");

  resultValue.textContent = resultText;
  resultDetails.textContent = `${pct}% of ${base.toLocaleString()} = ${resultText}`;
  resultValue.setAttribute("aria-live", "polite");
}

// Calculator 1 event handlers
calcBtn.addEventListener("click", calculateXofY);

[baseInput, percentInput].forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculateXofY();
    }
  });

  el.addEventListener("input", (e) => {
    const cursorPos = e.target.selectionStart;
    const originalLength = e.target.value.length;
    e.target.value = cleanInput(e.target.value);
    const newLength = e.target.value.length;
    const lengthDiff = newLength - originalLength;
    e.target.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);

    errorEl.textContent = "";
    clearTimeout(typingTimer1);
    typingTimer1 = setTimeout(calculateXofY, 700);
  });
});

clearBtn.addEventListener("click", () => {
  baseInput.value = "";
  percentInput.value = "";
  resultValue.textContent = "—";
  resultDetails.textContent = "Enter values and click Calculate.";
  errorEl.textContent = "";
  baseInput.focus();
});

copyBtn.addEventListener("click", async () => {
  const text = resultValue.textContent;
  const details = resultDetails.textContent;
  if (!text || text === "—") {
    errorEl.textContent = "Nothing to copy.";
    return;
  }
  const fullText = `${text}\n${details}`;
  try {
    await navigator.clipboard.writeText(fullText);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy Result"), 1200);
  } catch (err) {
    errorEl.textContent = "Copy failed. Select and copy manually.";
    setTimeout(() => (copyBtn.textContent = "Copy Result"), 1200);
  }
});

swapBtn.addEventListener("click", () => {
  const a = baseInput.value;
  const b = percentInput.value;
  baseInput.value = b;
  percentInput.value = a;
  calculateXofY();
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    swapBtn.click();
  }
});

increaseBtn.addEventListener("click", () => {
  const cur = parseNumber(percentInput.value) || 0;
  percentInput.value = (cur + 1).toString();
  calculateXofY();
});

decreaseBtn.addEventListener("click", () => {
  const cur = parseNumber(percentInput.value) || 0;
  percentInput.value = (cur - 1).toString();
  calculateXofY();
});

let typingTimer1;

// ========== CALCULATOR 2: What % is A of B ==========
const partAInput = $("partA");
const wholeBInput = $("wholeB");
const calcBtn2 = $("calcBtn2");
const clearBtn2 = $("clearBtn2");
const copyBtn2 = $("copyBtn2");
const swapBtn2 = $("swapBtn2");
const errorEl2 = $("error2");
const resultValue2 = $("resultValue2");
const resultDetails2 = $("resultDetails2");
const exampleBtn1 = $("exampleBtn1");
const exampleBtn2 = $("exampleBtn2");

// Calculator 2 functionality
function calculatePercentage() {
  errorEl2.textContent = "";

  const partStr = cleanInput(partAInput.value);
  const wholeStr = cleanInput(wholeBInput.value);

  if (!partStr && !wholeStr) {
    resultValue2.textContent = "—";
    resultDetails2.textContent =
      "Enter part and whole to calculate percentage.";
    return;
  }

  const part = parseNumber(partStr);
  const whole = parseNumber(wholeStr);

  if (!partStr || isNaN(part)) {
    errorEl2.textContent = "Please enter a valid part (A).";
    partAInput.focus();
    return;
  }

  if (!wholeStr || isNaN(whole)) {
    errorEl2.textContent = "Please enter a valid whole (B).";
    wholeBInput.focus();
    return;
  }

  if (whole === 0) {
    errorEl2.textContent = "Whole (B) cannot be zero.";
    wholeBInput.focus();
    return;
  }

  const percentage = (part / whole) * 100;
  const resultText = `${formatNumber(percentage, "auto")}%`;

  resultValue2.textContent = resultText;
  resultDetails2.textContent = `${part.toLocaleString()} is ${formatNumber(
    percentage,
    "auto"
  )}% of ${whole.toLocaleString()}`;
  resultValue2.setAttribute("aria-live", "polite");
}

// Calculator 2 event handlers
calcBtn2.addEventListener("click", calculatePercentage);

[partAInput, wholeBInput].forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculatePercentage();
    }
  });

  el.addEventListener("input", (e) => {
    const cursorPos = e.target.selectionStart;
    const originalLength = e.target.value.length;
    e.target.value = cleanInput(e.target.value);
    const newLength = e.target.value.length;
    const lengthDiff = newLength - originalLength;
    e.target.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);

    errorEl2.textContent = "";
    clearTimeout(typingTimer2);
    typingTimer2 = setTimeout(calculatePercentage, 700);
  });
});

clearBtn2.addEventListener("click", () => {
  partAInput.value = "";
  wholeBInput.value = "";
  resultValue2.textContent = "—";
  resultDetails2.textContent = "Enter part and whole to calculate percentage.";
  errorEl2.textContent = "";
  partAInput.focus();
});

copyBtn2.addEventListener("click", async () => {
  const text = resultValue2.textContent;
  const details = resultDetails2.textContent;
  if (!text || text === "—") {
    errorEl2.textContent = "Nothing to copy.";
    return;
  }
  const fullText = `${text}\n${details}`;
  try {
    await navigator.clipboard.writeText(fullText);
    copyBtn2.textContent = "Copied!";
    setTimeout(() => (copyBtn2.textContent = "Copy Result"), 1200);
  } catch (err) {
    errorEl2.textContent = "Copy failed. Select and copy manually.";
    setTimeout(() => (copyBtn2.textContent = "Copy Result"), 1200);
  }
});

swapBtn2.addEventListener("click", () => {
  const a = partAInput.value;
  const b = wholeBInput.value;
  partAInput.value = b;
  wholeBInput.value = a;
  calculatePercentage();
});

exampleBtn1.addEventListener("click", () => {
  partAInput.value = "25";
  wholeBInput.value = "100";
  calculatePercentage();
});

exampleBtn2.addEventListener("click", () => {
  partAInput.value = "75";
  wholeBInput.value = "150";
  calculatePercentage();
});

let typingTimer2;

// Initialize both calculators with examples
window.addEventListener("load", () => {
  // Calculator 1 example
  baseInput.value = "100";
  percentInput.value = "12";
  calculateXofY();

  // Calculator 2 example
  partAInput.value = "25";
  wholeBInput.value = "100";
  calculatePercentage();

  baseInput.focus();
});
