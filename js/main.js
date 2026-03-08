const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const orbShells = document.querySelectorAll(".orb-shell");

const pointerState = {
  currentX: 0,
  currentY: 0,
  targetX: 0,
  targetY: 0
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersFinePointer = window.matchMedia("(pointer: fine)");

function updateHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function revealOnView() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerRef) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observerRef.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function updateOrbParallax() {
  pointerState.currentX += (pointerState.targetX - pointerState.currentX) * 0.08;
  pointerState.currentY += (pointerState.targetY - pointerState.currentY) * 0.08;

  orbShells.forEach((shell) => {
    const depth = Number(shell.dataset.depth || 0);
    const moveX = pointerState.currentX * depth;
    const moveY = pointerState.currentY * depth;
    shell.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });

  window.requestAnimationFrame(updateOrbParallax);
}

function handlePointerMove(event) {
  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;

  pointerState.targetX = (event.clientX - halfWidth) / halfWidth;
  pointerState.targetY = (event.clientY - halfHeight) / halfHeight;
}

function handlePointerLeave() {
  pointerState.targetX = 0;
  pointerState.targetY = 0;
}

function initMotion() {
  if (prefersReducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!prefersFinePointer.matches || !orbShells.length) {
    return;
  }

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerleave", handlePointerLeave);
  window.requestAnimationFrame(updateOrbParallax);
}

updateHeaderState();
revealOnView();
initMotion();

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", handlePointerLeave);
