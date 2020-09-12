// Для добавления модала необходимо:
// 1. Разместить ссылку <a> с классом "modal-link" с атрибутом href="", и значением #id.
// 2. Резместить блок модала с классом "modal" и указать id - идентичным указанного в ссылке.


export const modal = {
  modalClass: `.modal-link`,
  lockPaddingClass: `.lock-padding`,
  unlock: true,
  timeout: 800,
  findLinks() {
    return document.querySelectorAll(this.modalClass);
  },
  findCloseBtns() {
    return document.querySelectorAll(`.modal-close`);
  },
  findLockPaddings() {
    return document.querySelectorAll(this.lockPaddingClass);
  },
  findBody() {
    return document.querySelector(`body`);
  },
  init() {
    if (this.findLinks().length > 0) {
      this.findLinks().forEach((link) => {
        link.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          const modalName = link.getAttribute(`href`);
          const currentModal = document.querySelector(modalName);
          this.open(currentModal);
        });
      });
    }

    if (this.findCloseBtns().length > 0) {
      this.findCloseBtns().forEach((button) => {
        button.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          this.close(button.closest(`.modal`));
        });
      });
    }
  },
  open(currentModal) {
    if (currentModal && this.unlock) {
      const modalActive = document.querySelector(`.modal--active`);
      if (modalActive) {
        this.close(modalActive, false);
      } else {
        this.bodyLock();
      }
      this.show(currentModal);
      currentModal.addEventListener(`click`, (evt) => {
        if (!evt.target.closest(`.modal__content`)) {
          this.close(evt.target.closest(`.modal`));
        }
      });
    }
  },
  close(modalActive, doUnlock = true) {
    if (this.unlock) {
      this.hide(modalActive);

      if (doUnlock) {
        this.bodyUnlock();
      }
    }
  },
  show(currentModal) {
    currentModal.classList.add(`modal--active`);
    document.addEventListener(`keyup`, this.onEscCloseModal);
  },

  hide(modalActive) {
    modalActive.classList.remove(`modal--active`);
    document.removeEventListener(`keyup`, this.onEscCloseModal);
  },
  onEscCloseModal(evt) {
    const modalActive = document.querySelector(`.modal--active`);
    if (evt.key === `Escape`) {
      modal.close(modalActive);
    }
  },
  bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector(`body`).offsetWidth + `px`;

    if (this.findLockPaddings().length > 0) {
      this.findLockPaddings().forEach((item) => {
        item.style.paddingRight = lockPaddingValue;
      });
    }

    this.findBody().style.paddingRight = lockPaddingValue;
    this.findBody().classList.add(`body--lock`);

    this.lockScroll();
  },
  bodyUnlock() {
    setTimeout(() => {
      if (this.findLockPaddings().length > 0) {
        this.findLockPaddings().forEach((item) => {
          item.style.paddingRight = `0px`;
        });
      }

      this.findBody().style.paddingRight = `0px`;
      this.findBody().classList.remove(`body--lock`);
    }, this.timeout);
  },
  lockScroll() {
    this.unlock = false;
    setTimeout(() => {
      this.unlock = true;
    }, this.timeout);
  },
};
