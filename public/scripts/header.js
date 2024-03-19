class header extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        var location = "/admin"
        if(window.location.pathname.match(/staff/)) {
            location = "/staff"
        }
        this.innerHTML = `
            <div id="headerBtn" onclick='location.href = "${location}"'>
                <img src="/images/logo_e4f9f5.png" alt="Antillia Emergency Network Logo" id="logo" width=100>
                <h1>Antillia Emergency Network</h1>
            </div>
        `
    }
}

customElements.define('header-component', header)