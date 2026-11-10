const questions = [
  {
    topic: "Нерегульоване перехрестя",
    prompt: "На нерегульованому перехресті рівнозначних доріг автомобіль наближається до вас справа. Як слід діяти?",
    options: [
      "Поступитися автомобілю справа",
      "Проїхати першим",
      "Подати звуковий сигнал і продовжити рух",
    ],
    correct: 0,
    explanation: "На перехресті рівнозначних доріг водій повинен дати дорогу транспортному засобу, що наближається справа.",
  },
  {
    topic: "Поворот ліворуч",
    prompt: "Під час дозволеного зеленого сигналу світлофора ви повертаєте ліворуч, а зустрічний автомобіль рухається прямо. Кому потрібно дати дорогу?",
    options: [
      "Зустрічному автомобілю",
      "Автомобілю, що повертає ліворуч",
      "Перевага залежить лише від швидкості",
    ],
    correct: 0,
    explanation: "Під час повороту ліворуч на зелений сигнал водій має дати дорогу зустрічним транспортним засобам, що рухаються прямо або повертають праворуч.",
  },
  {
    topic: "Пішохідний перехід",
    prompt: "Пішохід почав переходити дорогу нерегульованим переходом у вашому напрямку руху. Як слід діяти?",
    options: [
      "Прискоритися, щоб проїхати перед пішоходом",
      "Дати пішоходу дорогу",
      "Подати звуковий сигнал і продовжити рух",
    ],
    correct: 1,
    explanation: "Перед нерегульованим пішохідним переходом водій повинен зменшити швидкість і, за потреби, зупинитися, щоб дати дорогу пішоходам.",
  },
  {
    topic: "Перестроювання",
    prompt: "Ви хочете перестроїтися в сусідню смугу, якою вже рухається інший автомобіль. Хто має перевагу?",
    options: [
      "Автомобіль, який уже рухається цією смугою",
      "Водій, який вмикнув покажчик повороту",
      "Автомобіль, що рухається швидше",
    ],
    correct: 0,
    explanation: "Під час перестроювання водій повинен дати дорогу транспортним засобам, що рухаються смугою, на яку він має намір перестроїтися.",
  },
  {
    topic: "Дорога з перевагою",
    prompt: "Ви рухаєтеся головною дорогою. Інший автомобіль виїжджає з другорядної дороги. Як слід діяти?",
    options: [
      "Дати дорогу автомобілю з другорядної дороги",
      "Продовжити рух, переконавшись у безпеці",
      "Зупинитися незалежно від дорожньої ситуації",
    ],
    correct: 1,
    explanation: "На нерегульованому перехресті водії на другорядній дорозі повинні дати дорогу транспортним засобам, що наближаються головною дорогою.",
  },
];

const storageKey = "getdrive-attempts";
const routeSelect = document.querySelector("#route-select");
const questionLabel = document.querySelector("#scene-label");
const prompt = document.querySelector("#scene-prompt");
const optionsContainer = document.querySelector("#quiz-options");
const feedback = document.querySelector("#quiz-feedback");
const submitButton = document.querySelector("#quiz-submit");
const progressLabel = document.querySelector("#progress-label");
const scoreLabel = document.querySelector("#score-label");
const progressBar = document.querySelector(".progress-track");
const progressFill = document.querySelector("#progress-fill");
const journalSummary = document.querySelector("#journal-summary");
const journalList = document.querySelector("#journal-list");

function readAttempts() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      throw new TypeError("Журнал GetDrive має бути списком спроб.");
    }

    return parsed.filter((attempt) =>
      attempt
      && typeof attempt.route === "string"
      && typeof attempt.prompt === "string"
      && typeof attempt.answer === "string"
      && typeof attempt.correct === "boolean"
      && typeof attempt.date === "string"
      && Number.isFinite(Date.parse(attempt.date)),
    );
  } catch (error) {
    console.error("Не вдалося прочитати журнал спроб GetDrive.", error);
    return [];
  }
}

let attempts = readAttempts();
let questionIndex = 0;
let correctAnswers = 0;
let answerChecked = false;

function saveAttempts() {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(attempts));
  } catch (error) {
    console.error("Не вдалося зберегти журнал спроб GetDrive.", error);
  }
}

function renderJournal() {
  journalList.replaceChildren();

  const correctCount = attempts.filter((attempt) => attempt.correct).length;
  journalSummary.textContent = attempts.length
    ? `Відповідей у журналі: ${attempts.length} · правильних: ${correctCount} (${Math.round((correctCount / attempts.length) * 100)}%)`
    : "Поки що відповідей немає. Результати з'являться тут після перевірки першої ситуації.";

  attempts.slice(-8).reverse().forEach((attempt) => {
    const item = document.createElement("li");
    const details = document.createElement("div");
    const title = document.createElement("strong");
    const answer = document.createElement("p");
    const result = document.createElement("span");
    const date = document.createElement("time");

    title.textContent = `${attempt.route} · ${attempt.prompt}`;
    answer.textContent = `Ваша відповідь: ${attempt.answer}`;
    result.className = attempt.correct ? "journal-result is-correct" : "journal-result is-incorrect";
    result.textContent = attempt.correct ? "Правильно" : "Потрібно повторити";
    date.dateTime = attempt.date;
    date.textContent = new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(attempt.date));

    details.append(title, answer);
    item.append(details, result, date);
    journalList.append(item);
  });
}

function renderQuestion() {
  const question = questions[questionIndex];
  questionLabel.textContent = `${question.topic} · ситуація ${questionIndex + 1} з ${questions.length}`;
  prompt.textContent = question.prompt;
  optionsContainer.replaceChildren();
  feedback.textContent = "";
  feedback.className = "quiz-feedback";
  answerChecked = false;
  submitButton.textContent = "Перевірити відповідь";

  question.options.forEach((option, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = String(index);
    input.id = `answer-${index}`;
    label.className = "quiz-option";
    label.htmlFor = input.id;
    label.append(input, document.createTextNode(option));
    optionsContainer.append(label);
  });

  progressLabel.textContent = `Ситуація ${questionIndex + 1} з ${questions.length}`;
  progressBar.setAttribute("aria-valuenow", String(questionIndex));
  progressFill.style.width = `${(questionIndex / questions.length) * 100}%`;
  scoreLabel.textContent = `Правильних відповідей: ${correctAnswers}`;
}

optionsContainer.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLInputElement) || answerChecked) return;
  optionsContainer.querySelectorAll(".quiz-option").forEach((label) => {
    label.classList.toggle("is-selected", label.contains(event.target));
  });
  feedback.textContent = "";
  feedback.className = "quiz-feedback";
});

submitButton.addEventListener("click", () => {
  if (answerChecked) {
    if (questionIndex === questions.length - 1) {
      questionIndex = 0;
      correctAnswers = 0;
    } else {
      questionIndex += 1;
    }
    renderQuestion();
    return;
  }

  const selected = optionsContainer.querySelector('input[name="answer"]:checked');
  if (!selected) {
    feedback.textContent = "Спочатку оберіть відповідь.";
    feedback.classList.add("is-prompt");
    return;
  }

  const question = questions[questionIndex];
  const isCorrect = Number(selected.value) === question.correct;
  const selectedAnswer = question.options[Number(selected.value)];
  answerChecked = true;
  correctAnswers += Number(isCorrect);
  optionsContainer.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.disabled = true;
  });

  feedback.textContent = `${isCorrect ? "Правильно. " : "Не зовсім. "}${question.explanation}`;
  feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
  submitButton.textContent = questionIndex === questions.length - 1
    ? "Завершити тренування"
    : "Наступна ситуація";
  progressLabel.textContent = `Опрацьовано ${questionIndex + 1} з ${questions.length}`;
  progressBar.setAttribute("aria-valuenow", String(questionIndex + 1));
  progressFill.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  scoreLabel.textContent = `Правильних відповідей: ${correctAnswers}`;

  attempts.push({
    route: routeSelect.selectedOptions[0].textContent,
    prompt: question.prompt,
    answer: selectedAnswer,
    correct: isCorrect,
    date: new Date().toISOString(),
  });
  attempts = attempts.slice(-50);
  saveAttempts();
  renderJournal();
});

routeSelect.addEventListener("change", () => {
  questionIndex = 0;
  correctAnswers = 0;
  renderQuestion();
});

document.querySelectorAll(".route-link").forEach((link) => {
  link.addEventListener("click", () => {
    routeSelect.value = link.dataset.route;
    routeSelect.dispatchEvent(new Event("change"));
  });
});

document.querySelectorAll(".mobile-navigation-links a").forEach((link) => {
  link.addEventListener("click", () => {
    link.closest(".mobile-navigation").open = false;
  });
});

renderQuestion();
renderJournal();
