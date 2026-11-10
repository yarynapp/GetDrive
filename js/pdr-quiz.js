(function () {
const pdrQuestions = [
  {
    question: "Що вимагає знак 2.1 «Дати дорогу» перед перехрестям?",
    options: [
      "Дати дорогу транспортним засобам, які рухаються головною дорогою",
      "Обов’язково зупинитися перед знаком у будь-якому разі",
      "Продовжити рух першим, якщо ви повертаєте праворуч",
    ],
    correct: 0,
    explanation: "Знак 2.1 зобов’язує водія дати дорогу транспортним засобам, що наближаються головною дорогою. Зупинка потрібна, якщо без неї неможливо виконати цю вимогу.",
  },
  {
    question: "Де потрібно зупинитися перед знаком 2.2 «Проїзд без зупинки заборонено», якщо перед перехрестям є стоп-лінія?",
    options: [
      "Перед стоп-лінією",
      "Після перехрестя",
      "Безпосередньо поруч зі знаком, незалежно від стоп-лінії",
    ],
    correct: 0,
    explanation: "Перед знаком 2.2 потрібно обов’язково зупинитися перед стоп-лінією, а якщо її немає — перед знаком.",
  },
  {
    question: "На нерегульованому перехресті рівнозначних доріг інший автомобіль наближається до вас справа. Як діяти?",
    options: [
      "Дати дорогу автомобілю справа",
      "Проїхати першим, якщо ваша швидкість вища",
      "Подати звуковий сигнал і продовжити рух",
    ],
    correct: 0,
    explanation: "На перехресті рівнозначних доріг діє правило перешкоди справа: водій повинен дати дорогу транспортному засобу, що наближається справа.",
  },
  {
    question: "Ви повертаєте ліворуч на дозволений зелений сигнал, а зустрічний автомобіль рухається прямо. Кому потрібно дати дорогу?",
    options: [
      "Зустрічному автомобілю",
      "Нікому — зелений сигнал дає перевагу всім, хто повертає",
      "Автомобілю позаду, який подав звуковий сигнал",
    ],
    correct: 0,
    explanation: "Під час повороту ліворуч на зелений сигнал потрібно дати дорогу зустрічним транспортним засобам, що рухаються прямо або повертають праворуч.",
  },
  {
    question: "Що означає суцільна лінія дорожньої розмітки 1.1 між смугами руху?",
    options: [
      "Перетинати її для перестроювання заборонено",
      "Її можна перетинати, якщо ввімкнено покажчик повороту",
      "Вона позначає місце обов’язкової зупинки",
    ],
    correct: 0,
    explanation: "Розмітку 1.1 перетинати заборонено. Покажчик повороту не скасовує вимог дорожньої розмітки.",
  },
  {
    question: "Пішохід уже перебуває на нерегульованому пішохідному переході перед вашим автомобілем. Як діяти?",
    options: [
      "Дати пішоходу дорогу, за потреби зупинившись",
      "Подати звуковий сигнал і проїхати перед ним",
      "Об’їхати пішохода по зустрічній смузі",
    ],
    correct: 0,
    explanation: "Перед нерегульованим переходом водій повинен зменшити швидкість, а за потреби зупинитися, щоб дати дорогу пішоходу.",
  },
  {
    question: "Під час практичного іспиту екзаменатор просить виконати маневр, але це вимагало б перетнути суцільну лінію. Що робити?",
    options: [
      "Не виконувати маневр у спосіб, що порушує ПДР; продовжити безпечно й уточнити подальшу вказівку",
      "Виконати маневр, бо вказівка екзаменатора важливіша за розмітку",
      "Різко зупинитися посеред смуги руху",
    ],
    correct: 0,
    explanation: "Під час іспиту потрібно виконувати вказівки екзаменатора лише за умови дотримання ПДР і безпеки. Суцільну лінію перетинати заборонено.",
  },
];

const quiz = document.querySelector("#knowledge-quiz");
const questionElement = document.querySelector("#pdr-question");
const optionsElement = document.querySelector("#pdr-options");
const feedbackElement = document.querySelector("#pdr-feedback");
const progressLabel = document.querySelector("#pdr-progress-label");
const scoreLabel = document.querySelector("#pdr-score-label");
const progressBar = document.querySelector("#pdr-progress");
const progressFill = document.querySelector("#pdr-progress-fill");
const questionPanel = document.querySelector("#pdr-question-panel");
const resultElement = document.querySelector("#pdr-result");
const checkButton = document.querySelector("#pdr-check");
const nextButton = document.querySelector("#pdr-next");
const restartButton = document.querySelector("#pdr-restart");

let currentQuestion = 0;
let correctAnswers = 0;
let answerChecked = false;

function updateProgress() {
  progressLabel.textContent = `Запитання ${currentQuestion + 1} із ${pdrQuestions.length}`;
  scoreLabel.textContent = `Правильних відповідей: ${correctAnswers}`;
  progressBar.setAttribute("aria-valuenow", String(currentQuestion + 1));
  progressFill.style.width = `${((currentQuestion + 1) / pdrQuestions.length) * 100}%`;
}

function renderQuestion() {
  const item = pdrQuestions[currentQuestion];
  questionElement.textContent = item.question;
  optionsElement.replaceChildren();
  feedbackElement.textContent = "";
  feedbackElement.className = "pdr-feedback";
  answerChecked = false;
  checkButton.hidden = false;
  nextButton.hidden = true;
  resultElement.hidden = true;
  questionPanel.hidden = false;
  updateProgress();

  item.options.forEach((option, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = "pdr-answer";
    input.value = String(index);
    input.id = `pdr-answer-${index}`;
    label.className = "pdr-option";
    label.htmlFor = input.id;
    label.append(input, document.createTextNode(option));
    optionsElement.append(label);
  });

  questionPanel.classList.remove("is-changing");
  void questionPanel.offsetWidth;
  questionPanel.classList.add("is-changing");
}

function showResult() {
  questionPanel.hidden = true;
  checkButton.hidden = true;
  nextButton.hidden = true;
  restartButton.hidden = false;
  progressLabel.textContent = `Тест завершено · ${pdrQuestions.length} запитань`;
  progressBar.setAttribute("aria-valuenow", String(pdrQuestions.length));
  progressFill.style.width = "100%";
  scoreLabel.textContent = `Правильних відповідей: ${correctAnswers}`;
  resultElement.className = `pdr-result ${correctAnswers >= 5 ? "is-passing" : "is-review"}`;
  resultElement.textContent = `Ваш результат: ${correctAnswers} із ${pdrQuestions.length}. ${
    correctAnswers >= 5
      ? "Добре! Перегляньте пояснення до відповідей і продовжуйте підготовку."
      : "Перегляньте пояснення та спробуйте ще раз."
  }`;
  resultElement.hidden = false;
}

optionsElement.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLInputElement) || answerChecked) return;

  optionsElement.querySelectorAll(".pdr-option").forEach((label) => {
    label.classList.toggle("is-selected", label.contains(event.target));
  });
  feedbackElement.textContent = "";
  feedbackElement.className = "pdr-feedback";
});

checkButton.addEventListener("click", () => {
  const selected = optionsElement.querySelector('input[name="pdr-answer"]:checked');
  if (!selected) {
    feedbackElement.textContent = "Оберіть один варіант відповіді.";
    feedbackElement.classList.add("is-prompt");
    return;
  }

  const item = pdrQuestions[currentQuestion];
  const isCorrect = Number(selected.value) === item.correct;
  answerChecked = true;
  correctAnswers += Number(isCorrect);
  optionsElement.querySelectorAll('input[name="pdr-answer"]').forEach((input) => {
    input.disabled = true;
  });
  feedbackElement.textContent = `${isCorrect ? "Правильно. " : "Неправильно. "}${item.explanation}`;
  feedbackElement.classList.add(isCorrect ? "is-correct" : "is-incorrect");
  scoreLabel.textContent = `Правильних відповідей: ${correctAnswers}`;
  checkButton.hidden = true;
  nextButton.hidden = false;
  nextButton.textContent = currentQuestion === pdrQuestions.length - 1
    ? "Показати результат"
    : "Наступне запитання";
});

nextButton.addEventListener("click", () => {
  if (currentQuestion === pdrQuestions.length - 1) {
    showResult();
    return;
  }

  currentQuestion += 1;
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  correctAnswers = 0;
  restartButton.hidden = true;
  renderQuestion();
});

renderQuestion();
})();
