class AlertPopUp extends HTMLElement {
  constructor(message = "message", options = { color: "", icon: "" }) {
    super();
    this.className = `alert flex ${options.color} text-center gap-1 text-base items-center`;
    this.innerHTML = `
      <div>
        ${options.icon}
      </div>
      <p class="text-left">${message}</p>
    </div>
    `;
  }
}
customElements.define("alert-popup", AlertPopUp);

const button = document.getElementById("button");
const inputURL = document.getElementById("input-url");

function btnLoading() {
  return "Loading...";
}

function btnDownload() {
  return "Download";
}

button.addEventListener("click", async () => {
  button.disabled = true;
  button.innerHTML = btnLoading();

  const alertContainer = document.getElementById("alert");

  try {
    const url = inputURL.value;
    const response = await fetch(
      "https://slideshare-image-api.herokuapp.com/api/slides/download?url=" +
        url
    );

    // Throw error if response not ok
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.message);
    }

    // Download File
    const link = document.createElement("a");
    link.target = "_blank";
    link.download = "PDF.pdf";
    const result = await response.blob();
    link.href = URL.createObjectURL(result);
    link.click();

    if (alertContainer.hasChildNodes.length >= 0) {
      alertContainer.childNodes[0].remove();
    }
    alertContainer.append(
      new AlertPopUp("Downloaded...", {
        color: "text-green-600",
        icon: `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      `,
      })
    );
  } catch (error) {
    if (alertContainer.hasChildNodes.length >= 0) {
      alertContainer.childNodes[0].remove();
    }
    alertContainer.append(
      new AlertPopUp(error.message, {
        color: "text-red-700",
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          `,
      })
    );
    inputURL.focus();
  }

  button.innerHTML = btnDownload();
  button.disabled = false;
});
