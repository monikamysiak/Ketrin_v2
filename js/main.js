const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const carousel = document.querySelector("[data-carousel]");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

if (carousel) {
  const track = carousel.querySelector("[data-carousel-track]");
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let step = 0;
  let isMoving = false;

  const measure = () => {
    const firstSlide = track.children[0];
    const rect = firstSlide.getBoundingClientRect();
    const styles = window.getComputedStyle(firstSlide);
    step = rect.width + parseFloat(styles.marginRight);
    track.classList.add("no-transition");
    track.style.transform = "translateX(0)";
    requestAnimationFrame(() => track.classList.remove("no-transition"));
  };

  const moveNext = () => {
    if (isMoving || !step) return;
    isMoving = true;
    track.style.transform = `translateX(${-step}px)`;
  };

  const movePrev = () => {
    if (isMoving || !step) return;
    isMoving = true;
    track.classList.add("no-transition");
    track.prepend(track.lastElementChild);
    track.style.transform = `translateX(${-step}px)`;
    track.offsetWidth;
    requestAnimationFrame(() => {
      track.classList.remove("no-transition");
      track.style.transform = "translateX(0)";
    });
  };

  next.addEventListener("click", moveNext);
  prev.addEventListener("click", movePrev);

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;
    if (!isMoving) return;

    if (track.style.transform !== "translateX(0px)" && track.style.transform !== "translateX(0)") {
      track.append(track.firstElementChild);
      track.classList.add("no-transition");
      track.style.transform = "translateX(0)";
      track.offsetWidth;
    }

    requestAnimationFrame(() => requestAnimationFrame(() => {
      track.classList.remove("no-transition");
      isMoving = false;
    }));
  });

  window.addEventListener("resize", measure, { passive: true });
  measure();
}
