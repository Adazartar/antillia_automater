class sidebar extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        var color1, color2, color3, color4, color5;
        color1 = color2 = color3 = color4 = color5 = "black";
        if(window.location.pathname == "/admin/create_work_order") {
            color1 = "steelblue"
        } else if(window.location.pathname == "/admin/jobs_submitted") {
            color2 = "steelblue"
        } else if(window.location.pathname == "/admin/create_purchase_order") {
            color3 = "steelblue"
        } else if(window.location.pathname == "/admin/completed_jobs") {
            color4 = "steelblue"
        } else if(window.location.pathname == '/admin/create_worker') {
            color5 = "steelblue"
        }
        this.innerHTML = `
            <div class="sidebar">
                <a href="/admin/create_work_order" style="color: ${color1}">Create Work Order</a>
                <a href="/admin/jobs_submitted" style="color: ${color2}">Jobs Submitted</a>
                <a href="/admin/create_purchase_order" style="color: ${color3}">Create Purchase Order</a>
                <a href="/admin/completed_jobs" style="color: ${color4}">Completed Jobs</a>
                <a href="/admin/create_worker" style="color: ${color5}">Create Worker</a>
            </div>
        `
    }
}

customElements.define('sidebar-component', sidebar)
