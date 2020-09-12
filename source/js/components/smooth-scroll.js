// const anchors = document.querySelectorAll(`a[href*="#"]`);

// for (let anchor of anchors) {
//   anchor.addEventListener(`click`, function (e) {
//     e.preventDefault();

//     const blockID = anchor.getAttribute(`href`).substr(1);

//     document.getElementById(blockID).scrollIntoView({
//       behavior: `smooth`,
//       block: `start`
//     });
//   });
// }

export const smoothScroll = {
  findAnchors() {
    return document.querySelectorAll(`a[href*="#"]`);
  },
  init() {
    if (this.findAnchors().length > 0) {
      this.findAnchors().forEach((anchor) => {
        anchor.addEventListener(`click`, function (e) {
          e.preventDefault();

          const blockID = anchor.getAttribute(`href`).substr(1);

          document.getElementById(blockID).scrollIntoView({
            behavior: `smooth`,
            block: `start`
          });
        });
      });

    }
  }

};
