const editor = document.getElementById("editor");
const saveButton = document.getElementById("save-button");
const statusLabel = document.getElementById("status");
const fileList = document.getElementById("file-list");
const newFileButton = document.getElementById("new-file-button");

const LONG_PRESS_DELAY = 600;

let files = [];
let activeId = null;
let nextId = 1;
let statusTimer = null;
let pressTimer = null;
let longPressFired = false;

function pad(value) {
  return String(value).padStart(2, "0");
}

function timeName() {
  const now = new Date();
  return pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
}

function uniqueName(base) {
  let name = base;
  let index = 2;
  while (files.some(function (file) { return file.name === name; })) {
    name = base + "-" + index;
    index += 1;
  }
  return name;
}

function uniqueNameFor(currentFile, base) {
  let name = base;
  let index = 2;
  while (files.some(function (file) {
    return file.id !== currentFile.id && file.name === name;
  })) {
    name = base + "-" + index;
    index += 1;
  }
  return name;
}

function getActive() {
  return files.find(function (file) { return file.id === activeId; }) || null;
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

function cancelPress() {
  if (pressTimer !== null) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
}

function startPress(tabEl, file) {
  cancelPress();
  longPressFired = false;
  pressTimer = setTimeout(function () {
    pressTimer = null;
    longPressFired = true;
    startRename(tabEl, file);
  }, LONG_PRESS_DELAY);
}

function startRename(tabEl, file) {
  if (tabEl.querySelector(".file-tab-input")) {
    return;
  }
  const nameEl = tabEl.querySelector(".file-tab-name");
  const input = document.createElement("input");
  input.type = "text";
  input.className = "file-tab-input";
  input.value = file.name;

  nameEl.style.display = "none";
  tabEl.appendChild(input);
  input.focus();
  input.select();

  let finished = false;

  function finish(commit) {
    if (finished) {
      return;
    }
    finished = true;
    if (commit) {
      const nextName = input.value.trim();
      if (nextName) {
        file.name = uniqueNameFor(file, nextName);
      }
    }
    input.remove();
    nameEl.style.display = "";
    nameEl.textContent = file.name;
  }

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      finish(true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      finish(false);
    }
  });
  input.addEventListener("blur", function () {
    finish(true);
  });
  input.addEventListener("click", function (event) {
    event.stopPropagation();
  });
  input.addEventListener("mousedown", function (event) {
    event.stopPropagation();
  });
  input.addEventListener("touchstart", function (event) {
    event.stopPropagation();
  });
}

function attachTabEvents(tabEl, file) {
  tabEl.addEventListener("click", function () {
    if (longPressFired) {
      longPressFired = false;
      return;
    }
    switchTo(file.id);
  });
  tabEl.addEventListener("mousedown", function () {
    startPress(tabEl, file);
  });
  tabEl.addEventListener("touchstart", function () {
    startPress(tabEl, file);
  }, { passive: true });
  tabEl.addEventListener("mouseup", cancelPress);
  tabEl.addEventListener("mouseleave", cancelPress);
  tabEl.addEventListener("touchend", cancelPress);
  tabEl.addEventListener("touchmove", cancelPress);
}

function renderTabs() {
  fileList.textContent = "";
  files.forEach(function (file) {
    const tab = document.createElement("div");
    tab.className = "file-tab" + (file.id === activeId ? " active" : "");
    tab.dataset.id = String(file.id);

    const nameEl = document.createElement("span");
    nameEl.className = "file-tab-name";
    nameEl.textContent = file.name;
    tab.appendChild(nameEl);

    attachTabEvents(tab, file);
    fileList.appendChild(tab);
  });

  const activeTab = fileList.querySelector(".file-tab.active");
  if (activeTab) {
    activeTab.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

function addFile(name) {
  const file = {
    id: nextId,
    name: uniqueName(name),
    content: ""
  };
  nextId += 1;
  files.push(file);
  activeId = file.id;
  editor.value = "";
  renderTabs();
  editor.focus();
}

function switchTo(id) {
  if (id === activeId) {
    return;
  }
  const current = getActive();
  if (current) {
    current.content = editor.value;
  }
  activeId = id;
  const next = getActive();
  editor.value = next ? next.content : "";
  renderTabs();
  editor.focus();
}

function saveText() {
  const file = getActive();
  if (!file) {
    return;
  }
  file.content = editor.value;

  let fileName = file.name.trim() || timeName();
  if (!/\.txt$/i.test(fileName)) {
    fileName += ".txt";
  }

  const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
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

editor.addEventListener("input", function () {
  const file = getActive();
  if (file) {
    file.content = editor.value;
  }
});

newFileButton.addEventListener("click", function () {
  const current = getActive();
  if (current) {
    current.content = editor.value;
  }
  addFile(timeName());
});

saveButton.addEventListener("click", saveText);

document.addEventListener("keydown", function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveText();
  }
});

addFile(timeName());
