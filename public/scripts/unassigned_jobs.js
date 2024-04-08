const unassigned = document.getElementById('unassigned')

unassigned.addEventListener('click', function(e) {
    if(e.target && e.target.matches('.jobs-list-item')) {
        var job = e.target.querySelector(".assign-job")
        if(job.hidden == "") {
            job.hidden = true
        } else {
            job.hidden = ""
        }
    }
})

function fillList() {
    fetch('/admin/unassigned_jobs/get_forms', {
        method: 'GET'
    }).then(response => response.json())
    .then(async data => {
        if(data) {
            for(var i = 0; i < data.length; i++) {
                var list = document.createElement('li')
                list.classList.add("jobs-list-item")
                list.innerText = `${data[i].workOrderNumber}: ${data[i].job_address}` 

                var div = document.createElement('div')
                div.id = `input${i}`
                div.classList.add(data[i]._id)
                div.classList.add('assign-job')
                div.hidden = true
                div.innerHTML = `
                    <div class="input">
                        <label for="assignWorker${i}">Assign To:</label>
                        <select name="assignWorker${i}" id="assignWorker${i}"></select>
                    </div>

                    <div class="input">
                        <button id="assignBtn${i}">Assign</button>
                    </div>
                `
                
                list.appendChild(div)
                unassigned.appendChild(list)

                getWorkers(document.getElementById(`assignWorker${i}`))
                console.log(document.getElementById(`assignWorker${i}`))

                document.getElementById(`assignBtn${i}`).addEventListener('click', function(e) {
                    if(e.target) {
                        assignJob(e.target.id)
                    }
                })
            }
        } else {
            var list = document.createElement('p')
            list.innerText = "No unassigned forms"
            unassigned.appendChild(list)
        }
    })
}

async function getWorkers(select) {
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

function assignJob(buttonID) {
    var index = buttonID.split('assignBtn')[1]
    var workerSelect = document.getElementById(`assignWorker${index}`)    
    
    if(workerSelect.value == "*** Create Workers ***") {
        window.alert("Create a worker first")
        return
    }

    var data = { 'id':document.getElementById(`input${index}`).classList[0], 'staffID':workerSelect.value }
    console.log(data.staffID)

    fetch('/admin/unassigned_jobs/assign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => {
        window.location.reload()
    })
}

window.onload = fillList();