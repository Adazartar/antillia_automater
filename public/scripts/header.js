class header extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="headerBtn" onclick='location.href = "/admin"'>
                <img src="/images/logo_e4f9f5.png" alt="Antillia Emergency Network Logo" id="logo" width=100>
                <h1>Antillia Emergency Network</h1>
            </div>
        `
    }
}

customElements.define('header-component', header)