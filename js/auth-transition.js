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

  function initVisualBlobs() {
    if (!authShell) return;
    const visual = authShell.querySelector('.auth-visual');
    if (!visual) return;

    const blobs = [
      { top: '8%', left: '10%', size: 160, color: 'rgba(137, 82, 255, 0.35)', duration: 8.4, delay: 0 },
      { top: '20%', left: '68%', size: 120, color: 'rgba(95, 184, 255, 0.28)', duration: 9.2, delay: 0.8 },
      { top: '58%', left: '16%', size: 100, color: 'rgba(255, 123, 217, 0.2)', duration: 7.6, delay: 0.4 },
      { top: '44%', left: '72%', size: 180, color: 'rgba(113, 61, 255, 0.22)', duration: 10.1, delay: 0.2 },
    ];

    blobs.forEach((blobDef) => {
      const blob = document.createElement('span');
      blob.className = 'visual-blob';
      blob.style.width = `${blobDef.size}px`;
      blob.style.height = `${blobDef.size}px`;
      blob.style.top = blobDef.top;
      blob.style.left = blobDef.left;
      blob.style.background = blobDef.color;
      blob.style.animationDuration = `${blobDef.duration}s`;
      blob.style.animationDelay = `${blobDef.delay}s`;
      visual.appendChild(blob);
    });

    visual.addEventListener('mousemove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 24;
      const y = (event.clientY / window.innerHeight - 0.5) * 24;
      visual.style.setProperty('--visual-move-x', `${x}px`);
      visual.style.setProperty('--visual-move-y', `${y}px`);
    });
  }

  initVisualBlobs();
});
