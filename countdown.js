// --- COUNTDOWN TIMER ---
function countdown() {
  const el = document.getElementById("timer");
  if (!el) return;

  const eventDate = new Date("2025-08-06T00:00:00").getTime();
  const diff = eventDate - Date.now();
  if (diff <= 0) {
    el.innerText = "✅ Voting Open!";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  el.innerText = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(countdown, 1000);

// --- MAIN LOGIC ---
window.addEventListener('DOMContentLoaded', () => {
  const statusEl     = document.getElementById('status');
  const catSelect    = document.getElementById('category');
  const nomSelect    = document.getElementById('nominee');
  const voteCountEl  = document.getElementById('voteCount');
  const totalAmountEl= document.getElementById('totalAmount');
  const voteForm     = document.getElementById('voteForm');
  const plusBtn      = document.getElementById('plusBtn');
  const minusBtn     = document.getElementById('minusBtn');
  const payBtn       = document.getElementById('paystackBtn');

  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyrC69ONGG5zfa1LEst4btLifQ-0zdO21kc32AyQSfkiBcKXHkYZI7JYk_Zvo361D5CMA/exec';

  function updateTotal() {
    const n = parseInt(voteCountEl.value) || 1;
    voteCountEl.value = n;
    totalAmountEl.innerText = n * 200;
  }

  plusBtn.onclick = () => { 
    voteCountEl.value = Math.min(500, parseInt(voteCountEl.value) + 1); updateTotal();
  };
  minusBtn.onclick = () => {
    voteCountEl.value = Math.max(1, parseInt(voteCountEl.value) - 1); updateTotal();
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
          nomSelect.innerHTML = '<option value="">-- Select Nominee --</option>';
          (data[catSelect.value] || []).forEach(n => {
            nomSelect.innerHTML += `<option value="${n}">${n}</option>`;
          });
        };
      })
      .catch(err => {
        console.error("Error loading categories:", err);
        statusEl.innerText = '⚠️ Failed to load categories.';
      });
  }

  payBtn.onclick = () => {
    const category = catSelect.value.trim();
    const nominee  = nomSelect.value.trim();
    const votes    = parseInt(voteCountEl.value) || 1;

    if (!category || !nominee) {
      statusEl.innerText = '⚠️ Please select both category & nominee.';
      return;
    }

    const amount = votes * 200 * 100;
    const handler = PaystackPop.setup({
      key: 'pk_test_69c261a7a7eb3373470566dbb8b8ed36942a131f',
      email: `mesa+${Date.now()}@fcfmt.edu.ng`,
      amount, currency: 'NGN',
      ref: `vote_${Date.now()}`,
      metadata: { category, nominee, votes },
      callback: () => {
        statusEl.innerText = '✅ Payment successful! Recording vote...';
        fetch(WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, nominee, votes })
        })
        .then(r => r.json())
        .then(res => {
          statusEl.innerText = res.status || (res.error ? `❌ ${res.error}` : '✅ Vote recorded!');
          voteForm.reset();
          voteCountEl.value = '1';
          updateTotal();
          nomSelect.innerHTML = '<option value="">-- Select Nominee --</option>';
        })
        .catch(err => {
          console.error("Save error:", err);
          statusEl.innerText = '❌ Error saving vote.';
        });
      },
      onClose: () => {
        statusEl.innerText = '❌ Payment cancelled.';
      }
    });
    handler.openIframe();
  };

  countdown();
  loadCategories();
  updateTotal();
});