import { createForm1, createForm2 } from './createForms.js'

const form = document.querySelector('.form')
const jobs = document.getElementById('jobs')

function showForm(div) {
    jobs.hidden = true
    if(div.classList.contains("form1")) {
        createForm1(form)
    } else if(div.classList.contains("form2")) {
        createForm2(form)
    }
}

function getJobs() {
    fetch('/staff/jobs/get_jobs', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "user": "Tom" })
    }).then(response => response.json())
    .then(async data => {
        if(!data) {
            let div = document.createElement('p')
            div.innerText = "No current jobs"
            jobs.appendChild(div)
            return
        }
        for(var i = 0; i < data.length; i++) {
            let div = document.createElement('div')
            div.classList.add("job", data[i].form_type)
            var formName = ""
            if(data[i].form_type == "form1") {
                formName = "First Attendance"
            } else if(data[i].form_type == "form2") {
                formName = "Other Attendance"
            }

            div.innerHTML = `
            <p>Job Type: ${formName} <br>Address: ${data[i].address}</p>
            `
            jobs.appendChild(div)
            div.onclick = function() {
                showForm(div)
            }
        }
    })
}

window.onload = getJobs()