let speech = new SpeechSynthesisUtterance();
let voices = [];
const voiceSelect = document.getElementById("voiceSelect");
const textArea = document.getElementById("textArea");

const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");
const volume = document.getElementById("volume");

const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const volumeValue = document.getElementById("volumeValue");

// Load system voices (includes Microsoft voices on Windows)
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = voices.map((v, i) =>
    `<option value="${i}">${v.name} (${v.lang})</option>`).join("");

  // Auto-pick Microsoft or default
  const msVoice = voices.find(v => v.name.includes("Microsoft")) || voices[0];
  if (msVoice) {
    voiceSelect.value = voices.indexOf(msVoice);
    speech.voice = msVoice;
  }
}

window.speechSynthesis.onvoiceschanged = loadVoices;

// Speak text
function speak(text) {
  if (!text.trim()) {
    alert("Please type some text first!");
    return;
  }

  speech.text = text;
  speech.rate = rate.value;
  speech.pitch = pitch.value;
  speech.volume = volume.value;
  window.speechSynthesis.speak(speech);
  localStorage.setItem("lastText", text);
}

// Event listeners
document.getElementById("speakBtn").onclick = () => {
  window.speechSynthesis.cancel();
  speak(textArea.value);
};

document.getElementById("pauseBtn").onclick = () => {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
  } else {
    speechSynthesis.pause();
  }
};

document.getElementById("stopBtn").onclick = () => {
  window.speechSynthesis.cancel();
};

document.getElementById("clearBtn").onclick = () => {
  textArea.value = "";
  localStorage.removeItem("lastText");
};

document.getElementById("previewBtn").onclick = () => {
  const v = voices[voiceSelect.value];
  const preview = new SpeechSynthesisUtterance(`This is ${v.name} speaking.`);
  preview.voice = v;
  preview.rate = 1;
  preview.pitch = 1;
  window.speechSynthesis.speak(preview);
};

voiceSelect.onchange = () => {
  speech.voice = voices[voiceSelect.value];
};

// Update values
[rate, pitch, volume].forEach(el => {
  el.oninput = () => {
    document.getElementById(el.id + "Value").textContent = el.value;
  };
});

// Load saved text
window.onload = () => {
  const saved = localStorage.getItem("lastText");
  if (saved) textArea.value = saved;
  setTimeout(() => speak("Welcome to your advanced speech converter!"), 1000);
};

// 🌙 Dark/Light mode toggle
document.getElementById("themeSwitch").addEventListener("change", e => {
  if (e.target.checked) {
    document.body.classList.add("bg-white", "text-black");
    document.body.classList.remove("bg-gradient-to-r", "from-indigo-900", "via-blue-700", "to-cyan-500", "text-white");
  } else {
    document.body.classList.remove("bg-white", "text-black");
    document.body.classList.add("bg-gradient-to-r", "from-indigo-900", "via-blue-700", "to-cyan-500", "text-white");
  }
});

