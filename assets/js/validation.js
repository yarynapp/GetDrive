(function () {
  "use strict";

  const form = document.getElementById("feedbackForm");
  const modal = document.getElementById("successModal");
  const closeButton = document.getElementById("closeModal");

  if (!form || !modal || !closeButton) return;

  const fields = {
    username: {
      input: document.getElementById("username"),
      error: document.getElementById("usernameError"),
      interacted: false
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      interacted: false
    },
    phone: {
      input: document.getElementById("phone"),
      error: document.getElementById("phoneError"),
      interacted: false
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
      interacted: false
    },
    agreement: {
      input: document.getElementById("agreement"),
      error: document.getElementById("agreementError"),
      interacted: false
    }
  };

  let previousFocus = null;

  // Показує помилку поля та додає червону рамку.
  function showError(input, message) {
    const field = fields[input.id];
    if (!field) return;

    input.classList.remove("border-green-500");
    input.classList.add("border-red-500");
    field.error.textContent = message;
    field.error.classList.remove("hidden");
    input.setAttribute("aria-invalid", "true");
  }

  // Прибирає помилку поля та його кольорові рамки.
  function clearError(input) {
    const field = fields[input.id];
    if (!field) return;

    input.classList.remove("border-red-500", "border-green-500");
    field.error.textContent = "";
    field.error.classList.add("hidden");
    input.setAttribute("aria-invalid", "false");
  }

  // Показує коректний стан поля із зеленою рамкою.
  function showSuccess(input) {
    const field = fields[input.id];
    if (!field) return;

    input.classList.remove("border-red-500");
    input.classList.add("border-green-500");
    field.error.textContent = "";
    field.error.classList.add("hidden");
    input.setAttribute("aria-invalid", "false");
  }

  // Перевіряє ім’я на порожне значення та мінімальну довжину.
  function validateName() {
    const input = fields.username.input;
    const value = input.value.trim();

    if (!value) {
      showError(input, "Введіть ім’я.");
      return false;
    }
    if (value.length < 2) {
      showError(input, "Ім’я має містити мінімум 2 символи.");
      return false;
    }

    showSuccess(input);
    return true;
  }

  // Перевіряє формат електронної пошти через регулярний вираз.
  function validateEmail() {
    const input = fields.email.input;
    const value = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!value) {
      showError(input, "Введіть електронну пошту.");
      return false;
    }
    if (!emailPattern.test(value)) {
      showError(input, "Введіть коректний формат email.");
      return false;
    }

    showSuccess(input);
    return true;
  }

  // Перевіряє строго український формат номера без пробілів і роздільників.
  function validatePhone() {
    const input = fields.phone.input;
    const value = input.value;
    const phonePattern = /^\+380\d{9}$/;

    if (!value) {
      showError(input, "Введіть номер телефону.");
      return false;
    }
    if (!phonePattern.test(value)) {
      showError(input, "Введіть номер строго у форматі +380XXXXXXXXX, без пробілів і знаків.");
      return false;
    }

    showSuccess(input);
    return true;
  }

  // Перевіряє повідомлення на порожне значення та мінімальну довжину.
  function validateMessage() {
    const input = fields.message.input;
    const value = input.value.trim();

    if (!value) {
      showError(input, "Введіть повідомлення.");
      return false;
    }
    if (value.length < 10) {
      showError(input, "Повідомлення має містити мінімум 10 символів.");
      return false;
    }

    showSuccess(input);
    return true;
  }

  // Перевіряє обов’язкову згоду користувача.
  function validateAgreement() {
    const input = fields.agreement.input;

    if (!input.checked) {
      showError(input, "Потрібно погодитися з політикою конфіденційності.");
      return false;
    }

    showSuccess(input);
    return true;
  }

  const validators = {
    username: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage,
    agreement: validateAgreement
  };

  Object.keys(fields).forEach(function (name) {
    const field = fields[name];

    // Після першої взаємодії input/change оновлюють стан динамічно.
    field.input.addEventListener("input", function () {
      field.interacted = true;
      validators[name]();
    });

    if (field.input.type === "checkbox") {
      field.input.addEventListener("change", function () {
        field.interacted = true;
        validators[name]();
      });
    } else {
      // Втрата фокусу запускає фінальну перевірку поля.
      field.input.addEventListener("blur", function () {
        field.interacted = true;
        validators[name]();
      });
    }
  });

  // Очищає кольори та помилки всіх полів після успішної відправки.
  function clearAllStates() {
    Object.keys(fields).forEach(function (name) {
      clearError(fields[name].input);
      fields[name].interacted = false;
    });
  }

  // Відкриває модальне вікно та переводить фокус на кнопку “Закрити”.
  function openModal() {
    previousFocus = document.activeElement;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    closeButton.focus();
  }

  // Закриває модальне вікно та повертає попередній фокус.
  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    if (previousFocus) previousFocus.focus();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const order = ["username", "email", "phone", "message", "agreement"];
    let firstInvalidInput = null;

    order.forEach(function (name) {
      fields[name].interacted = true;
      const valid = validators[name]();
      if (!valid && !firstInvalidInput) firstInvalidInput = fields[name].input;
    });

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      return;
    }

    form.reset();
    clearAllStates();
    openModal();
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
      return;
    }

    // Єдина доступна кнопка модалки утримує Tab-фокус усередині діалога.
    if (event.key === "Tab" && !modal.classList.contains("hidden")) {
      event.preventDefault();
      closeButton.focus();
    }
  });
})();
