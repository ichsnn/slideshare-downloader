class AlertError extends HTMLElement {
    constructor(message = 'Error Message!') {
        super();

        this.className =
            'alertError bg-red-500 px-4 py-4 text-white rounded-xl flex gap-2 justify-between w-72 mt-2 mr-2 items-center';

        this.innerHTML = `
        <div class="flex gap-2 flex-shrink overflow-hidden items-center">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
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

    connectedCallback() {
        const closeBtn = this.querySelector('#btn__alert-close');

        closeBtn.addEventListener('click', () => {
            this.remove();
        });
    }
}

customElements.define('alert-error', AlertError);

// 

const button = document.getElementById('button');

function btnLoading() {
    return 'Loading...';
}

function btnDownload() {
    return 'Download';
}

function btnCloseAlert() {
    const btn = document.getElementById('btn__alert-close');
}

button.addEventListener('click', () => {
    const alert = new AlertError("Hahaha Error WKKWKWKWKWKW");

    document.querySelector('.alert-stack').append(alert);
});

// document.addEventListener('DOMContentLoaded', () => {

// })
