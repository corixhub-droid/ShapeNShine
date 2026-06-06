console.log("JS LOADED");
const heroTrack = document.getElementById("heroTrack");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");

let heroIndex = 0;
let autoSlide;

function updateHeroCarousel() {
    heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
}

function nextSlide() {
    heroIndex++;
    if (heroIndex >= heroSlides.length) {
        heroIndex = 0;
    }
    updateHeroCarousel();
}

function prevSlide() {
    heroIndex--;
    if (heroIndex < 0) {
        heroIndex = heroSlides.length - 1;
    }
    updateHeroCarousel();
}

heroNext.addEventListener("click", nextSlide);
heroPrev.addEventListener("click", prevSlide);

function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 4000);   // every 4 sec
}

function stopAutoSlide() {
    clearInterval(autoSlide);
}

startAutoSlide();
const modal = document.getElementById("serviceModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

const serviceCards = document.querySelectorAll(".service-card");

const serviceData = [
    {
        title: "Holistic Workout Plans",
        text: "A full-body approach that aligns movement, strength, and recovery."
    },
    {
        title: "Targeted Fitness Boost",
        text: "Focused training to improve specific areas efficiently."
    },
    {
        title: "Energy-Boosting Teas",
        text: "Natural blends designed for sustained energy and wellness."
    },
    {
        title: "Wellness Guidance",
        text: "Practical, personalized guidance for a balanced lifestyle."
    }
];

serviceCards.forEach((card, index) => {
    card.addEventListener("click", () => {
        modal.style.display = "flex";
        modalTitle.textContent = serviceData[index].title;
        modalText.textContent = serviceData[index].text;
    });
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});
const MAX_QTY = 5;
const WHATSAPP_NUMBER = "919111107790";

const cart = {};

const cartBtn = document.getElementById("cartBtn");
const cartPopup = document.getElementById("cartPopup");
const cartClose = document.getElementById("cartClose");
const cartBadge = document.getElementById("cartBadge");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const teaCards = document.querySelectorAll(".tea-card");

teaCards.forEach((card) => {
  const id = card.dataset.id;
  const name = card.dataset.name;
  const price = Number(card.dataset.price);

  const addBtn = card.querySelector(".add-btn");
  const qtyControl = card.querySelector(".qty-control");
  const minusBtn = card.querySelector(".minus");
  const plusBtn = card.querySelector(".plus");
  const qtyValue = card.querySelector(".qty-value");

  cart[id] = {
    id,
    name,
    price,
    quantity: 0,
    elements: {
      addBtn,
      qtyControl,
      minusBtn,
      plusBtn,
      qtyValue
    }
  };

  addBtn.addEventListener("click", () => {
    if (cart[id].quantity === 0) {
      cart[id].quantity = 1;
      syncProductUI(id);
      renderCart();
    }
  });

  plusBtn.addEventListener("click", () => {
    if (cart[id].quantity < MAX_QTY) {
      cart[id].quantity += 1;
      syncProductUI(id);
      renderCart();
    }
  });

  minusBtn.addEventListener("click", () => {
    if (cart[id].quantity > 0) {
      cart[id].quantity -= 1;
      syncProductUI(id);
      renderCart();
    }
  });

  syncProductUI(id);
});

function syncProductUI(id) {
  const item = cart[id];
  const { addBtn, qtyControl, minusBtn, plusBtn, qtyValue } = item.elements;

  qtyValue.textContent = item.quantity;

  if (item.quantity > 0) {
    addBtn.style.display = "none";
    qtyControl.classList.add("active");
  } else {
    addBtn.style.display = "block";
    qtyControl.classList.remove("active");
  }

  minusBtn.disabled = item.quantity <= 0;
  plusBtn.disabled = item.quantity >= MAX_QTY;
}

function renderCart() {
  const activeItems = Object.values(cart).filter(item => item.quantity > 0);

  let totalQty = 0;
  let totalPrice = 0;

  if (activeItems.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Nothing selected so far.</p>`;
    cartBadge.textContent = "0";
    cartTotal.textContent = "₹0";
    return;
  }

  const html = activeItems.map(item => {
    const lineTotal = item.quantity * item.price;
    totalQty += item.quantity;
    totalPrice += lineTotal;

    return `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Qty: ${item.quantity} × ₹${item.price}</div>
        </div>
        <div>₹${lineTotal}</div>
      </div>
    `;
  }).join("");

  cartItems.innerHTML = html;
  cartBadge.textContent = totalQty;
  cartTotal.textContent = `₹${totalPrice}`;
}

if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    cartPopup.classList.toggle("show");
  });
}

if (cartClose) {
  cartClose.addEventListener("click", () => {
    cartPopup.classList.remove("show");
  });
}

document.addEventListener("click", (e) => {
  if (
    cartPopup &&
    cartBtn &&
    !cartPopup.contains(e.target) &&
    !cartBtn.contains(e.target)
  ) {
    cartPopup.classList.remove("show");
  }
});

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const activeItems = Object.values(cart).filter(item => item.quantity > 0);

    if (activeItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    let total = 0;
    let message = "Hi, I would like to place an order:%0A";

    activeItems.forEach(item => {
      const lineTotal = item.quantity * item.price;
      total += lineTotal;
      message += `- ${item.name} x ${item.quantity} = ₹${lineTotal}%0A`;
    });

    message += `%0ATotal: ₹${total}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  });
}
/* =============================
   STORE ORDERS (SIMPLE VERSION)
============================= */

let orders = [];

/* When checkout happens → save order */
function checkoutCart() {
    const activeItems = Object.values(cart).filter(item => item.quantity > 0);

    if (activeItems.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    /* Save order */
    orders.push(activeItems.map(item => ({
        name: item.name,
        quantity: item.quantity
    })));

    let total = 0;
    let message = "Hi, I would like to place an order:%0A";

    activeItems.forEach(item => {
        const lineTotal = item.quantity * item.price;
        total += lineTotal;
        message += `- ${item.name} x ${item.quantity} = ₹${lineTotal}%0A`;
    });

    message += `%0ATotal: ₹${total}`;

    const url = `https://wa.me/919111107790?text=${message}`;
    window.open(url, "_blank");
}
function viewOrders() {
    const popup = document.getElementById("ordersPopup");
    const content = document.getElementById("ordersContent");

    if (orders.length === 0) {
        content.innerHTML = "<p>No orders yet.</p>";
    } else {
        let html = "";

        orders.forEach((order, index) => {
            html += `<div><strong>Order ${index + 1}</strong><br>`;

            order.forEach(item => {
                html += `${item.name} x ${item.quantity}<br>`;
            });

            html += "</div><br>";
        });

        content.innerHTML = html;
    }

    popup.classList.add("show");
}
function closeOrdersPopup() {
    document.getElementById("ordersPopup").classList.remove("show");
}
function logoutUser() {
    orders = [];    // clear orders
    alert("Logged out successfully.");
}

const accountBtn = document.getElementById("accountBtn");
const accountMenu = document.getElementById("accountMenu");

if (accountBtn && accountMenu) {
    accountBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        accountMenu.classList.toggle("show");
    });

    document.addEventListener("click", function () {
        accountMenu.classList.remove("show");
    });
}

let quizAnswers = [];
let currentQuestion = 1;

function openQuiz() {
  const popup = document.getElementById("quizPopup");
  if (!popup) return;

  popup.classList.add("show");
  resetQuiz();
}
function closeQuiz() {
    document.getElementById("quizPopup").classList.remove("show");
}

function selectAnswer(option) {
    quizAnswers.push(option);
    currentQuestion++;

    if (currentQuestion > 5) {
        showResult();
    } else {
        loadQuestion(currentQuestion);
    }
}
/* =============================
   QUIZ - REDONE FROM SCRATCH
============================= */

const quizData = [
  {
    question: "What is your biggest morning hurdle?",
    options: [
      { key: "A", text: "I feel groggy and struggle to focus." },
      { key: "B", text: "My mind starts racing before the day even begins." },
      { key: "C", text: "I wake up dull and unmotivated." },
      { key: "D", text: "I can’t slow down enough to ease into the day." }
    ]
  },
  {
    question: "What mid-day or evening issue hits you the most?",
    options: [
      { key: "A", text: "I lose focus and hit a productivity wall." },
      { key: "B", text: "My brain won’t switch off." },
      { key: "C", text: "I feel drained and low on energy." },
      { key: "D", text: "I feel overwhelmed and disconnected from myself." }
    ]
  },
  {
    question: "What kind of support do you need most right now?",
    options: [
      { key: "A", text: "Sharper focus and better mental clarity." },
      { key: "B", text: "Peace, calm, and less mental noise." },
      { key: "C", text: "A natural lift in energy and mood." },
      { key: "D", text: "More balance, softness, and ease." }
    ]
  },
  {
    question: "What do you want your tea ritual to feel like?",
    options: [
      { key: "A", text: "Fresh, purposeful, and energizing." },
      { key: "B", text: "Quiet, reflective, and grounding." },
      { key: "C", text: "Joyful, bright, and uplifting." },
      { key: "D", text: "Comforting, beautiful, and restful." }
    ]
  },
  {
    question: "Which of these sounds most like your ideal outcome?",
    options: [
      { key: "A", text: "I want to feel switched on and ready to perform." },
      { key: "B", text: "I want to feel calm and mentally clear." },
      { key: "C", text: "I want to feel happy, light, and recharged." },
      { key: "D", text: "I want to feel balanced, composed, and reset." }
    ]
  }
];

let quizState = {
  currentIndex: 0,
  answers: []
};

function openQuiz() {
  const popup = document.getElementById("quizPopup");
  if (!popup) return;

  popup.classList.add("show");
  resetQuiz();
}

function closeQuiz() {
  const popup = document.getElementById("quizPopup");
  if (!popup) return;

  popup.classList.remove("show");
}

function resetQuiz() {
  quizState.currentIndex = 0;
  quizState.answers = [];

  const actions = document.getElementById("quizActions");
  if (actions) actions.style.display = "none";

  renderQuestion();
  updateQuizProgress();
}

function retryQuiz() {
  resetQuiz();
}

function updateQuizProgress() {
  const progressFill = document.getElementById("quizProgressFill");
  const progressText = document.getElementById("quizProgressText");

  const total = quizData.length;
  const current = Math.min(quizState.currentIndex + 1, total);
  const percent = ((quizState.currentIndex) / total) * 100;

  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }

  if (progressText) {
    if (quizState.currentIndex < total) {
      progressText.textContent = `Question ${current} of ${total}`;
    } else {
      progressText.textContent = `Your result is ready`;
    }
  }
}

function selectAnswer(optionKey) {
  quizState.answers.push(optionKey);

  if (quizState.currentIndex < quizData.length - 1) {
    quizState.currentIndex += 1;
    renderQuestion();
    updateQuizProgress();
  } else {
    showQuizResult();
  }
}

function renderQuestion() {
  const container = document.getElementById("quizContent");
  if (!container) return;

  const currentQuestion = quizData[quizState.currentIndex];

  container.innerHTML = `
    <div class="quiz-question-card">
      <p class="quiz-question">${currentQuestion.question}</p>
      <div class="quiz-options">
        ${currentQuestion.options.map(option => `
          <button type="button" class="quiz-option-btn" onclick="selectAnswer('${option.key}')">
            <span class="quiz-option-dot"></span>
            <span class="quiz-option-text">${option.text}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function showQuizResult() {
  const container = document.getElementById("quizContent");
  const actions = document.getElementById("quizActions");
  const progressFill = document.getElementById("quizProgressFill");
  const progressText = document.getElementById("quizProgressText");

  if (!container) return;

  const counts = { A: 0, B: 0, C: 0, D: 0 };
  quizState.answers.forEach(answer => {
    counts[answer] += 1;
  });

  let result = "A";
  if (counts.B > counts[result]) result = "B";
  if (counts.C > counts[result]) result = "C";
  if (counts.D > counts[result]) result = "D";

  let resultTitle = "";
  let resultText = "";
  let teaLabel = "";

  if (result === "A") {
    teaLabel = "Uplift";
    resultTitle = "Your Match: Uplift 🌞";
    resultText = "You need focus, energy, and a clear start. Uplift is the best fit for helping you feel switched on, fresh, and ready to move.";
  } else if (result === "B") {
    teaLabel = "Zen";
    resultTitle = "Your Match: Zen 🌿";
    resultText = "You need calm, clarity, and room to breathe. Zen is your blend for quieting mental noise and creating a gentler rhythm.";
  } else if (result === "C") {
    teaLabel = "Berry Happy";
    resultTitle = "Your Match: Berry Happy 🍓";
    resultText = "You need sparkle, joy, and a mood lift. Berry Happy is your feel-good blend when your energy and spirit need a bright reset.";
  } else {
    teaLabel = "Bliss";
    resultTitle = "Your Match: Bliss 🌸";
    resultText = "You need balance, softness, and a sense of ease. Bliss is ideal when you want your day to feel more composed and beautiful.";
  }

  container.innerHTML = `
    <div class="quiz-result-card">
      <div class="quiz-result-badge">${teaLabel}</div>
      <h4 class="quiz-result-title">${resultTitle}</h4>
      <p class="quiz-result-text">${resultText}</p>
    </div>
  `;

  quizState.currentIndex = quizData.length;

  if (progressFill) progressFill.style.width = "100%";
  if (progressText) progressText.textContent = "Your result is ready";
  if (actions) actions.style.display = "flex";
}