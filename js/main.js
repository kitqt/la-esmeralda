/* =========================================================
   La Esmeralda — shared site behavior (every page)
   Header state, mobile menu, papel picado, scroll animations.
   ========================================================= */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero slideshow: crossfade through the photos every few seconds ---------- */
  const slideshow = document.querySelector("[data-slideshow]");
  if (slideshow && !reduceMotion) {
    const slides = [...slideshow.querySelectorAll("img")];
    let current = 0;
    if (slides.length > 1) {
      setInterval(() => {
        if (document.hidden) return;
        slides[current].classList.remove("is-active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("is-active");
      }, 6000);
    }
  }

  /* ---------- Header turns solid once the page scrolls ---------- */
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("site-menu");

  const setMenu = (open) => {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    window.matchMedia("(min-width: 921px)").addEventListener("change", (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Papel picado banners ---------- */
  // One cut-paper flag: scalloped bottom with holes punched out (evenodd)
  const FLAG =
    '<path fill="currentColor" fill-rule="evenodd" d="M0 0H60V56L55 62 50 56 45 62 40 56 35 62 30 56 25 62 20 56 15 62 10 56 5 62 0 56Z' +
    "M21 27a9 9 0 1 0 18 0a9 9 0 1 0-18 0Z M26 27a4 4 0 1 0 8 0a4 4 0 1 0-8 0Z" +
    "M11 8l4 6-4 6-4-6Z M49 8l4 6-4 6-4-6Z M11 34l4 6-4 6-4-6Z M49 34l4 6-4 6-4-6Z" +
    'M27 6h6v4h-6Z M27 44h6v4h-6Z M18 49h4v3h-4Z M38 49h4v3h-4Z"/>';
  const FLAG_COLORS = ["#c8372d", "#eaa53c", "#2f8a55", "#f3e9d2", "#e2683c", "#d94f8a"];

  document.querySelectorAll("[data-papel]").forEach((banner) => {
    const count = Number(banner.dataset.papel) || 14;
    banner.innerHTML = Array.from({ length: count }, (_, i) => {
      const color = FLAG_COLORS[i % FLAG_COLORS.length];
      const delay = ((i * 0.37) % 2.2).toFixed(2);
      return `<svg class="papel__flag" viewBox="0 0 60 64" style="color:${color};--d:-${delay}s" aria-hidden="true">${FLAG}</svg>`;
    }).join("");
  });

  /* ---------- Scroll-reveal ---------- */
  const revealables = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- Gentle parallax on elements marked [data-parallax] ---------- */
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  if (parallax.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      parallax.forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.25;
        el.style.setProperty("--py", `${(y * speed).toFixed(1)}px`);
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
