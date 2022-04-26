const button = document.getElementById('button');

button.addEventListener('click', async () => {
    const url = document.getElementById('input-url');
    console.log('test');
    button.disabled = true;
    button.innerHTML = btnLoading();
    const response = await fetch(
        `https://slideshare-image-api.herokuapp.com/api/slides/download?url=${url.value}`
    ).then(v => v.json());
    if(!response.status) {
        
    }
    button.disabled = false;
    button.innerHTML = btnDownload()
});

function btnLoading() {
    return 'Loading...';
}

function btnDownload() {
    return 'Download'
}

// document.addEventListener('DOMContentLoaded', () => {

// })
