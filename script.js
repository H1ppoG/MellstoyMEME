let memes = [];

// индивидуальные теги для каждого видео (можно править под себя)
const memeTags = {
  "1 банан, да один банан пидор ты ебаный": ["1 банан, да один банан пидор ты ебаный"],
  "А ЭТО КТО НАХУЙ": ["А ЭТО КТО НАХУЙ"],
  "БЛАГОДАРЮ ТЕБЯ СУДЬБА": ["БЛАГОДАРЮ ТЕБЯ СУДЬБА"],
  "БЛЯТЬ ДА НАКОНЕЦ-ТО НАХУЙ": ["БЛЯТЬ ДА НАКОНЕЦ-ТО НАХУЙ"],
  "БЫСТРЕЕ": ["БЫСТРЕЕ"],
  "ВОТ СКАЖИ ЭТО СОН НАХУЙ, СОН, НУ СОН, НЕТ ПИЗДЕЦ ПРОСТО": ["ВОТ СКАЖИ ЭТО СОН НАХУЙ, СОН, НУ СОН, НЕТ ПИЗДЕЦ ПРОСТО"],
  "ВОТ ТЕБЯ РАЗДЕТЬ ВЗЯТЬ ПО ПОПКЕ ВЫЕБАТЬ НЕЗНАЮ": ["ВОТ ТЕБЯ РАЗДЕТЬ ВЗЯТЬ ПО ПОПКЕ ВЫЕБАТЬ НЕЗНАЮ"],
  "ВРОДЕ ДА А ВРОДЕ НЕТ": ["ВРОДЕ ДА А ВРОДЕ НЕТ"],
  "ВСМЫСЛЕ НАХУЙ, НЕ НУ ТИПО": ["ВСМЫСЛЕ НАХУЙ, НЕ НУ ТИПО"],
  "ИДИ НАХУЙ": ["ИДИ НАХУЙ"],
  "КОРОЧЕ Я ЕДУ ТУДА И РАЗБИВАЮ ИМ ЕБАЛО": ["КОРОЧЕ Я ЕДУ ТУДА И РАЗБИВАЮ ИМ ЕБАЛО"],
  "КТО ЛУЧШИЙ": ["КТО ЛУЧШИЙ"],
  "МОЛОДЕЦ, МОЛОДЕЦ, МАЛЕНЬКИЙ, МОЛОДЕЦ, ХОРОШО": ["МОЛОДЕЦ, МОЛОДЕЦ, МАЛЕНЬКИЙ, МОЛОДЕЦ, ХОРОШО"],
  "НЕ ХОТЕЛ БЫ НАХУЙ НАДО, ИЗИЗИ": ["НЕ ХОТЕЛ БЫ НАХУЙ НАДО, ИЗИЗИ"],
  "НЕТ (КРИВОЕ ЕБАЛО)": ["НЕТ (КРИВОЕ ЕБАЛО)"],
  "нет отказано": ["нет отказано"],
  "ну в разные периоды времени я немножечко меняюсь -_-": ["ну в разные периоды времени я немножечко меняюсь -_-"],
  "ну может как нибудь, нет": ["ну может как нибудь, нет"],
  "НУ НОРМАЛЬНО НАХУЙ, НЕ, ЕЩЁ ПОСИДИМ": ["НУ НОРМАЛЬНО НАХУЙ, НЕ, ЕЩЁ ПОСИДИМ"],
  "НЮХАЙ БЫСТРЕЕ БЫСТРЕЕ ЗАГЛОТНИ В РОТ ДУРА": ["НЮХАЙ БЫСТРЕЕ БЫСТРЕЕ ЗАГЛОТНИ В РОТ ДУРА"],
  "Пожалуйста дай следующий спин 3 синих": ["Пожалуйста дай следующий спин 3 синих"],
  "ты блять долбоеб нахуй": ["ты блять долбоеб нахуй"],
  "ТЫ ЧЁ ТО СУКА БОРЩИШЬ": ["ТЫ ЧЁ ТО СУКА БОРЩИШЬ"],
  "УРА СПАСИБО": ["УРА СПАСИБО"],
  "ХАХАХАХ ЭТО ПИЗДА ИЛИ НОРМАЛДЫ": ["ХАХАХАХ ЭТО ПИЗДА ИЛИ НОРМАЛДЫ"],
  "хоть бы сука повезло нахуй": ["хоть бы сука повезло нахуй"],
  "Чё": ["Чё"],
  "Э Э Э Э, ТЫ Ж НЕ ПРОВОЦИРУЙ НА ХУЙНЮ, ЕСЛИ Я УЛЫБАЮСЬ ЭТО НЕ ЗНАЧИТ ЧТО Я ДОБРЫЙ НАЗУЙ, СНИМИ ШТАНЫ": ["Э Э Э Э, ТЫ Ж НЕ ПРОВОЦИРУЙ НА ХУЙНЮ, ЕСЛИ Я УЛЫБАЮСЬ ЭТО НЕ ЗНАЧИТ ЧТО Я ДОБРЫЙ НАЗУЙ, СНИМИ ШТАНЫ"],
  "Я ВСЁ РАВНО ХОЧУ УБИТЬ ИХ ВСЕХ КАК ХАЛК НАХУЙ": ["Я ВСЁ РАВНО ХОЧУ УБИТЬ ИХ ВСЕХ КАК ХАЛК НАХУЙ"],
  "Я МОГУ ЛЮБОГО ОТПИЗДИТЬ": ["Я МОГУ ЛЮБОГО ОТПИЗДИТЬ"],
  "Я ПАМЫЛСЯ": ["Я ПАМЫЛСЯ"]
};

const input = document.getElementById("search");
const container = document.getElementById("memes");
const modal = document.getElementById("player-modal");
const modalVideo = document.getElementById("player-video");
const playPauseBtn = document.getElementById("play-pause-btn");
const volumeSlider = document.getElementById("volume-slider");
const progressBar = document.getElementById("progress-bar");
const closeBtn = document.querySelector(".modal-close");
const submitForm = document.getElementById("submit-form");
const submitStatus = document.getElementById("submit-status");

showMemes(memes);

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  const filtered = memes.filter(meme =>
    meme.title.toLowerCase().includes(value) ||
    meme.tags.some(tag => tag.includes(value))
  );

  showMemes(filtered);
});

function showMemes(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>Ничего не найдено 😢</p>";
    return;
  }

  list.forEach(meme => {
    container.innerHTML += `
      <div class="meme">
        <div class="meme-video-wrap">
          <video src="${meme.video}" preload="metadata"></video>
        </div>
        <p class="meme-title">${meme.title}</p>
      </div>
    `;
  });
}

// ▶️ открытие полноэкранного плеера по клику на превью
container.addEventListener("click", e => {
  const video = e.target.closest("video");
  if (!video) return;

  openPlayer(video.getAttribute("src"));
});

function openPlayer(src) {
  if (!src) return;

  modal.classList.remove("hidden");
  modalVideo.src = src;
  modalVideo.currentTime = 0;
  modalVideo.volume = (Number(volumeSlider.value) || 100) / 100;
  modalVideo.play();
  updatePlayPauseIcon();
  updateSliderFill(volumeSlider);
  updateSliderFill(progressBar);
}

function closePlayer() {
  modalVideo.pause();
  modalVideo.src = "";
  modal.classList.add("hidden");
  progressBar.value = 0;
  updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
  if (!playPauseBtn) return;
  playPauseBtn.textContent = modalVideo.paused ? "▶" : "⏸";
}

playPauseBtn.addEventListener("click", () => {
  if (modalVideo.paused) {
    modalVideo.play();
  } else {
    modalVideo.pause();
  }
  updatePlayPauseIcon();
});

volumeSlider.addEventListener("input", () => {
  const value = Number(volumeSlider.value) || 0;
  modalVideo.volume = value / 100;
  updateSliderFill(volumeSlider);
});

progressBar.addEventListener("input", () => {
  if (!modalVideo.duration || Number.isNaN(modalVideo.duration)) return;
  const percent = Number(progressBar.value) / 100;
  modalVideo.currentTime = modalVideo.duration * percent;
  updateSliderFill(progressBar);
});

modalVideo.addEventListener("timeupdate", () => {
  if (!modalVideo.duration || Number.isNaN(modalVideo.duration)) return;
  const percent = (modalVideo.currentTime / modalVideo.duration) * 100;
  progressBar.value = percent;
  updateSliderFill(progressBar);
});

modalVideo.addEventListener("loadedmetadata", () => {
  progressBar.value = 0;
});

// клик по самому видео — play/pause
modalVideo.addEventListener("click", () => {
  if (modalVideo.paused) {
    modalVideo.play();
  } else {
    modalVideo.pause();
  }
  updatePlayPauseIcon();
});

closeBtn.addEventListener("click", closePlayer);

modal.addEventListener("click", e => {
  if (e.target === modal) {
    closePlayer();
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closePlayer();
  }
});

function updateSliderFill(slider) {
  if (!slider) return;
  const min = Number(slider.min) || 0;
  const max = Number(slider.max) || 100;
  const value = Number(slider.value) || 0;
  const percent = ((value - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, #ffffff ${percent}%, rgba(255,255,255,0.16) ${percent}%)`;
}

// начальное оформление ползунков
updateSliderFill(volumeSlider);
updateSliderFill(progressBar);

init();

if (submitForm) {
  submitForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (!submitStatus) return;

    const videoInput = document.getElementById("submit-video");
    if (!videoInput || !videoInput.files || videoInput.files.length === 0) {
      submitStatus.textContent = "Выбери видеофайл.";
      return;
    }

    submitStatus.textContent = "Отправляю заявку...";

    try {
      const formData = new FormData(submitForm);
      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("submit failed");
      }

      submitForm.reset();
      submitStatus.textContent = "Заявка отправлена на модерацию.";
    } catch {
      submitStatus.textContent = "Не удалось отправить заявку. Нужен запущенный сервер.";
    }
  });
}

async function init() {
  container.innerHTML = "<p>Загружаю видео…</p>";

  const files = await loadMemeFiles();
  memes = files
    .map(file => {
      const title = file.replace(/\.[^/.]+$/, "");
      return {
        title,
        tags: memeTags[title] || [title],
        video: "videos/" + encodeURIComponent(file)
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ru", { sensitivity: "base" }));

  showMemes(memes);
}

async function loadMemeFiles() {
  try {
    const res = await fetch("videos/manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("manifest fetch failed");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("manifest is not an array");
    return data.filter(x => typeof x === "string" && x.trim().length > 0);
  } catch {
    return [];
  }
}