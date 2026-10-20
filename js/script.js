"use strict";

const CONTACT_EMAIL = "";

const year = document.querySelector("[data-current-year]");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

if (menuToggle && siteNav) {
  const setMenuOpen = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    siteNav.classList.toggle("is-open", isOpen);
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  siteNav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      menuToggle.getAttribute("aria-expanded") === "true" &&
      !siteNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });
}

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section instanceof HTMLElement);

if ("IntersectionObserver" in window && navSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (!activeEntry) {
        return;
      }

      navLinks.forEach((link) => {
        const isCurrent = link.hash === `#${activeEntry.target.id}`;
        link.classList.toggle("is-current", isCurrent);
        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-22% 0px -58% 0px", threshold: [0, 0.2, 0.45, 0.7] }
  );

  navSections.forEach((section) => sectionObserver.observe(section));
}

const updateArtworkImageState = (image) => {
  const isLoaded = image.complete && image.naturalWidth > 0;
  image.classList.toggle("is-loaded", isLoaded);
  image.parentElement?.classList.toggle("has-artwork", isLoaded);
};

document.querySelectorAll("[data-artwork-image]").forEach((image) => {
  image.addEventListener("load", () => updateArtworkImageState(image));
  image.addEventListener("error", () => updateArtworkImageState(image));
  updateArtworkImageState(image);
});

document.addEventListener(
  "load",
  (event) => {
    if (event.target instanceof HTMLImageElement && event.target.matches("[data-artwork-image]")) {
      updateArtworkImageState(event.target);
    }
  },
  true
);

document.querySelectorAll("[data-foil-card], .mystery-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    card.style.setProperty("--foil-x", `${x}%`);
    card.style.setProperty("--foil-y", `${y}%`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--foil-x");
    card.style.removeProperty("--foil-y");
  });
});

const revealDialog = document.querySelector("[data-reveal-dialog]");
if (revealDialog) {
  let dialogImage = revealDialog.querySelector("[data-dialog-image]");
  const dialogArt = revealDialog.querySelector(".dialog-art");
  const dialogPlaceholder = revealDialog.querySelector("[data-dialog-placeholder]");
  const dialogPlaceholderTitle = revealDialog.querySelector("[data-dialog-placeholder-title]");
  const dialogTitle = revealDialog.querySelector("[data-dialog-title]");
  const dialogMedium = revealDialog.querySelector("[data-dialog-medium]");
  const dialogStory = revealDialog.querySelector("[data-dialog-story]");
  const dialogInquiry = revealDialog.querySelector("[data-dialog-inquiry]");
  let selectedTitle = "";

  const ensureDialogImage = () => {
    if (dialogImage) {
      return dialogImage;
    }

    dialogImage = document.createElement("img");
    dialogImage.dataset.dialogImage = "";
    dialogImage.alt = "";
    dialogArt.prepend(dialogImage);
    dialogImage.addEventListener("load", updateDialogImage);
    dialogImage.addEventListener("error", updateDialogImage);
    return dialogImage;
  };

  const updateDialogImage = () => {
    if (!dialogImage) {
      return;
    }
    const isLoaded = dialogImage.complete && dialogImage.naturalWidth > 0;
    dialogImage.classList.toggle("is-loaded", isLoaded);
    dialogPlaceholder.classList.toggle("is-hidden", isLoaded);
  };

  document.querySelectorAll("[data-art-reveal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (typeof revealDialog.showModal !== "function") {
        return;
      }

      selectedTitle = trigger.dataset.title || "DWD original";
      const sourceImage = trigger.querySelector("[data-artwork-image]");
      const sourceIsLoaded = sourceImage?.complete && sourceImage.naturalWidth > 0;
      const imagePath = sourceIsLoaded ? sourceImage.currentSrc || sourceImage.src : "";

      dialogTitle.textContent = selectedTitle;
      dialogMedium.textContent = trigger.dataset.medium || "Handcrafted original";
      dialogStory.textContent = trigger.dataset.story || "An original DWD collectible, made by hand.";
      dialogPlaceholderTitle.textContent = selectedTitle.split(" — ")[0].toUpperCase();
      dialogImage?.removeAttribute("src");
      dialogImage?.classList.remove("is-loaded");
      dialogPlaceholder.classList.remove("is-hidden");

      if (imagePath) {
        const image = ensureDialogImage();
        image.src = imagePath;
        image.alt = selectedTitle;
        updateDialogImage();
      }

      revealDialog.showModal();
    });
  });

  revealDialog.querySelector("[data-dialog-close]")?.addEventListener("click", () => {
    revealDialog.close();
  });

  revealDialog.addEventListener("click", (event) => {
    if (event.target === revealDialog) {
      revealDialog.close();
    }
  });

  dialogInquiry?.addEventListener("click", () => {
    const subject = document.querySelector("[name=subject]");
    if (subject && selectedTitle) {
      subject.value = `Commission inquiry: ${selectedTitle}`;
    }
    revealDialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && revealDialog.open) {
      event.preventDefault();
      revealDialog.close();
    }
  });

  revealDialog.addEventListener("close", () => {
    dialogImage?.removeAttribute("src");
    if (dialogImage) {
      dialogImage.alt = "";
      dialogImage.classList.remove("is-loaded");
    }
    dialogPlaceholder.classList.remove("is-hidden");
  });
}

const commissionForm = document.querySelector("[data-commission-form]");
if (commissionForm) {
  const submitButton = commissionForm.querySelector('[type="submit"]');
  const status = commissionForm.querySelector("[data-form-status]");

  if (!CONTACT_EMAIL) {
    if (submitButton) {
      submitButton.disabled = true;
    }
    if (status) {
      status.textContent = "Set CONTACT_EMAIL near the top of js/script.js to enable commission inquiries.";
    }
  } else {
    commissionForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!commissionForm.reportValidity()) {
        return;
      }

      const formData = new FormData(commissionForm);
      const message = [
        `Name: ${formData.get("name")}`,
        `Reply email: ${formData.get("email")}`,
        `Interested in: ${formData.get("type")}`,
        "",
        formData.get("message")
      ].join("\n");
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(formData.get("subject"))}&body=${encodeURIComponent(message)}`;
      window.location.href = mailto;
    });
  }
}
