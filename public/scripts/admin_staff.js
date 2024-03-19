const createBtn = document.getElementById("createBtn")
const workerName = document.getElementById("workerName")

createBtn.addEventListener("click", createWorker)

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
        body: JSON.stringify({ name: workerName.value })
    }).then((res) => {
        window.location.reload()
    })
}