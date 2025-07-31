<script src="https://js.paystack.co/v1/inline.js"></script>
<script>
  const WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_URL_HERE/exec'; // Update with your URL
  const votePrice = 200;
  const maxVotes = 500;
  let categoryData = {};

  const catSelect = document.getElementById('category');
  const nomSelect = document.getElementById('nominee');
  const voteCountEl = document.getElementById('voteCount');
  const totalAmountEl = document.getElementById('totalAmount');
  const plusBtn = document.getElementById('plusBtn');
  const minusBtn = document.getElementById('minusBtn');
  const payBtn = document.getElementById('paystackBtn');

  // Countdown Setup
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

  // Load categories and nominees
  async function loadCategories() {
    try {
      const res = await fetch(WEB_APP_URL);
      categoryData = await res.json();
      catSelect.innerHTML = '<option value="">-- Select Category --</option>';

      Object.keys(categoryData).forEach(cat => {
        catSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
      });

      catSelect.addEventListener('change', () => {
        const nominees = categoryData[catSelect.value] || [];
        nomSelect.innerHTML = '<option value="">-- Select Nominee --</option>';
        nominees.forEach(nom => {
          nomSelect.innerHTML += `<option value="${nom}">${nom}</option>`;
        });
        document.getElementById('nomineeCard').style.display = 'none';
      });

    } catch (err) {
      console.error("⚠️ Failed to load categories", err);
    }
  }

  nomSelect.addEventListener('change', () => {
    const selected = nomSelect.value;
    const selectedCat = catSelect.value;

    const nomineeData = {
      name: selected,
      photo: '', // optionally link image
      bio: '' // optionally link bio
    };

    document.getElementById('nomineeName').textContent = nomineeData.name;
    document.getElementById('nomineeBio').textContent = nomineeData.bio || '';
    document.getElementById('nomineePhoto').src = nomineeData.photo || 'img/default.jpg';
    document.getElementById('nomineeCard').style.display = 'flex';
  });

  // Vote amount logic
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

  // Pay and Submit
  payBtn.addEventListener('click', () => {
    const category = catSelect.value;
    const nominee = nomSelect.value;
    const voteCount = parseInt(voteCountEl.value);
    const amount = voteCount * votePrice * 100;

    if (!category || !nominee) {
      alert("⚠️ Please select both category and nominee.");
      return;
    }

    const handler = PaystackPop.setup({
      key: 'pk_test_69c261a7a7eb3373470566dbb8b8ed36942a131f',
      email: `mesa+${Date.now()}@mesa.com`,
      amount: amount,
      currency: 'NGN',
      metadata: {
        category,
        nominee,
        voteCount
      },
      callback: function(response) {
        // Save to Google Sheet
        fetch(WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `category=${encodeURIComponent(category)}&nominee=${encodeURIComponent(nominee)}`
        })
        .then(res => res.json())
        .then(data => alert(data.status || "✅ Vote recorded"))
        .catch(err => alert("❌ Error saving vote"));
      },
      onClose: function() {
        alert("Payment cancelled.");
      }
    });

    handler.openIframe();
  });

  // Initialize on load
  window.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateAmount();
  });
</script>