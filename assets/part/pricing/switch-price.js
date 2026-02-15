// Pricing location switcher - handles both dropdown and button-based switching
// 1. Dropdown: add a <select> with id 'location-select' where option values match content panel ids.
// 2. Buttons: add buttons with class 'custom-price-button' and 'data-target' matching content panel ids.
// 3. Content panels: add elements with class 'custom-price-content' and matching ids.

document.addEventListener("DOMContentLoaded", () => {
  const contents = document.querySelectorAll(".custom-price-content");
  const buttons = document.querySelectorAll(".custom-price-button");
  const locationSelect = document.getElementById("location-select");

  // Function to switch visible content
  function switchContent(target) {
    contents.forEach((content) => {
      const isContentActive = content.getAttribute("id") === target;
      content.classList.toggle("show", isContentActive);
      content.classList.toggle("active", isContentActive);
      content.classList.toggle("d-none", !isContentActive);
    });
  }

  // Dropdown handler
  if (locationSelect) {
    locationSelect.addEventListener("change", (e) => {
      const target = e.target.value;
      switchContent(target);

      // Also sync buttons if they exist
      buttons.forEach((btn) => {
        const isActive = btn.getAttribute("data-target") === target;
        btn.classList.toggle("active", isActive);
        btn.classList.toggle("show", isActive);
      });
    });

    // Initialize: show default selected content, hide others
    const defaultTarget = locationSelect.value;
    contents.forEach((content) => {
      const isContentActive = content.getAttribute("id") === defaultTarget;
      content.classList.toggle("show", isContentActive);
      content.classList.toggle("active", isContentActive);
      content.classList.toggle("d-none", !isContentActive);
      if (isContentActive) {
        content.classList.remove("fade");
      }
    });
  }

  // Button handlers (backward compatible)
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const targetButton = e.target.closest("button");
      const target = targetButton.getAttribute("data-target");

      buttons.forEach((btn) => {
        const isActive = btn.getAttribute("data-target") === target;
        btn.classList.toggle("active", isActive);
        btn.classList.toggle("show", isActive);
      });

      switchContent(target);

      // Sync dropdown if it exists
      if (locationSelect) {
        locationSelect.value = target;
      }
    });
  });
});
