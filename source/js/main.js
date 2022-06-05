import {Swiper, Pagination, Autoplay} from 'swiper';
import Inputmask from "inputmask";

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const main = document.querySelector('.main');
  const header = document.querySelector('.header');
  const inputName = document.querySelector('#name-field');
  const inputEmail = document.querySelector('#email-field');
  const inputPhone = document.querySelector('#phone-field');
  const btnsOpenModal = document.querySelectorAll('[data-modal]');
  const btnCloseModal = document.querySelector('[data-close]');
  const popup = document.querySelector('.popup');
  const form = document.querySelector('.form');
  const validateElements = Array.from(document.querySelectorAll('[data-validate]'));
  const btnSumbit = document.querySelector('.button--submit');

  btnSumbit.disabled = true;

  const message = {
    success: 'Спасибо! Менеджер с Вами скоро свяжется',
    failure: 'Упс... Что-то пошло не так... Попробуйте повторить'
  };

  const toggler = () => {
    popup.classList.toggle('show');
    main.classList.toggle('blur');
    header.classList.toggle('blur');
    body.classList.toggle('page__body--hidden');
  };

  const closeModal = () => {
    if (popup.classList.contains('show')) {
      toggler();
    }
  };

  const checkValue = input => input.value !== '';

  const swiperOptions = {
    modules: [Pagination, Autoplay],
    pagination: {
      el: '.feedback__pagination',
      bulletActiveClass: 'feedback__bullet--active',
      clickable: true,
      type: 'bullets',
      renderBullet: function (index, className) {
        return `<span class="${className} feedback__bullet" id="${index}"></span>`;
      },
    },
    spaceBetween: 50,
    effect: 'fade',
    loop: true,
    grabCursor: true,
    slidesPerView: 'auto',
    loopedSlides: 4,
    centeredSlides: true,
    centeredSlidesBounds: true,
    slideActiveClass: 'feedback__item--active',
    freeMode: true,
    speed: 5000,
    freeModeMomentum: false
  };

  const validateInput = (element, example) => {
    const inputPhoneMask = new Inputmask(`${example}`);
    inputPhoneMask.mask(element);
  };

  form.addEventListener('input', () => {
    validateElements.forEach(element => {
      if (element.value === '') {
        element.style.border = '1px solid red';
      } else {
        element.style.border = '';
      }
    });

    if (validateElements.every(checkValue)) {
      btnSumbit.disabled = false;
    } else {
      btnSumbit.disabled = true;
    }
  });

  const showMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
      <p>${message}</p>
    `;

    body.append(div);
    btnSumbit.disabled = true;
    main.classList.toggle('blur');
    header.classList.toggle('blur');

    setTimeout(() => {
      div.remove();
      main.classList.toggle('blur');
      header.classList.toggle('blur');
    }, 3000);
  };

  const sendForm = async () => {

    const result = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        user: inputName.value,
        phone: inputPhone.value,
        email: inputEmail.value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    return await result.json();
  };

  const postData = (e) => {
    e.preventDefault();

    sendForm()
    .then((res) => {
      showMessage(message.success);
      console.log(res);
    })
    .catch(() => {
      showMessage(message.failure);
    })
    .finally(() => {
      closeModal();
      form.reset();
    });
  };

  form.addEventListener('submit', postData);
  validateInput(inputPhone, '+7 (999) 999-99-99');
  new Swiper('.swiper', swiperOptions);
  btnCloseModal.addEventListener('click', closeModal);
  btnsOpenModal.forEach(btn => btn.addEventListener('click', toggler));
});
