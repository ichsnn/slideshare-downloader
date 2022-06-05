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