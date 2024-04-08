import { createForm1, createForm2 } from './createForms.js'
import { saveForm } from './createForms.js'

const form = document.querySelector('.form')
const jobs = document.getElementById('jobs')
const backBtn = document.getElementById("backBtn")

backBtn.addEventListener('click', backToJobs)

async function backToJobs() {
    await saveForm()
    form.removeChild(form.children[form.children.length-1])
    backBtn.hidden = true
    jobs.hidden = false
}

async function showForm(div) {
    jobs.hidden = true
    backBtn.hidden = false
    if(div.classList.contains("form1")) {
        await createForm1(form, div.classList[0])
    } else if(div.classList.contains("form2")) {
        createForm2(form, div.classList[0])
    }
}

function getJobs() {
    fetch('/staff/jobs/get_jobs').then(response => response.json())
    .then(async data => {
        if(!data) {
            let div = document.createElement('p')
            div.innerText = "No current jobs"
            jobs.appendChild(div)
            return
        }
        for(var i = 0; i < data.length; i++) {
            let div = document.createElement('div')
            div.classList.add(data[i]._id, "job", data[i].form_type)
            var formName = ""
            if(data[i].form_type == "form1") {
                formName = "First Attendance"
            } else if(data[i].form_type == "form2") {
                formName = "Other Attendance"
            }

            div.innerHTML = `
            <p>Job Type: ${formName} <br>Address: ${data[i].job_address}</p>
            `
            jobs.appendChild(div)
            div.onclick = async function() {
                await showForm(div)
            }
        }
    })
}

window.onload = getJobs()