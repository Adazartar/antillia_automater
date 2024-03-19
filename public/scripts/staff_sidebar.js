class staff_sidebar extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        var color1, color2, color3, color4, color5;
        color1 = color2 = color3 = color4 = color5 = "";
        if(window.location.pathname == "/staff/jobs") {
            color1 = "steelblue"
        }
        this.innerHTML = `
            <div class="sidebar">
                <a href="/staff/jobs" style="color: ${color1}">Jobs</a>
            </div>
        `
    }
}

customElements.define('staff_sidebar-component', staff_sidebar)
