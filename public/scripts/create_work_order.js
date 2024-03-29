const form = document.querySelector(".form")
const selectForm = document.getElementById("form-selector")
selectForm.addEventListener("change", setForm)

function setForm() {
    while(form.children.length > 1) {
        form.removeChild(form.lastElementChild)
    }
    
    switch(selectForm.value) {
        case "form1":
            createForm1()
            break
        case "form2":
            createForm2()
            break
    }
}

function createForm1() {
    let div = document.createElement('div')
    div.id = 'newForm'
    div.classList.add('form1')
    div.innerHTML = `
    <div class="input">
        <p>Work Order Number:</p>
        <p id="WON"></p>
    </div>
    
    <div class="input">
        <label for="address">Work Address:</label>
        <input type="text" id="address">
    </div>

    <div class="input">
        <label for="assignWorker">Assign To:</label>
        <select name="assignWorker" id="assignWorker"></select>
    </div>

    <div class="input">
        <button id="createBtn">Create</button>
    </div>`
    form.appendChild(div)

    document.getElementById("createBtn").addEventListener("click", createEntry)

    newWorkOrderNumber(document.getElementById("WON"))    
    getWorkers(document.getElementById('assignWorker'))
}

function createForm2() {
    let div = document.createElement('div')
    div.id = 'newForm'
    div.classList.add('form2')
    div.innerHTML = `
    <div id="orderSelector">
        <label for="WON">Work Order Number:</label>
        <input type="number" id="WON" style="margin: 4px">
        <button id="getForm">Get Form</button>
    </div>

    <div id="hiddenForm" hidden>
        <div class="input">
            <label for="address">Address:</label>
            <input type="text" id="address">
        </div>

        <div class="input">
            <p>Attendance Number:</p>
            <p id="attendance_num"></p>
        </div>

        <div class="input">
            <label for="assignWorker">Assign To:</label>
            <select name="assignWorker" id="assignWorker"></select>
        </div>

        <div class="input">
            <button id="createBtn">Create</button>
        </div>
    </div>`
    form.appendChild(div)

    document.getElementById("createBtn").addEventListener("click", createEntry)

    document.getElementById('getForm').onclick = function() {
        getForm(document.getElementById('WON').value)
    }
    getWorkers(document.getElementById('assignWorker'))
}

function getForm(id) {
    fetch('/admin/get_form', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "workOrderNumber": id })
    }).then(response => response.json())
    .then(data => {
        if(form.children.length > 2) {
            form.removeChild(form.lastElementChild)
        }
        if(data) {
            document.getElementById('hiddenForm').hidden = ""
            document.getElementById('address').value = data.address;
            document.getElementById('attendance_num').innerText = data.attendance_num + 1;
        } else {
            document.getElementById('hiddenForm').hidden = "true"
            let div = document.createElement('p')
            div.innerText = "No form found"
            form.appendChild(div)
        }
        
    })
}

function newWorkOrderNumber(label) {
    fetch("/admin/workOrderNumber", {
        method: "GET"
    }).then(response => response.json())
    .then(data => {
        if(data.workOrderNumber == null) {
            label.innerText = "1";
        } else {
            label.innerText = data.workOrderNumber;
        }
    })
}

function getWorkers(select) {
    fetch("/admin/getWorkers", {
        method: "GET"
    }).then(response => response.json())
    .then(data => {
        while (select.firstChild) {
            select.removeChild(select.lastChild);
        }
        if(data.names == null) {
            var opt = document.createElement('option')
            opt.value = "*** Create Workers ***"
            opt.innerHTML = "*** Create Workers ***"
            select.appendChild(opt)
        } else {
            for(const worker of data.names) {
                var opt = document.createElement('option')
                opt.value = worker.staffID;
                opt.innerHTML = worker.name;
                select.appendChild(opt)
            }
        }
    })
}

function createEntry() {
    if(document.getElementById('assignWorker') == "*** Create Workers ***") {
        window.alert("Create a worker first")
        return
    }

    const newForm = document.getElementById('newForm')
    let data = { "form_type": "", "workOrderNumber":0, "attendance_num":0, "completed":false, "submitted":false, "address":document.getElementById('address').value, "staffID":document.getElementById('assignWorker').value }

    if(newForm.classList.contains('form1')) {
        data.form_type = "form1"
        data.workOrderNumber = parseInt(document.getElementById('WON').innerText)
        data.attendance_num = 1
    } else if(newForm.classList.contains('form2')) {
        data.form_type = "form2"
        data.workOrderNumber = parseInt(document.getElementById('WON').value)
        data.attendance_num = parseInt(document.getElementById("attendance_num").innerText)
    }

    fetch('/admin/create_work_order/new-entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => {
        window.location.reload()
    })
}