// Select the form
const form = document.querySelector("#updateForm");

// Disable the button until a change is detected
form.addEventListener("change", function () {
  const updateBtn = form.querySelector("button[type='submit']");
  if (updateBtn) {
    updateBtn.removeAttribute("disabled");
  }
});
