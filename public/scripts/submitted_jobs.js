const completed = document.getElementById('completed')

function fillList() {
    fetch('/admin/submitted_jobs/get_forms', {
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        if(data) {
            for(var i = 0; i < data.length; i++) {
                var list = document.createElement('li')
                list.innerText = `${data[i].workOrderNumber}: ${data[i].address}` 
                completed.appendChild(list)
            }
        } else {
            var list = document.createElement('p')
            list.innerText = "No Forms available"
            completed.appendChild(list)
        }
    })
}

window.onload = fillList();