class Alert extends HTMLElement {
  // For tailwind builder only
  redAccent = ["bg-red-100", "border-red-600", "text-red-500"]
  greenAccent = ["bg-green-100", "border-green-600", "text-green-500"]
  constructor(message, accentColor, icon) {
    super();
    this.innerHTML = `
      <div class="fixed top-4 left-4 bg-${accentColor}-100 rounded-md p-4 border-2 border-${accentColor}-600">
        <div class="flex items-center gap-2">
          <i class="${icon} text-${accentColor}-500"></i>
          <div class="text-gray-900 text-sm w-52">${message}</div>
          <div class="cursor-pointer" id="close-alert">
            <i class="fa-solid fa-xmark text-gray-900"></i>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const btnClose = this.querySelector("#close-alert");
    btnClose.addEventListener("click", () => {
      this.remove();
    });
    setTimeout(() => {
      this.remove();
    }, 5000);
  }
}

class AlertError extends Alert {
  constructor(message) {
    super(message, "red", "fa-solid fa-circle-exclamation");
  }
}
customElements.define("alert-error", AlertError);

class AlertSuccess extends Alert {
  constructor() {
    super("Download successful", "green", "fa-solid fa-circle-check");
  }
}
customElements.define("alert-success", AlertSuccess);

const alertContainer = document.getElementById("alert-container");
const toggleMoon = document.getElementById("moon");
const toggleSun = document.getElementById("sun");
const toggleTheme = document.getElementById("toggle-theme");
const downloadProgress = document.getElementById("download-progress");
const urlForm = document.getElementById("url-form");
const btnDownload = document.getElementById("btn-download");

function handleToggleTheme() {
  document.documentElement.classList.toggle("dark");
  if (localStorage.theme === "dark") {
    localStorage.theme = "light";
  } else {
    localStorage.theme = "dark";
  }
  toggleMoon.classList.toggle("hidden");
  toggleSun.classList.toggle("hidden");
}

function initThemeOptions() {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    toggleMoon.classList.remove("hidden");
    toggleSun.classList.add("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    toggleMoon.classList.add("hidden");
    toggleSun.classList.remove("hidden");
  }
}

function darkModeOptions() {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  initThemeOptions();
  toggleTheme.addEventListener("click", handleToggleTheme);
}

async function download(url) {
  // Fetch from API
  const response = await fetch(
    "https://slideshare-image-api.herokuapp.com/api/slides/download?url=" + url
  );

  // Throw error if response false
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.message);
  }

  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = "";
  if (contentDisposition && contentDisposition.indexOf("attachment") !== -1) {
    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    let matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, "");
    }
  }

  const newResponse = new Response(
    new ReadableStream({
      start: async (controller) => {
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("Content-Length");
        let receivedLength = 0;
        downloadProgress.classList.remove("hidden");
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          controller.enqueue(value);
          receivedLength += value.length;
          const progressLength =
            ((receivedLength / contentLength) * 100).toFixed() + "%";
          downloadProgress.style.width = progressLength;
        }
        alertContainer.appendChild(new AlertSuccess());
        downloadProgress.classList.add("hidden");
        downloadProgress.style.removeProperty("width");
      },
    })
  );

  const blob = await newResponse.blob();

  const downloadObject = document.createElement("a");
  downloadObject.target = "_blank";
  downloadObject.download = filename;
  downloadObject.href = URL.createObjectURL(blob);
  downloadObject.click();
}

async function handleSubmit(event) {
  event.preventDefault();

  const url = document.getElementById("url").value;
  console.log(url);

  btnDownload.innerHTML = "Loading...";
  btnDownload.disabled = true;
  btnDownload.classList.add("cursor-not-allowed");
  try {
    await download(url);
  } catch (error) {
    console.log(error);
    alertContainer.appendChild(new AlertError(error.message));
  }
  btnDownload.classList.remove("cursor-not-allowed");
  btnDownload.disabled = false;
  btnDownload.textContent = "Download";
}

darkModeOptions();

urlForm.addEventListener("submit", handleSubmit);
