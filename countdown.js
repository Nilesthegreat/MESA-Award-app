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

document.getElementById('paystackBtn').onclick = () => {
  const cat = document.getElementById('category').value;
  const nom = document.getElementById('nominee').value;
  const votes = parseInt(document.getElementById('voteCount').value);

  const amount = votes * 200 * 100;

  const handler = PaystackPop.setup({
    key: 'pk_test_69c261a7a7eb3373470566dbb8b8ed36942a131f',
    email: `mesa+${Date.now()}@mesa.com`,
    amount,
    currency: 'NGN',
    callback: function () {
      fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: cat, nominee: nom })
      })
        .then(r => r.json())
        .then(data => {
          document.getElementById('status').textContent = data.status || '✅ Vote recorded!';
        })
        .catch(() => {
          document.getElementById('status').textContent = '❌ Error saving vote.';
        });
    },
    onClose: function () {
      document.getElementById('status').textContent = '❌ Payment cancelled.';
    }
  });

  handler.openIframe();
};
