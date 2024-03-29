class admin_sidebar extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        var color1, color2, color3, color4, color5, color6;
        color1 = color2 = color3 = color4 = color5 = color6 = "";
        if(window.location.pathname == "/admin/create_work_order") {
            color1 = "steelblue"
        } else if(window.location.pathname == "/admin/create_purchase_order") {
            color2 = "steelblue"
        } else if(window.location.pathname == '/admin/unassigned_jobs') {
            color3 = "steelblue"
        } else if(window.location.pathname == "/admin/submitted_jobs") {
            color4 = "steelblue"
        } else if(window.location.pathname == "/admin/completed_jobs") {
            color5 = "steelblue"
        } else if(window.location.pathname == '/admin/staff') {
            color6 = "steelblue"
        }
        this.innerHTML = `
            <div class="sidebar">
                <a href="/admin/create_work_order" style="color: ${color1}">Create Work Order</a>
                <a href="/admin/create_purchase_order" style="color: ${color2}">Create Purchase Order</a>
                <a href="/admin/unassigned_jobs" style="color: ${color3}">Unassigned Jobs</a>
                <a href="/admin/submitted_jobs" style="color: ${color4}">Submitted Jobs</a>
                <a href="/admin/completed_jobs" style="color: ${color5}">Completed Jobs</a>
                <a href="/admin/staff" style="color: ${color6}">Staff</a>
            </div>
        `
    }
}

customElements.define('admin_sidebar-component', admin_sidebar)
