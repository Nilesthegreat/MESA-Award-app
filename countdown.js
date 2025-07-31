// 📅 COUNTDOWN TIMER
const eventDate = new Date("2025-08-06T00:00:00").getTime();

function countdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance < 0) {
    document.getElementById("timer").innerText = "✅ Voting Open!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer").innerText = `${days}d ${hrs}h ${mins}m ${secs}s`;
}

setInterval(countdown, 1000);

// 💵 VOTE MULTIPLIER + PAYSTACK PAYMENT

const voteCountEl = document.getElementById('voteCount');
const totalAmountEl = document.getElementById('totalAmount');
const plusBtn = document.getElementById('plusBtn');
const minusBtn = document.getElementById('minusBtn');
const payBtn = document.getElementById('paystackBtn');

const votePrice = 200;
const maxVotes = 500;

function updateAmount() {
  const votes = parseInt(voteCountEl.value);
  totalAmountEl.textContent = votes * votePrice;
}

plusBtn.addEventListener('click', () => {
  let count = parseInt(voteCountEl.value);
  if (count < maxVotes) {
    voteCountEl.value = count + 1;
    updateAmount();
  }
});

minusBtn.addEventListener('click', () => {
  let count = parseInt(voteCountEl.value);
  if (count > 1) {
    voteCountEl.value = count - 1;
    updateAmount();
  }
});

payBtn.addEventListener('click', () => {
  const voteCount = parseInt(voteCountEl.value);
  const amount = voteCount * votePrice * 100; // Paystack expects kobo
  const category = document.getElementById("category").value;
  const nominee = document.getElementById("nominee").value;

  if (!category || !nominee) {
    alert("⚠️ Please select a category and nominee first.");
    return;
  }

  var handler = PaystackPop.setup({
    key: 'pk_test_69c261a7a7eb3373470566dbb8b8ed36942a131f',
    email: `mesa${Date.now()}@fcfmt.edu.ng`, // dynamic dummy email
    amount: amount,
    currency: "NGN",
    metadata: {
      category: category,
      nominee: nominee,
      votes: voteCount
    },
    callback: function(response) {
      alert("✅ Payment successful! Ref: " + response.reference);

      // ✅ SAVE VOTE TO GOOGLE SHEET
      fetch('https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, nominee })
      })
      .then(res => res.json())
      .then(data => {
        alert(data.status || "✅ Vote recorded!");
      })
      .catch(err => {
        console.error("❌ Error sending vote:", err);
        alert("❌ Error saving vote. Please contact admin.");
      });
    },

    onClose: function() {
      alert("❌ Payment cancelled.");
    }
  });

  handler.openIframe();
});

updateAmount(); // on load