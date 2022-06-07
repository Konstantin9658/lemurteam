import {Swiper, Pagination, Autoplay} from 'swiper';
import Inputmask from "inputmask";

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const main = body.querySelector('.main');
  const header = body.querySelector('.header');
  const burgerMenu = header.querySelector('.button--burger');
  const menu = header.querySelector('.nav__list');
  const menuItems = menu.querySelectorAll('.nav__item');
  const popup = body.querySelector('.popup');
  const form = popup.querySelector('.form');
  const inputName = form.querySelector('#name-field');
  const inputEmail = form.querySelector('#email-field');
  const inputPhone = form.querySelector('#phone-field');
  const validateElements = form.querySelectorAll('[data-validate]');
  const btnSumbit = form.querySelector('.button--submit');
  const btnsOpenModal = body.querySelectorAll('[data-modal]');
  const btnCloseModal = popup.querySelector('[data-close]');

  // const noJsElements = document.querySelectorAll('[data-nojs]');

  const KEYCODE_TAB = 9;

  const trapFocus = (element) => {
    let focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    let firstFocusableEl = focusableEls[0];
    let lastFocusableEl = focusableEls[focusableEls.length - 1];

    element.addEventListener('keydown', function(e) {
      let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

      if (!isTabPressed) {
        return;
      }

      if ( e.shiftKey ) /* shift + tab */ {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
            e.preventDefault();
          }
        } else /* tab */ {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
            e.preventDefault();
          }
        }
    });
  };

  // btnSumbit.disabled = true;

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

  const showOrHideMenu = () => {
    if (window.innerWidth < 1024) {
      menu.classList.toggle('nav__list--show');
      body.classList.toggle('page__body--hidden');
      trapFocus(menu);

      if (burgerMenu.classList.contains('button--burger')) {
        burgerMenu.classList.add('button--close');
        burgerMenu.classList.remove('button--burger');
      } else {
        burgerMenu.classList.remove('button--close');
        burgerMenu.classList.add('button--burger');
      }
    }
  };

  const closeModal = () => {
    if (popup.classList.contains('show')) {
      toggler();
      form.reset();
    }
  };

  const checkValue = (input, classError) => {
    if (input.value === '') {
      input.parentElement.classList.add(classError);
      input.focus();
    } else {
      input.parentElement.classList.remove(classError);
    }
  };

  // btnSumbit.addEventListener('click', (e) => {

  //   if (checkValue(inputName, 'form__fields-item--error') || checkValue(inputEmail, 'form__fields-item--error') || checkValue(inputPhone, 'form__fields-item--error')) {

  //     console.log('error');
  //   } else {
  //     e.preventDefault();
  //     console.log('ok');
  //   }
  // });

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
    freeModeMomentum: false,
    breakpoints: {
      320: {
        spaceBetween: 20,
      }
    }
  };

  const validateInput = (element, example) => {
    const inputPhoneMask = new Inputmask(`${example}`);
    inputPhoneMask.mask(element);
  };

  // form.addEventListener('input', () => {
  //   validateElements.forEach(element => {
  //     if (element.value === '') {
  //       element.style.border = '1px solid red';
  //       errorMsg.classList.add('show');
  //     } else {
  //       element.style.border = '';
  //     }
  //   });

  //   if (validateElements.every(checkValue)) {
  //     btnSumbit.disabled = false;
  //   } else {
  //     btnSumbit.disabled = true;
  //   }
  // });

  const showMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
      <p>${message}</p>
    `;

    body.append(div);
    // btnSumbit.disabled = true;
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

  validateElements.forEach(element => {
    element.addEventListener('input', () => {
      checkValue(element, 'form__fields-item--error');
    });
  });

  const postData = (e) => {
    e.preventDefault();

    if (inputName.value === '') {
      inputName.parentElement.classList.add('form__fields-item--error');
      inputName.focus();
      return;
    } if (inputPhone.value === '') {
      inputPhone.parentElement.classList.add('form__fields-item--error');
      inputPhone.focus();
      return;
    } if (inputEmail.value === '') {
      inputEmail.parentElement.classList.add('form__fields-item--error');
      inputEmail.focus();
      return;
    } else {
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
    }
  };

  form.addEventListener('submit', postData);
  validateInput(inputPhone, '+7 (999) 999-99-99');
  new Swiper('.swiper', swiperOptions);
  btnCloseModal.addEventListener('click', closeModal);
  btnsOpenModal.forEach(btn => btn.addEventListener('click', toggler));
  burgerMenu.addEventListener('click', showOrHideMenu);
  menuItems.forEach(item => item.addEventListener('click', showOrHideMenu));
});
