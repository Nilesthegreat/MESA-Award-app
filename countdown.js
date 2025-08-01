// ----- Countdown Timer -----
const eventDate = new Date("2025-08-06T00:00:00").getTime();
function countdown() {
  const el = document.getElementById("timer");
  if (!el) return;
  const diff = eventDate - Date.now();
  if (diff <= 0) {
    el.innerText = "✅ Voting Open!";
    return;
  }
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const m = Math.floor((diff % (1000*60*60)) / (1000*60));
  const s = Math.floor((diff % (1000*60)) / 1000);
  el.innerText = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(countdown, 1000);

// ----- Voting Logic -----
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyrC69ONGG5zfa1LEst4btLifQ-0zdO21kc32AyQSfkiBcKXHkYZI7JYk_Zvo361D5CMA/exec';

function updateTotal() {
  const count = parseInt(document.getElementById('voteCount').value);
  document.getElementById('totalAmount').innerText = count * 200;
}

function loadCategories() {
  fetch(WEB_APP_URL)
    .then(r=>r.json())
    .then(data => {
      const cs = document.getElementById('category');
      cs.innerHTML = '<option value="">-- Select Category --</option>';
      Object.keys(data).forEach(cat => {
        cs.innerHTML += `<option value="${cat}">${cat}</option>`;
      });
      cs.onchange = () => {
        const ns = document.getElementById('nominee');
        ns.innerHTML = '<option value="">-- Select Nominee --</option>';
        (data[cs.value] || []).forEach(n => {
          ns.innerHTML += `<option value="${n}">${n}</option>`;
        });
      };
    })
    .catch(err => document.getElementById('status').innerText = '⚠️ Failed loading categories');
}

document.getElementById('plusBtn').onclick = () => {
  const el = document.getElementById('voteCount');
  let n = parseInt(el.value);
  if (n < 500) el.value = n + 1;
  updateTotal();
};
document.getElementById('minusBtn').onclick = () => {
  const el = document.getElementById('voteCount');
  let n = parseInt(el.value);
  if (n > 1) el.value = n - 1;
  updateTotal();
};

document.getElementById('paystackBtn').onclick = () => {
  const category = document.getElementById('category').value.trim();
  const nominee  = document.getElementById('nominee').value.trim();
  const votes    = parseInt(document.getElementById('voteCount').value);

  const status = document.getElementById('status');
  if (!category || !nominee) {
    status.innerText = '⚠️ Please select category and nominee.';
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
      status.innerText = '✅ Payment success. Recording vote...';
      fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, nominee, voteCount: votes })
      })
      .then(r=>r.json())
      .then(json => {
        status.innerText = json.status;
        document.getElementById('voteForm').reset();
        document.getElementById('voteCount').value = 1;
        updateTotal();
      })
      .catch(err => {
        console.error(err);
        status.innerText = '❌ Error saving vote.';
      });
    },
    onClose: () => status.innerText = '❌ Payment cancelled.'
  });
  handler.openIframe();
};

document.addEventListener('DOMContentLoaded', () => {
  countdown();
  loadCategories();
  updateTotal();
});
