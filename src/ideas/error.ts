// private throwApp(message: string) { // WIP: error handling
this.header.innerHTML = "";
this.footer.innerHTML = "";
this.main.innerHTML = `<p class="error">${message}</p>`;
throw this;
}