
let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voiceIcon = document.querySelector("#voice");

let currentLang = "en-IN";
let femaleVoice = null;
function loadVoices() {
  let voices = window.speechSynthesis.getVoices();

  femaleVoice =
    voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.lang.startsWith("hi") && v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.lang.startsWith("en")) ||
    voices[0];
}

window.speechSynthesis.onvoiceschanged = loadVoices;
function detectLanguage(text) {
  const patterns = [
    { lang: "hi-IN", regex: /[\u0900-\u097F]/ }, // Hindi
    { lang: "bn-IN", regex: /[\u0980-\u09FF]/ }, // Bengali
    { lang: "ta-IN", regex: /[\u0B80-\u0BFF]/ }, // Tamil
    { lang: "te-IN", regex: /[\u0C00-\u0C7F]/ }, // Telugu
    { lang: "ml-IN", regex: /[\u0D00-\u0D7F]/ }, // Malayalam
    { lang: "kn-IN", regex: /[\u0C80-\u0CFF]/ }, // Kannada
    { lang: "gu-IN", regex: /[\u0A80-\u0AFF]/ }, // Gujarati
    { lang: "pa-IN", regex: /[\u0A00-\u0A7F]/ }, // Punjabi
    { lang: "ur-IN", regex: /[\u0600-\u06FF]/ }, // Urdu
    { lang: "ar-SA", regex: /[\u0600-\u06FF]/ }, // Arabic
    { lang: "ru-RU", regex: /[А-Яа-я]/ },       // Russian
    { lang: "fr-FR", regex: /\b(bonjour|merci)\b/i },
    { lang: "es-ES", regex: /\b(hola|gracias)\b/i },
    { lang: "de-DE", regex: /\b(hallo|danke)\b/i },
    { lang: "it-IT", regex: /\b(ciao|grazie)\b/i },
    { lang: "pt-PT", regex: /\b(olá|obrigado)\b/i },
    { lang: "ja-JP", regex: /[\u3040-\u30FF]/ },
    { lang: "ko-KR", regex: /[\uAC00-\uD7AF]/ },
    { lang: "zh-CN", regex: /[\u4E00-\u9FFF]/ },
  ];

  for (let p of patterns) {
    if (p.regex.test(text)) return p.lang;
  }

  return "en-IN"; 
}
function speak(text) {
  let utter = new SpeechSynthesisUtterance(text);

  utter.lang = currentLang;
  utter.rate = 1;
  utter.pitch = 1;  
  utter.volume = 1;

  if (femaleVoice) utter.voice = femaleVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
function wishMe() {
  let hour = new Date().getHours();

  if (hour < 12) speak("Good morning");
  else if (hour < 16) speak("Good afternoon");
  else speak("Good evening");
}

window.addEventListener("load", wishMe);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-IN";
recognition.interimResults = false;
recognition.onresult = (event) => {
  let transcript = event.results[event.resultIndex][0].transcript;

  content.innerText = transcript;

  currentLang = detectLanguage(transcript); 
  takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
  recognition.start();
  btn.style.display = "none";
  voiceIcon.style.display = "block";
});

function takeCommand(message) {
  btn.style.display = "flex";
  voiceIcon.style.display = "none";

  if (message.includes("hello") || message.includes("hey")) {
    speak("Hello, how can I help you?");
  }
  else if (message.includes("who are you")) {
    speak("I am a female virtual assistant, created by Ranjeet Kumar.");
  }
  else if (message.includes("time")) {
    let time = new Date().toLocaleTimeString(currentLang, {
      hour: "numeric",
      minute: "numeric"
    });
    speak(time);
  }
  else if (message.includes("date")) {
    let date = new Date().toLocaleDateString(currentLang, {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    speak(date);
  }
  else if (message.includes("open youtube")) {
    speak("Opening YouTube");
    window.open("https://youtube.com", "_blank");
  }
  else if (message.includes("open google")) {
    speak("Opening Google");
    window.open("https://google.com", "_blank");
  }
  else if (message.includes("open facebook")) {
    speak("Opening Facebook");
    window.open("https://facebook.com", "_blank");
  }
  else if (message.includes("open instagram")) {
    speak("Opening Instagram");
    window.open("https://instagram.com", "_blank");
  }
  else {
    speak("This is what I found on the internet");
    window.open(
      `https://www.google.com/search?q=${message.replace("shifra","").replace("shipra","")}`,
      "_blank"
    );
  }
}
