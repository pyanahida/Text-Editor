const editor = document.getElementById("editor");
const saveButton = document.getElementById("save-button");
const statusLabel = document.getElementById("status");

let statusTimer = null;

function pad(value) {
  return String(value).padStart(2, "0");
}

function buildFileName() {
  const now = new Date();
  const hhmmss = pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
  return "untitled" + hhmmss + ".txt";
}

function showStatus(message) {
  statusLabel.textContent = message;
  if (statusTimer !== null) {
    clearTimeout(statusTimer);
  }
  statusTimer = setTimeout(function () {
    statusLabel.textContent = "";
    statusTimer = null;
  }, 3000);
}

function saveText() {
  const fileName = buildFileName();
  const blob = new Blob([editor.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showStatus("Saved as " + fileName);
}

saveButton.addEventListener("click", saveText);

document.addEventListener("keydown", function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveText();
  }
});
