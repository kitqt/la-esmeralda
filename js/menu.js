/* =========================================================
   La Esmeralda — menu page
   Builds the menu from menu-data.js, then wires up the
   dropdowns, section tabs, "expand all" and the board lightbox.
   ========================================================= */

(() => {
  const root = document.getElementById("menu-root");
  if (!root || !window.MENU) return;

  const slug = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const CHEVRON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- Templates ---------- */
  // long lists (like the 11 basic choices) split into two columns
  const priceList = (rows) =>
    `<ul class="price-list${rows.length >= 8 ? " price-list--split" : ""}">${rows
      .map((r) => `<li><span>${esc(r.name)}</span><span class="leader" aria-hidden="true"></span><b>${esc(r.price)}</b></li>`)
      .join("")}</ul>`;

  const renderGroup = (g) => {
    let body;
    if (g.items.some((i) => i.price)) body = priceList(g.items);
    else if (g.items.some((i) => i.note))
      body = `<ul class="opt-described">${g.items
        .map((i) => `<li><strong>${esc(i.name)}</strong>${i.note ? `<span>${esc(i.note)}</span>` : ""}</li>`)
        .join("")}</ul>`;
    else body = `<ul class="opt-chips">${g.items.map((i) => `<li>${esc(i.name)}</li>`).join("")}</ul>`;

    return `<div class="opt-group">
      <h4 class="opt-group__title">${esc(g.title)}</h4>
      ${body}
      ${g.note ? `<p class="opt-group__note">${esc(g.note)}</p>` : ""}
    </div>`;
  };

  const renderDish = (item, index) => {
    const id = `item-${slug(item.name)}`;
    const panelId = `${id}-options`;
    const dropdown = item.options?.length
      ? `<button class="dish__toggle" type="button" aria-expanded="false" aria-controls="${panelId}">
           <span>${esc(item.toggleLabel || "Choices & add-ons")}</span>${CHEVRON}
         </button>
         <div class="dish__panel" id="${panelId}">
           <div class="dish__panel-inner">${item.options.map(renderGroup).join("")}</div>
         </div>`
      : "";

    return `<article class="dish reveal" id="${id}" style="--i:${index % 3}">
      <div class="dish__media">
        <img src="${esc(item.image)}" alt="${esc(item.name)}" width="800" height="600" loading="lazy" />
        ${item.badge ? `<span class="dish__badge">${esc(item.badge)}</span>` : ""}
        <span class="dish__price">${esc(item.price)}</span>
      </div>
      <div class="dish__body">
        <h3 class="dish__name">${esc(item.name)}</h3>
        <p class="dish__desc">${esc(item.description)}</p>
        ${item.note ? `<p class="dish__note">${esc(item.note)}</p>` : ""}
        ${item.prices ? priceList(item.prices) : ""}
        ${dropdown}
      </div>
    </article>`;
  };

  const renderSection = (section) => `
    <section class="menu-section" id="${section.id}" aria-labelledby="${section.id}-title">
      <header class="menu-section__head reveal">
        <span class="script">${esc(section.kicker)}</span>
        <h2 class="menu-section__title" id="${section.id}-title">${esc(section.title)}</h2>
        ${section.note ? `<p class="menu-section__note">${esc(section.note)}</p>` : ""}
      </header>
      <div class="menu-grid">${section.items.map(renderDish).join("")}</div>
    </section>`;

  root.innerHTML = window.MENU.map(renderSection).join("");

  /* ---------- Dropdowns ---------- */
  const setOpen = (dish, open) => {
    const btn = dish.querySelector(".dish__toggle");
    if (!btn) return;
    btn.setAttribute("aria-expanded", String(open));
    dish.classList.toggle("is-open", open);
  };

  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".dish__toggle");
    if (!btn) return;
    setOpen(btn.closest(".dish"), btn.getAttribute("aria-expanded") !== "true");
    syncExpandAll();
  });

  const expandAll = document.querySelector("[data-expand-all]");
  const toggles = () => [...root.querySelectorAll(".dish__toggle")];

  function syncExpandAll() {
    if (!expandAll) return;
    const allOpen = toggles().every((b) => b.getAttribute("aria-expanded") === "true");
    expandAll.setAttribute("aria-pressed", String(allOpen));
    expandAll.querySelector("span").textContent = allOpen ? "Collapse all" : "Expand all";
  }

  expandAll?.addEventListener("click", () => {
    const open = expandAll.getAttribute("aria-pressed") !== "true";
    root.querySelectorAll(".dish").forEach((dish) => setOpen(dish, open));
    syncExpandAll();
  });

  /* ---------- Section tabs follow the scroll ---------- */
  const tabs = [...document.querySelectorAll(".menu-tabs a")];
  const setActiveTab = (id) => {
    tabs.forEach((tab) => {
      const active = tab.getAttribute("href") === `#${id}`;
      tab.classList.toggle("is-active", active);
      if (active) {
        tab.setAttribute("aria-current", "true");
        // keep the active tab visible on narrow screens without moving the page
        const bar = tab.parentElement;
        bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
      } else {
        tab.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    root.querySelectorAll(".menu-section").forEach((s) => spy.observe(s));
  }

  /* ---------- Deep links like menu.html#item-torta ---------- */
  // the items only exist once rendered, so the browser can't jump to them on its own
  const focusHash = (behavior) => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (!target) return;
    if (target.classList.contains("dish")) {
      setOpen(target, true);
      target.classList.add("is-visible", "is-highlight");
      setTimeout(() => target.classList.remove("is-highlight"), 2600);
    }
    target.scrollIntoView({ block: "start", behavior });
  };
  focusHash("instant");
  window.addEventListener("hashchange", () => focusHash("smooth"));

  /* ---------- Menu board lightbox ---------- */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox && typeof lightbox.showModal === "function") {
    const img = lightbox.querySelector("img");
    // the thumbnails are plain links to the image, so they still work without <dialog>
    document.querySelectorAll("[data-lightbox]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        img.src = link.getAttribute("href");
        img.alt = link.querySelector("img")?.alt || "";
        lightbox.showModal();
      });
    });
    // click anywhere (backdrop, image or close button) to close
    lightbox.addEventListener("click", () => lightbox.close());
  }
})();
