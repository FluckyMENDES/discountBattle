import {modal} from './components/modal.js';
import {menuBurger} from './components/menu-burger.js';
import {lockPadding} from './components/lock-padding.js';
import {smoothScroll} from './components/smooth-scroll.js';
import AOS from 'aos';
import Parallax from 'parallax-js';
import Inputmask from "inputmask";


// Вешаем обработчики событий на все ссылки на модальные окна
modal.init();

// Вешаем обработчик события на кнопку меню
menuBurger.init();


// Плавная проркутка
smoothScroll.init();

// Animation on scroll плагин
AOS.init();

// Изменение цвета хедера в зависимости от скролла
(() => {
  const headerElement = document.querySelector(`.header `);

  window.addEventListener(`scroll`, () => {
    if (window.pageYOffset > 0) {
      headerElement.classList.add(`header--scroll`);
    } else {
      headerElement.classList.remove(`header--scroll`);
    }
  });

  // Добавляем белый фон для меню при загрузке сайте
  window.addEventListener(`DOMContentLoaded`, () => {
    if (window.pageYOffset > 0) {
      headerElement.classList.add(`header--scroll`);
    } else {
      headerElement.classList.remove(`header--scroll`);
    }
  });


})();


// Аккордеон
(() => {
  document.querySelectorAll(`.accordion__trigger`).forEach((element) => {
    element.addEventListener(`click`, () => {
      const parent = element.parentNode;
      parent.classList.toggle(`accordion__item--active`);

      // if (parent.classList.contains(`accordion__item--active`)) {
      //   parent.classList.remove(`accordion__item--active`);
      // } else {
      //   document.querySelectorAll(`.accordion__item`).forEach((element) => {
      //     element.classList.remove(`accordion__item--active`);
      //   });
      // }
    });
  });
})();

// Паралакс
(() => {

  // const layers = document.querySelectorAll(`.parallax__layer`);

  // document.addEventListener(`mousemove`, (evt) => {
  //   layers.forEach((element) => {
  //     const speed = element.getAttribute(`data-speed`);

  //     element.style.transform = `translate(${evt.clientX * speed / 1000 / 2}px, ${evt.clientY * speed / 1000 / 2}px)`;
  //   });
  // });
})();


// Parallax-js
const titleParallaxContainer = document.querySelector(`.title__parallax`);
const parallaxTitle = new Parallax(titleParallaxContainer);
const roadParallaxContainer = document.querySelector(`.road__parallax`);
const parallaxRoad = new Parallax(roadParallaxContainer);

// inputMask
const feedbackPhoneInputs = document.querySelectorAll(`.input--phone`);
for (let i = 0; i < feedbackPhoneInputs.length; i++) {
  const inputMaskFeedbackPhoneInput = new Inputmask(`+7 (999) 999-99-99`);
  inputMaskFeedbackPhoneInput.mask(feedbackPhoneInputs);
}


// Валидация форм
(() => {

  const formClass = `form`; // Класс формы
  const forms = document.querySelectorAll(`.${formClass}`); // Ищем все формы
  const validateClass = `input--validate`; // Класс полей которые необходимо валидировать
  const inputs = document.querySelectorAll(`.${validateClass}`); // Ищем все такие поля
  const thanksModal = document.querySelector(`.thanks`);

  // Регулярные выражения
  const regExpName = /^.{3,50}$/; // Для имени (от 3 до 50 любых символов)
  const regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i; // Для электронный почты
  const regExpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/; // Для телефона
  const regExpText = /^.{10,3000}$/; // Для текста (От 10 до 3000 символов)

  let isValidate = false; // Флаг валидности поля

  // Отправка данных формы
  const submitFormData = (formData, submitButton) => {
    let xhr = new XMLHttpRequest(); // Создаем новый запрос

    xhr.addEventListener(`loadend`, () => { // Вешаем обработчик на запрос
      if (xhr.readyState === 4 && xhr.status === 200) { // Если запрос успешно отправлен
        thanksModal.classList.add(`modal--active`); // Показываем модал благодарности
        submitButton.disabled = false; // Разблокируем кнопку отправки
      } else { // Иначе показываем ошибку
        console.log(`Ошибка ` + xhr.status);
      }
    });

    xhr.open(`POST`, `mail.php`, true); // Настройка запроса (Метод, адрес, асинхронность)
    xhr.send(formData); // Отправка запроса
  };

  // Объявление поля валидным
  const validInput = (input) => {
    input.nextElementSibling.textContent = ``; // Обнуляем текст подсказки
    input.classList.remove(`input--invalid`); // Удаляем невалидный класс
    input.classList.add(`input--valid`); // Добавляем валидный класс
    isValidate = true; // Ставим флаг валидации true
    console.log(isValidate);
  };

  // Объявление поля невалидным
  const invalidInput = (input) => {
    input.classList.remove(`input--valid`); // Удаляем валидный класс
    input.classList.add(`input--invalid`); // Добавляем невалидный класс
    isValidate = false; // Ставим флаг валидации false
    console.log(isValidate);

  };

  // Очистка поля ввода
  const clearInput = (input) => {
    input.classList.remove(`input--valid`); // Удаляем валидный класс
    input.classList.remove(`input--invalid`); // Подавляем невалидный класс
    input.nextElementSibling.textContent = ``; // Обнуляем текст подсказки
    input.value = ``; // Обнуляем значение поля
  };

  const regExpChecking = (regExp, tooltipMessage, input) => {
    if (input.value === ``) { // Если значение поля пустое
      clearInput(input); // Очищаем поле
    } else if (!regExp.test(input.value) && input.value !== ``) { // Если значение поля не проходит проверку на соотв. регулярное выражение
      input.nextElementSibling.textContent = tooltipMessage; // Добавляем текст подсказки
      invalidInput(input); // Признаем поле невалидным
    } else { // Если значение поля проходит проверку
      validInput(input); // Признаем поле валидным
    }
  };

  // Валидация инпута
  const validateElem = (input) => {
    switch (input.name) { // Если значение аттрибута name поля
      case `name`: // 'name'
        regExpChecking(regExpName, `Введите имя от 3 до 50 символов`, input);
        break;

      case `email`: // 'email'
        regExpChecking(regExpEmail, `Введите адрес электронной почты в формате nickname@email.com`, input);

        break;

      case `phone`: // 'phone'
        regExpChecking(regExpPhone, `Введите номер телефона в формате +7 (999) 123-45-67`, input);
        break;

      // Текст
      case `text`:
        regExpChecking(regExpText, `Минимальное количество символов - 10, максимальное - 30`, input);
        break;

      default:
        break;
    }
  };

  for (let input of inputs) {
    if (input.classList.contains(validateClass)) { // Если поле ввода содержит класс для проверки валидности
      input.addEventListener(`blur`, () => { // Вешаем на поле обрабочик события blur
        validateElem(input); // Проверка поля на валидность
      });
    }
  }

  forms.forEach((form) => { // Вешаем обработчик события на отправку каждой формы
    const submitButton = form.querySelector(`button[type="submit"]`); // Находим кнопку отправки формы

    form.addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formInputs = form.querySelectorAll(`.${validateClass}`); // Определяем все инпуты внутри формы которые необходимо проверить
      for (let input of formInputs) { // Проходимся по всем таким инпутам
        if (input.value === ``) { // Если поле пустое
          input.nextElementSibling.textContent = `Необходимо заполнить поле!`; // Выводим подсказку
          invalidInput(input);
        } else { // Если поле заполнено
          // input.nextElementSibling.textContent = ``; // Убираем предыдущую подсказку
        }
      }

      if (isValidate) { // Если все поля прошли валидность
        let formData = new FormData(); // Собираем данные формы в новую formData
        for (let elem of form.elements) { // Проходимся по всем инпутам формы
          if (elem.tagName !== `BUTTON`) { // Кроме кнопок
            formData.append(elem.name, elem.value); // Добавляем данные поля в formData
            clearInput(elem); // Очищаем поле
          }
        }
        submitButton.disabled = true; // Блокируем кнопку отправки
        submitFormData(formData, submitButton); // Отправляем formData
      }
    });

  });


})();

// Добавляем класс при определенной ширине экрана
// const willFixedElement = document.querySelector(`.header`);
// lockPadding.add(willFixedElement, 768);
