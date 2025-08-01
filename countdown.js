// ⏳ Countdown Timer
const eventDate = new Date("2025-08-06T00:00:00").getTime();

function countdown() {
  const timerEl = document.getElementById("timer");
  if (!timerEl) return;

  const now = new Date().getTime();
  const distance = eventDate - now;
  if (distance < 0) {
    timerEl.innerText = "✅ Voting Open!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);
  timerEl.innerText = `${days}d ${hrs}h ${mins}m ${secs}s`;
}
setInterval(countdown, 1000);

// ---------- Voting Logic & Paystack ----------

const WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

const status = document.getElementById('status');
const catSelect = document.getElementById('category');
const nomSelect = document.getElementById('nominee');
const voteCountEl = document.getElementById('voteCount');
const totalAmountEl = document.getElementById('totalAmount');
const voteForm = document.getElementById('voteForm');

function updateTotal() {
  const votes = parseInt(voteCountEl.value);
  totalAmountEl.innerText = votes * 200;
}

document.getElementById('plusBtn').onclick = () => {
  let count = parseInt(voteCountEl.value);
  if (count < 500) {
    voteCountEl.value = count + 1;
    updateTotal();
  }
};

document.getElementById('minusBtn').onclick = () => {
  let count = parseInt(voteCountEl.value);
  if (count > 1) {
    voteCountEl.value = count - 1;
    updateTotal();
  }
};

function loadCategories() {
  fetch(WEB_APP_URL)
    .then(res => res.json())
    .then(data => {
      catSelect.innerHTML = '<option value="">-- Select a Category --</option>';
      Object.keys(data).forEach(cat => {
        catSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
      });

      catSelect.onchange = () => {
        const nominees = data[catSelect.value] || [];
        nomSelect.innerHTML = '<option value="">-- Select Nominee --</option>';
        nominees.forEach(n => {
          nomSelect.innerHTML += `<option value="${n}">${n}</option>`;
        });
      };
    })
    .catch(err => {
      console.error("Error loading categories", err);
      status.innerText = '⚠️ Failed to load categories.';
    });
}

document.getElementById('paystackBtn').onclick = () => {
  const category = catSelect.value.trim();
  const nominee = nomSelect.value.trim();
  const voteCount = parseInt(voteCountEl.value);

  if (!category || !nominee) {
    status.innerText = '⚠️ Please select both category and nominee.';
    return;
  }

  const amount = voteCount * 200 * 100; // in kobo

  const handler = PaystackPop.setup({
    key: 'pk_test_69c261a7a7eb3373470566dbb8b8ed36942a131f',
    email: `mesa+${Date.now()}@fcfmt.edu.ng`,
    amount,
    currency: 'NGN',
    ref: `vote_${Date.now()}`,
    metadata: { category, nominee, voteCount },
    callback: () => {
      status.innerText = '✅ Payment successful. Recording vote...';
      fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, nominee })
      })
        .then(res => res.json())
        .then(data => {
          status.innerText = data.status || '✅ Vote recorded!';
          voteForm.reset();
          voteCountEl.value = '1';
          updateTotal();
          nomSelect.innerHTML = '<option value="">-- Select Nominee --</option>';
        })
        .catch(err => {
          console.error("Vote-saving error:", err);
          status.innerText = '❌ Error saving vote.';
        });
    },
    onClose: () => {
      status.innerText = '❌ Payment cancelled.';
    }
  });

  handler.openIframe();
};

document.addEventListener('DOMContentLoaded', () => {
  countdown();
  loadCategories();
  updateTotal();
});