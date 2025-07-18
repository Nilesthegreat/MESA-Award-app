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
