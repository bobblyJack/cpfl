// i dont think this actually works tbh
class TestClass {
    element: HTMLElement;
    action: () => any;
    constructor(e: HTMLElement, a: () => any) {
        this.element = e;
        this.action = a;
        const observer = new MutationObserver(() => {
            if (this.element.isConnected) {
                this.element.onclick = this.action;
            } else if (!this.element.isConnected) {
                this.element.onclick = null;
            }
        });
        observer.observe(this.element)
    }
}