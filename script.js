const comboData = {
  1: [
    {
      title: "AI Starter Combo",
      label: "Most Picked",
      desc: "A future-ready set with the AI path in front.",
      items: ["AI Book", "Exercise Book", "Novel", "Free AI Class", "Blind Box", "Mega Draw Ticket"],
      gift: true
    },
    {
      title: "Study Core Combo",
      label: "Top 5",
      desc: "A clean balance for practice and reading momentum.",
      items: ["Exercise Book", "Novel", "AI Book", "Free AI Class", "Blind Box", "Mega Draw Ticket"]
    },
    {
      title: "Comic Boost Combo",
      label: "Top 5",
      desc: "Visual reading energy with the universal AI upgrade.",
      items: ["Comic", "Exercise Book", "AI Book", "Free AI Class", "Blind Box", "Mega Draw Ticket"]
    },
    {
      title: "Reader Combo",
      label: "Top 5",
      desc: "Story-first, with rewards stacked behind it.",
      items: ["Novel", "Comic", "AI Book", "Free AI Class", "Blind Box", "Mega Draw Ticket"]
    },
    {
      title: "All Rounder Combo",
      label: "Top 5",
      desc: "Exercise, story, visuals, and AI in one confident pick.",
      items: ["Exercise Book", "Novel", "Comic", "AI Book", "Free AI Class", "Blind Box"]
    },
    {
      title: "Practice Combo",
      label: "Full Set",
      desc: "More reps, clearer progress.",
      items: ["Exercise Book A", "Exercise Book B", "AI Book", "Free AI Class", "Blind Box"]
    },
    {
      title: "Story Combo",
      label: "Full Set",
      desc: "A reading-led choice with reward access.",
      items: ["Novel A", "Novel B", "AI Book", "Free AI Class", "Mega Draw Ticket"]
    },
    {
      title: "Visual Combo",
      label: "Full Set",
      desc: "Comic-led, quick to pick up.",
      items: ["Comic A", "Comic B", "AI Book", "Free AI Class", "Blind Box"]
    },
    {
      title: "Focus Combo",
      label: "Full Set",
      desc: "Simple, sharp, and practical.",
      items: ["Exercise Book", "Stationery", "AI Book", "Free AI Class", "Mega Draw Ticket"]
    },
    {
      title: "Premium Mix Combo",
      label: "Full Set",
      desc: "A broader set for students who want variety.",
      items: ["Exercise Book", "Novel", "Comic", "AI Book", "Free AI Class", "Blind Box"]
    }
  ],
  2: [],
  3: [],
  4: [],
  5: []
};

for (let form = 2; form <= 5; form += 1) {
  comboData[form] = comboData[1].map((combo, index) => ({
    ...combo,
    title: combo.title.replace("Combo", `F${form} Combo`),
    desc:
      index === 0
        ? `The most picked future-ready set for Form ${form}.`
        : `${combo.desc} Tuned for Form ${form}.`
  }));
}

const formButtons = document.querySelectorAll(".form-btn");
const comboStatus = document.querySelector("#comboStatus");
const comboCarousel = document.querySelector("#comboCarousel");
const comboProgress = document.querySelector("#comboProgress");
const prevCombo = document.querySelector("#prevCombo");
const nextCombo = document.querySelector("#nextCombo");
const viewAllCombo = document.querySelector("#viewAllCombo");
const viewAllLabel = document.querySelector("#viewAllLabel");
const modal = document.querySelector("#comboModal");
const closeModal = document.querySelector("#closeModal");
const modalForm = document.querySelector("#modalForm");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalList = document.querySelector("#modalList");

let activeForm = "1";
let progressButtons = [];

function comboCard(combo, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "combo-card";
  button.dataset.index = index;
  button.innerHTML = `
    <div class="combo-meta">
      <span>${combo.label}</span>
      ${combo.gift ? '<span class="gift-badge">Bonus: guaranteed tech gift</span>' : "<span>Tap for details</span>"}
    </div>
    <div>
      <h3>${combo.title}</h3>
      <p>${combo.desc}</p>
    </div>
  `;
  button.addEventListener("click", () => openCombo(combo));
  return button;
}

function renderCombos() {
  const combos = comboData[activeForm];
  comboStatus.textContent = `Form ${activeForm} combos unlocked.`;
  comboCarousel.innerHTML = "";
  comboProgress.innerHTML = "";
  progressButtons = [];

  combos.slice(0, 5).forEach((combo, index) => {
    comboCarousel.appendChild(comboCard(combo, index));
  });

  // Update the external "see all" button label
  if (viewAllLabel) viewAllLabel.textContent = `See all Form ${activeForm} combos`;

  Array.from(comboCarousel.children).forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Go to combo card ${index + 1}`);
    button.addEventListener("click", () => {
      comboCarousel.scrollTo({
        left: card.offsetLeft - comboCarousel.offsetLeft,
        behavior: "smooth"
      });
    });
    comboProgress.appendChild(button);
    progressButtons.push(button);
  });

  comboCarousel.scrollTo({ left: 0, behavior: "instant" });
  updateCarouselProgress();
}

function setForm(form) {
  activeForm = form;
  formButtons.forEach((button) => {
    const isActive = button.dataset.form === form;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  renderCombos();
}

function openCombo(combo) {
  modal.classList.remove("all-combos");
  modalForm.textContent = `Form ${activeForm}`;
  modalTitle.textContent = combo.title;
  modalDescription.textContent = combo.desc;
  modalList.innerHTML = "";
  modalList.className = "modal-list";
  combo.items.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    modalList.appendChild(span);
  });
  if (combo.gift) {
    const span = document.createElement("span");
    span.textContent = "Bonus: guaranteed tech gift";
    span.className = "gift-badge";
    modalList.appendChild(span);
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  closeModal.focus();
}

function openAllCombos() {
  const combos = comboData[activeForm];
  modal.classList.add("all-combos");
  modalForm.textContent = `Form ${activeForm}`;
  modalTitle.textContent = "All combos";
  modalDescription.textContent = "Choose any combo to see what is inside. Top 5 picks are shown first.";
  modalList.innerHTML = "";
  modalList.className = "modal-list combo-modal-grid";
  combos.forEach((combo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "modal-combo-option";
    button.innerHTML = `
      <span>${index < 5 ? combo.label : "Full Set"}</span>
      <strong>${combo.title}</strong>
      <small>${combo.desc}</small>
    `;
    button.addEventListener("click", () => openCombo(combo));
    modalList.appendChild(button);
  });
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  closeModal.focus();
}

function closeCombo() {
  modal.classList.remove("open");
  modal.classList.remove("all-combos");
  modal.setAttribute("aria-hidden", "true");
}

formButtons.forEach((button) => {
  button.addEventListener("click", () => setForm(button.dataset.form));
});

if (viewAllCombo) viewAllCombo.addEventListener("click", openAllCombos);

prevCombo.addEventListener("click", () => {
  comboCarousel.scrollBy({ left: -comboCarousel.clientWidth, behavior: "smooth" });
});

nextCombo.addEventListener("click", () => {
  comboCarousel.scrollBy({ left: comboCarousel.clientWidth, behavior: "smooth" });
});

function updateCarouselProgress() {
  if (!progressButtons.length) return;
  const cards = Array.from(comboCarousel.children);
  const currentIndex = cards.reduce(
    (closest, card, index) => {
      const distance = Math.abs(card.offsetLeft - comboCarousel.scrollLeft - comboCarousel.offsetLeft);
      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: 0, distance: Number.POSITIVE_INFINITY }
  ).index;

  progressButtons.forEach((button, index) => {
    button.classList.toggle("active", index === currentIndex);
    button.setAttribute("aria-current", index === currentIndex ? "true" : "false");
  });
}

comboCarousel.addEventListener("scroll", () => {
  window.requestAnimationFrame(updateCarouselProgress);
});

closeModal.addEventListener("click", closeCombo);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeCombo();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeCombo();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

renderCombos();
