form.addEventListener('submit', async e => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;

  addMessage('user', prompt);          // optional helper
  input.value = '';

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt })
  });
  const data = await res.json();
  addMessage('bot', data.response);     // show Gemini reply
});
