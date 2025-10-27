document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    });

    // Success feedback
    form.reset();
    const textarea = document.getElementById('contactMessage');
    textarea.placeholder = '✅ Message sent successfully!';
    textarea.classList.add('highlight-shake');
    setTimeout(() => textarea.classList.remove('highlight-shake'), 1000);
  } catch (err) {
    alert('❌ Failed to send message. Please try again later.');
    console.error(err);
  }
});
