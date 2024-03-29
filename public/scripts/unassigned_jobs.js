const unassigned = document.getElementById('unassigned')

function fillList() {
    fetch('/admin/unassigned_jobs/get_forms', {
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        if(data) {
            for(var i = 0; i < data.length; i++) {
                var list = document.createElement('li')
                list.classList.add("jobs-list-item")
                list.innerText = `${data[i].workOrderNumber}: ${data[i].address}` 
                unassigned.appendChild(list)
            }
        } else {
            var list = document.createElement('p')
            list.innerText = "No unassigned forms"
            unassigned.appendChild(list)
        }
    })
}

window.onload = fillList();