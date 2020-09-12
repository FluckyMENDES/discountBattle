export const lockPadding = {
  class: `lock-padding`,
  add(element, lessThanWindowWidthValue) {
    window.addEventListener(`resize`, (evt) => {
      const width = evt.target.innerWidth;
      if (width < lessThanWindowWidthValue) {
        element.classList.add(this.class);
      } else {
        element.classList.remove(this.class);
      }
    });
  },
};
