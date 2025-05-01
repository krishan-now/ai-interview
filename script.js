const startBtn = document.getElementById("startBtn");
const questionEl = document.getElementById("question");
const responseEl = document.getElementById("response");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";

const GPT_API_KEY = "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"; // Replace this

let currentQuestion = "Tell me about yourself.";
questionEl.textContent = currentQuestion;

startBtn.onclick = () => {
  speak(currentQuestion);
  recognition.start();
};

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  responseEl.textContent = `You said: "${transcript}"`;

  const nextQuestion = await fetchGPT(currentQuestion, transcript);
  currentQuestion = nextQuestion;
  questionEl.textContent = currentQuestion;
  speak(currentQuestion);
};

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
}

async function fetchGPT(question, answer) {
  const prompt = `You're an interview coach. I asked: "${question}". The candidate said: "${answer}". What should I ask next?`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GPT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content.trim();
}
