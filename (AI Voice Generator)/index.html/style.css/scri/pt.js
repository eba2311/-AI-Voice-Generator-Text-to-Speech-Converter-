
// ===========================================
// TEXT-TO-SPEECH ADVANCED SCRIPT
// ===========================================

// Initialize global speech synthesis object
const speech = new SpeechSynthesisUtterance();
let voices = [];

// DOM Elements
const voiceSelect = document.getElementById("voiceSelect");
const textArea = document.getElementById("textArea");
const rateSlider = document.getElementById("rate");
const pitchSlider = document.getElementById("pitch");
const volumeSlider = document.getElementById("volume");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const volumeValue = document.getElementById("volumeValue");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");

// Load available voices dynamically
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = voices
        .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
        .join("");

    // Auto-select default language
    const defaultVoice = voices.find(v => v.lang.startsWith(navigator.language));
    if (defaultVoice) {
        voiceSelect.value = voices.indexOf(defaultVoice);
        speech.voice = defaultVoice;
    }
}

// Trigger load voices when changed
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// ===========================================
// EVENT LISTENERS
// ===========================================

// Voice change
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Update sliders labels dynamically
rateSlider.addEventListener("input", () => { rateValue.textContent = rateSlider.value; });
pitchSlider.addEventListener("input", () => { pitchValue.textContent = pitchSlider.value; });
volumeSlider.addEventListener("input", () => { volumeValue.textContent = volumeSlider.value; });

// Speak button
speakBtn.addEventListener("click", () => {
    const text = textArea.value.trim();
    if (!text) {
        alert("⚠️ Please enter some text!");
        return;
    }

    // Stop current speech
    window.speechSynthesis.cancel();

    // Apply settings
    speech.text = text;
    speech.rate = rateSlider.value;
    speech.pitch = pitchSlider.value;
    speech.volume = volumeSlider.value;

    // Save text locally
    localStorage.setItem("lastText", text);

    // Speak
    window.speechSynthesis.speak(speech);

    // Optional: show status glow
    speakBtn.classList.add("speaking");
    speech.onend = () => { speakBtn.classList.remove("speaking"); };
});

// Pause / Resume
pauseBtn.addEventListener("click", () => {
    if (window.speechSynthesis.speaking) {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            pauseBtn.textContent = "Pause";
        } else {
            window.speechSynthesis.pause();
            pauseBtn.textContent = "Resume";
        }
    }
});

// Stop speech
stopBtn.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    pauseBtn.textContent = "Pause";
});

// Clear textarea
clearBtn.addEventListener("click", () => {
    textArea.value = "";
    localStorage.removeItem("lastText");
});

// Load last typed text
window.addEventListener("load", () => {
    const savedText = localStorage.getItem("lastText");
    if (savedText) textArea.value = savedText;
});

// Optional: keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") speakBtn.click();
    if (e.ctrlKey && e.key === "p") pauseBtn.click();
    if (e.ctrlKey && e.key === "s") stopBtn.click();
});

// Optional: Add sound effect when speaking
speech.onstart = () => {
    console.log("🔊 Speaking started...");
};
speech.onend = () => {
    console.log("✅ Speaking ended.");
};
speech.onerror = (err) => {
    console.error("❌ Speech error:", err);
};
