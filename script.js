// Toggle page visibility
function showPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));
  document.getElementById(pageId)?.classList.add("active");
}

// Search input: filters pages + cards
function searchPages() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const pages = document.querySelectorAll(".page");
  const homePage = document.getElementById("home");

  // Show all cards inside the currently active page
  function showAllCards() {
    document.querySelectorAll(".text-start").forEach((card) => {
      card.style.display = "block";
    });
  }

  // Filter cards inside active page
  function filterCards(query) {
    document.querySelectorAll(".page.active .text-start").forEach((card) => {
      const match = card.innerText.toLowerCase().includes(query);
      card.style.display = match ? "block" : "none";
    });
  }

  if (query === "") {
    // Reset state
    showPage("home");
    pages.forEach((page) => {
      if (page.id !== "home") page.classList.remove("active");
    });
    showAllCards();
  } else {
    // Show only pages that match query
    homePage.classList.remove("active");

    pages.forEach((page) => {
      const match = page.innerText.toLowerCase().includes(query);
      page.classList.toggle("active", match);
    });

    filterCards(query);
  }
}

// Open a popup window with provided URL
function openPopup(url) {
  window.open(url, "popupWindow", "width=auto,height=auto,scrollbars=yes");
}

// ===== THEME SWITCHER =====
const themeSelector = document.getElementById("themeSelector");
themeSelector.addEventListener("change", function () {
  document.body.className = ""; // Clear existing theme classes
  document.body.classList.add("theme-" + this.value);
  if (isDarkMode) document.body.classList.add("dark-mode");
  localStorage.setItem("theme", this.value);
});

// ===== DARK MODE TOGGLE =====
const toggleDark = document.getElementById("toggleDark");
let isDarkMode = localStorage.getItem("dark-mode") === "true";

function updateDarkMode() {
  document.body.classList.toggle("dark-mode", isDarkMode);
  toggleDark.innerText = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("dark-mode", isDarkMode);
}

toggleDark.addEventListener("click", function () {
  isDarkMode = !isDarkMode;
  updateDarkMode();
});

// ===== TEXT SIZE SWITCHER =====
function setTextSize(sizeClass) {
  document.body.classList.remove(
    "scale-small",
    "scale-medium",
    "scale-large",
    "scale-xlarge"
  );
  document.body.classList.add(sizeClass);
  localStorage.setItem("text-size", sizeClass);
}

// ===== RESTORE SETTINGS ON LOAD =====
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "blue";
  const savedSize = localStorage.getItem("text-size") || "scale-medium";
  isDarkMode = localStorage.getItem("dark-mode") === "true";

  themeSelector.value = savedTheme;
  document.body.classList.add("theme-" + savedTheme, savedSize);
  updateDarkMode();
});

// ===== TOGLLE SECTION VISIBILITY ====//
function toggleSection(id) {
  var section = document.getElementById(id);
  section.style.display = section.style.display === "none" ? "block" : "none";
}

// Define each category and its dropdown IDs
const FRI_CATEGORIES = {
  shift: {
    inputs: ["shiftLength", "nightShifts", "shiftGap"],
    output: "shiftTotal",
  },
  workload: {
    inputs: ["patientLoad", "taskComplexity", "breaksTaken"],
    output: "workloadTotal",
  },
  environment: {
    inputs: ["restArea", "envComfort", "sleep24h"],
    output: "environmentTotal",
  },
  psych: {
    inputs: ["distressExposure", "supportAccess"],
    output: "psychTotal",
  },
  health: {
    inputs: ["fatigueSigns"],
    output: "healthTotal",
  },
};

// Generic function to update any category total
function updateFRICategoryTotal(categoryKey) {
  const category = FRI_CATEGORIES[categoryKey];
  let total = 0;

  category.inputs.forEach((id) => {
    const value = parseInt(document.getElementById(id)?.value || "0");
    total += value;
  });

  document.getElementById(category.output).textContent = total;
  updateFRISummary(); // Always refresh the grand total + risk level
}

// Update the grand total and risk level
function updateFRISummary() {
  const shift =
    parseInt(document.getElementById("shiftTotal").textContent) || 0;
  const workload =
    parseInt(document.getElementById("workloadTotal").textContent) || 0;
  const environment =
    parseInt(document.getElementById("environmentTotal").textContent) || 0;
  const psych =
    parseInt(document.getElementById("psychTotal").textContent) || 0;

  const total = shift + workload + environment + psych;
  const totalCell = document.getElementById("FRI-total-value");
  const levelCell = document.getElementById("FRI-risk-level");

  totalCell.textContent = total;
  levelCell.classList.remove("low", "moderate", "high", "critical");

  if (total <= 6) {
    levelCell.textContent = "Low";
    levelCell.classList.add("low");
  } else if (total <= 13) {
    levelCell.textContent = "Moderate";
    levelCell.classList.add("moderate");
  } else if (total <= 19) {
    levelCell.textContent = "High";
    levelCell.classList.add("high");
  } else {
    levelCell.textContent = "Critical";
    levelCell.classList.add("critical");
  }
}

// Attach onchange listeners to all dropdowns
function initFRIListeners() {
  Object.entries(FRI_CATEGORIES).forEach(([key, category]) => {
    category.inputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", () => updateFRICategoryTotal(key));
      }
    });
  });
}

// Initialize listeners once DOM is ready
document.addEventListener("DOMContentLoaded", initFRIListeners);
