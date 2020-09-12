export const menuBurger = {
  findMenu() {
    return document.querySelector(`.menu`);
  },
  findMenuList() {
    return document.querySelector(`.menu__list`);
  },
  findBurger() {
    return document.querySelector(`.header__burger`);
  },
  findBody() {
    return document.querySelector(`body`);
  },
  init() {
    try {
      this.findBurger().addEventListener(`click`, () => {
        this.openMenu();
      });
    } catch (error) {
      if (error.message === `Cannot read property 'addEventListener' of null`) {
        console.log(`Не найдена кнопка открытия меню`);
      }
    }

  },
  onOutMenuClick(evt) {
    const target = evt.target;
    if (target !== menuBurger.findMenuList() && !target.closest(`.menu__list`)) {
      menuBurger.closeMenu();
    }
  },
  onEscClick(evt) {
    if (evt.key === `Escape`) {
      menuBurger.closeMenu();
    }
  },
  closeMenu() {
    this.findMenu().classList.remove(`menu--active`);
    document.removeEventListener(`keydown`, this.onEscClick);
    document.removeEventListener(`click`, this.onOutMenuClick);
    // body.classList.remove(`body--lock`);
    this.bodyUnlock();
  },
  openMenu() {
    this.findMenu().classList.add(`menu--active`);
    document.addEventListener(`keydown`, this.onEscClick);
    // body.classList.add(`body--lock`);
    this.bodyLock();

    setTimeout(() => {
      this.findMenu().addEventListener(`click`, this.onOutMenuClick);
    }, 100);

  },
  timeout: 800,
  findlockPaddings() {
    return document.querySelectorAll(`.lock-padding`);
  },
  unlock: true,
  bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector(`body`).offsetWidth + `px`;

    if (this.findlockPaddings().length > 0) {
      this.findlockPaddings().forEach((item) => {
        item.style.paddingRight = lockPaddingValue;
      });
    }

    this.findBody().style.paddingRight = lockPaddingValue;
    this.findBody().classList.add(`body--lock`);

    this.lockScroll();
  },
  bodyUnlock() {
    setTimeout(() => {
      if (this.findlockPaddings().length > 0) {
        this.findlockPaddings().forEach((item) => {
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
