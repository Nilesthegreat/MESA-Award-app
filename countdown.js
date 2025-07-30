// Set your event date here (YYYY-MM-DD)
const eventDate = new Date("2025-07-10T23:59:59").getTime();

const countdown = () => {
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance < 0) {
    document.getElementById("timer").innerText = "✅ Deadline Reached!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer").innerText = `${days}d ${hrs}h ${mins}m ${secs}s`;
};

setInterval(countdown, 1000);
<script src="https://js.paystack.co/v1/inline.js"></script>
<script>
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
    const amount = voteCount * votePrice * 100; // Paystack uses Kobo

    var handler = PaystackPop.setup({
      key: 'pk_test_69c261a7a7eb3373470566dbb8b8ed36942a131f', // ✅ Your public key
      email: "mesa@fcfmt.edu.ng", // You can make this dynamic later
      amount: amount,
      currency: "NGN",
      callback: function(response) {
        alert("✅ Payment successful! Ref: " + response.reference);
        // 🔁 You can now trigger a Google Apps Script POST here if needed
      },
      onClose: function() {
        alert("❌ Payment cancelled");
      }
    });

    handler.openIframe();
  });

  updateAmount(); // on load
</script>
