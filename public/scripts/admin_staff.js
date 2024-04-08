const firstPage = document.getElementById("first")
const addPage = document.getElementById("add-page")
const delPage = document.getElementById("del-page")
const workers = document.getElementById("workers")
const listBtn = document.getElementById("list-staff")
const addBtn = document.getElementById('add')
const delBtn = document.getElementById('delete')

listBtn.addEventListener('click', unhideStaffList)
addBtn.addEventListener('click', unhideAddPage)
delBtn.addEventListener('click', unhideDelPage)

const createBtn = document.getElementById("createBtn")
const workerName = document.getElementById("workerName")
const username = document.getElementById("username")
const password = document.getElementById("password")
const showPassword = document.getElementById("showPassword")
const isAdmin = document.getElementById("admin")

showPassword.addEventListener('click', showPasswordChars)

const select = document.getElementById("staffMembers")
const deleteBtn = document.getElementById("deleteBtn")

createBtn.addEventListener("click", createWorker)
deleteBtn.addEventListener("click", deleteWorker)

var staffInfo;

function createWorker() {
    if(workerName.value == "") {
        alert("Enter a name")
        return
    }

    fetch('/admin/create_worker_id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name":workerName.value, "username":username.value, "admin":isAdmin.checked, "password":password.value })
    }).then((res) => {
        window.location.reload()
    })
}

workers.addEventListener("click", function(e) {
    if(e.target) {
        if (e.target.matches(".jobs-list-item") && !e.target.classList.contains("empty")) {
            var job = e.target.querySelector(".staff-job")
            if(job.hidden == "") {
                job.hidden = true
            } else {
                job.hidden = ""
            }
            
        } else if(e.target.matches(".staff-job") && !e.target.parentNode.classList.contains("empty")) {
            if(e.target.hidden == "") {
                e.target.hidden = true
            } else {
                e.target.hidden = ""
            }
        } else if(e.target.parentNode.matches(".staff-job") && !e.target.parentNode.parentNode.classList.contains("empty")) {
            askToUnassign(e.target)
            /*
            if(e.target.parentNode.hidden == "") {
                e.target.parentNode.hidden = true
            } else {
                e.target.parentNode.hidden = ""
            }*/
        }
    }
})

function askToUnassign(job) {
    var answer = confirm("Unassign: " + job.innerText)
    if(answer) {
        var id = {"id": job.classList[0]}
        fetch('/admin/staff/unassign', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(id)
        }).then((res) => {
            window.location.reload()
        })
    }
}

async function showWorkers() {
    fetch("/admin/staff/jobs", {
        method: "GET"
    }).then(response => response.json())
    .then(data => {
        staffInfo = data;
        while(workers.firstChild) {
            workers.removeChild(workers.lastChild);
        }
        if(!data) {
            var p = document.createElement("p")
            p.innerText = "*** Create Workers ***"
            workers.appendChild(p)
            return
        }
        for(var i = 0; i < data.staff.length; i++) {
            var list = document.createElement('li')
            list.classList.add("jobs-list-item")
            list.innerText = `${data.staff[i].name} \n Number of Jobs: ${data[data.staff[i].staffID].length}`

            var div = document.createElement('div')
            div.classList.add("staff-job")
            div.hidden = true
            var counter = 0
            for(const job of data[data.staff[i].staffID]) {
                var child = document.createElement('p')
                child.classList.add(job._id) // *** Keep as position 0 in classlist. Used to unassign job
                if(counter == 0) {
                    child.innerText = `${job.workOrderNumber}: ${job.job_address}`
                } else {
                    child.innerText = `\n${job.workOrderNumber}: ${job.job_address}`
                }
                counter++
                div.appendChild(child)
            }
            if(data[data.staff[i].staffID].length == 0) {
                list.classList.add("empty")
            }
            list.appendChild(div)
            
            workers.appendChild(list)
        }
    })
}

window.onload = showWorkers()

async function unhideStaffList() {
    await showWorkers()
    firstPage.hidden = ""
    addPage.hidden = true
    delPage.hidden = true
}

function unhideAddPage() {
    workerName.value = ""
    firstPage.hidden = true
    addPage.hidden = ""
    delPage.hidden = true
}

function unhideDelPage() {
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
    firstPage.hidden = true
    addPage.hidden = true
    delPage.hidden = ""
}

function deleteWorker() {
    if(select.value == "*** Create Workers ***") {
        alert("*** Create Workers ***")
        return
    } else if(staffInfo[select.value].length != 0) {
        alert("Staff Member still has jobs")
        return
    }
    
    fetch("/admin/staff/delete", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: select.value })
    }).then((res) => {
        window.location.reload()
    })
}

function showPasswordChars() {
    if (password.type === "password") {
        password.type = "text";
      } else {
        password.type = "password";
      }
}