const chatWindow      = document.getElementById('chat-window');
const chatForm        = document.getElementById('chat-form');
const userInput       = document.getElementById('user-input');
const typingIndicator = document.getElementById('typing-indicator');

// Replace with your free-tier key or proxy through your back end
const GEMINI_API_KEY = 'AIzaSyC0Heb_TGb02tSDcmyWLG--nfiTcammTQo';

function appendMessage(text, sender = 'bot') {
  const row = document.createElement('div');
  row.className = 'message-row';

  const inner = document.createElement('div');
  inner.className = 'message-inner ' + sender;

  const avatar = document.createElement('div');
  avatar.className = `avatar ${sender}`;
  avatar.textContent = sender === 'user' ? 'You' : 'M';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  inner.append(avatar, bubble);
  row.appendChild(inner);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping(show = true) {
  typingIndicator.style.display = show ? 'block' : 'none';
}

async function fetchGeminiResponse(prompt) {
  const res = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  return data.reply || "No response.";
}

chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const prompt = userInput.value.trim();
  if (!prompt) return;

  appendMessage(prompt, 'user');
  userInput.value = '';
  showTyping(true);

  try {
    const reply = await fetchGeminiResponse(prompt);
    appendMessage(reply, 'bot');
  } catch (err) {
    console.error(err);
    appendMessage('Error fetching response. Check your API key or network.', 'bot');
  } finally {
    showTyping(false);
  }
});
