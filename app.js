function darkModeOptions() {
  const toggleMoon = document.getElementById("moon");
  const toggleSun = document.getElementById("sun");

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
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

  const toggleTheme = document.getElementById("toggle-theme");
  toggleTheme.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
    } else {
      localStorage.theme = "dark";
    }
    toggleMoon.classList.toggle("hidden");
    toggleSun.classList.toggle("hidden");
    console.log(localStorage);
  });
}

darkModeOptions();

async function download(url) {
  // Fetch from API
  const response = await fetch(
    "http://slideshare-image-api.herokuapp.com/api/slides/download?url=" + url
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
}
