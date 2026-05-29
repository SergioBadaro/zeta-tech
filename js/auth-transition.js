document.addEventListener("DOMContentLoaded", () => {
  const authShell = document.querySelector(".auth-shell");
  const pageMask = document.querySelector(".page-mask");
  const transitionLinks = Array.from(
    document.querySelectorAll(".register-link a"),
  );
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (authShell) {
    if (prefersReducedMotion) {
      authShell.classList.add("visible");
    } else {
      requestAnimationFrame(() => authShell.classList.add("visible"));
    }
  }

  function navigateWithAnimation(href) {
    if (!authShell || !pageMask) {
      window.location.href = href;
      return;
    }

    authShell.classList.add("exit");
    pageMask.classList.add("visible");
    setTimeout(() => {
      window.location.href = href;
    }, 420);
  }

  transitionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetHref = link.getAttribute("href");
      if (targetHref) {
        navigateWithAnimation(targetHref);
      }
    });
  });
});
