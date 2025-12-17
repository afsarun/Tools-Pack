function convertTime() {
  const monthsInput = document.getElementById("monthsInput");
  const yearsOutput = document.getElementById("yearsOutput");
  const resultText = document.getElementById("result-text");

  const months = parseInt(monthsInput.value, 10);

  // Validate input
  if (isNaN(months) || months < 0) {
    yearsOutput.value = "";
    resultText.textContent = "Please enter a valid number of months.";
    return;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let outputValue = "";
  let sentence = "";

  if (remainingMonths === 0) {
    outputValue = `${years} ${years === 1 ? "year" : "years"}`;
    sentence = `${months} months equals exactly ${outputValue}.`;
  } else {
    outputValue = `${years} ${
      years === 1 ? "year" : "years"
    } and ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
    sentence = `${months} months equals ${outputValue}.`;
  }

  yearsOutput.value = outputValue;
  resultText.textContent = sentence;
}
