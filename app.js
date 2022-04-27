class AlertPopUp extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const closeBtn = this.querySelector("#btn__alert-close");

    closeBtn.addEventListener("click", () => {
      this.remove();
      let stack = document.querySelector(".alert-stack");
      if (stack.hasChildNodes.length < 1) stack.remove();
    });
  }
}
class AlertError extends AlertPopUp {
  constructor(message = "Error Message!") {
    super();

    this.className =
      "alert bg-red-500 px-4 py-4 text-white rounded-xl flex gap-2 justify-between mt-2 mr-2 items-center min-w-[18rem]";

    this.innerHTML = `
        <div class="flex gap-2 flex-shrink overflow-hidden items-center">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
            </div>
            <div class="overflow-hidden text-ellipsis whitespace-nowrap" id="alert-message" aria-label="${message}">
                ${message}
            </div>
        </div>
        <button type="button" id="btn__alert-close">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    `;
  }
}
class AlertSuccess extends AlertPopUp {
  constructor(message = "Success Message!") {
    super();

    this.className =
      "alert bg-green-500 px-4 py-4 text-white rounded-xl flex gap-2 justify-between w-72 mt-2 mr-2 items-center";

    this.innerHTML = `
        <div class="flex gap-2 flex-shrink overflow-hidden items-center">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <div class="overflow-hidden text-ellipsis whitespace-nowrap" id="alert-message">
                ${message}
            </div>
        </div>
        <button type="button" id="btn__alert-close">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    `;
  }
}
class AlertContainer extends HTMLElement {
  constructor() {
    super();
    this.className = "alert-stack absolute top-0 right-0 flex flex-col z-50";
  }

  connectedCallback() {
    this.addEventListener("change", () => {
      console.log(this.hasChildNodes.length);
    });
  }
}

customElements.define("alert-error", AlertError);
customElements.define("alert-success", AlertSuccess);
customElements.define("alert-container", AlertContainer);

//

const button = document.getElementById("button");

function btnLoading() {
  return "Loading...";
}

function btnDownload() {
  return "Download";
}

function btnCloseAlert() {
  const btn = document.getElementById("btn__alert-close");
}

button.addEventListener("click", async () => {
  const alertColls = document.querySelectorAll(".alert");

  if (!document.querySelector(".alert-stack")) {
    document.body.firstElementChild.before(new AlertContainer());
  }

  button.disabled = true;
  button.innerHTML = btnLoading();

  try {
    const url = document.getElementById('input-url').value
    const response = await fetch(
      "https://slideshare-image-api.herokuapp.com/api/slides/download?url=" + url
    );

    if(!response.ok) {
      const json = await response.json();
      throw new Error(json.message);
    }

    const link = document.createElement('a')
    link.target = "_blank";
    link.download = "PDF.pdf";
    const result = await response.blob();
    link.href = URL.createObjectURL(result)
    link.click();
    

    if (!response.status) throw new Error(response.message);

    const alert = new AlertSuccess("Downloading...");

    document.querySelector(".alert-stack").append(alert);
  } catch (error) {
    console.log();
    const alert = new AlertError(error.message);

    document.querySelector(".alert-stack").append(alert);
  }
  button.innerHTML = btnDownload();
  button.disabled = false;

  if (alertColls.length >= 1) {
    alertColls[0].remove();
  }
});

// document.addEventListener('DOMContentLoaded', () => {

// })
