class AlertPopUp extends HTMLElement {
  constructor(message = "message", icon = { color: "", svg: "" }) {
    super();
    this.className = `alert flex ${icon.color} text-center gap-1 text-base items-center`;
    this.innerHTML = `<div>${icon.svg}</div><p class="text-left">${message}</p></div>`;
  }
}
customElements.define("alert-popup", AlertPopUp);

function btnLoading() {
  return '<svg role="status" class="w-5 h-5 mr-2 text-gray-500 animate-spin dark:text-white-100 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path></svg>Loading...';
}

function btnDownload() {
  return "Download";
}

const button = document.getElementById("button"); // Sumbit Button
const inputURL = document.getElementById("input-url"); // Input

inputURL.addEventListener("keypress", (event) => {
  // Press enter on input field to submit
  "Enter" === event.key && (event.preventDefault(), button.click());
});

button.addEventListener("click", async () => {
  // Disabled button and Change button innerHTML
  (button.disabled = true), (button.innerHTML = btnLoading());
  const alert = document.getElementById("alert");
  try {
    const url = inputURL.value;
    // Fetch from API
    const response = await fetch(
      "http://localhost:3000/api/slides/download?url=" + url
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
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
            receivedLength += value.length;
            console.log(`Received ${receivedLength} of ${contentLength}`);
          }
        },
      })
    );

    const blob = await newResponse.blob();

    const downloadObject = document.createElement("a");
    downloadObject.target = "_blank";
    downloadObject.download = filename;
    downloadObject.href = URL.createObjectURL(blob);
    downloadObject.click();

    // Remove recent PopUp
    alert.hasChildNodes.length >= 0 && alert.childNodes[0].remove();

    // Send PopUp when file downloaded
    alert.append(
      new AlertPopUp("Downloaded...", {
        color: "text-green-600",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">   <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>  ',
      })
    );
  } catch (error) {
    // Error handling
    // Remove rencent PopUp
    alert.hasChildNodes.length >= 0 && alert.childNodes[0].remove();

    // Send Error PopUp
    alert.append(
      new AlertPopUp(error.message, {
        color: "text-red-700",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /> </svg>',
      })
    ),
      inputURL.focus();
  }
  button.innerHTML = btnDownload();
  button.disabled = false;
});
