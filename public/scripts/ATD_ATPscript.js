


function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    signature_draw.width = signature_draw.offsetWidth * ratio;
    signature_draw.height = signature_draw.offsetHeight * ratio;
    signature_draw.getContext("2d").scale(ratio, ratio);
}

const signature_draw = document.getElementById('signature');

window.onresize = resizeCanvas;
resizeCanvas();

const signaturePad = new SignaturePad(signature_draw);

document.getElementById('clear').addEventListener('click', function () {
    signaturePad.clear();
});

console.log("Heyo")

function generate(){
    const doc = fetch('http://localhost:3000/report');
    console.log("Document has been sent");
    console.log(doc);
}

async function saveData(){
    let data = await getData()
    localStorage.setItem("userDataATD_ATP", JSON.stringify(data))
}

function fillData() {

    let storedData = localStorage.getItem("userDataATD_ATP");
    if (storedData) {
        let parsedData = JSON.parse(storedData);
        console.log(parsedData);

        document.getElementById('client_address').value = parsedData.client_address;
        document.getElementById('client_name').value = parsedData.client_name;
        document.getElementById('client_type').value = parsedData.client_type;

        // Handle signature
        if (parsedData.signature) {
            // If there is a signature, clear the pad and load the new data
            signaturePad.clear();
            signaturePad.fromDataURL(parsedData.signature);
        }

        document.getElementById('date').value = parsedData.date;
        document.getElementById('time_stamp').value = parsedData.time_stamp;
    } else {
        console.log("No cached data");
    }
}

window.onload = function () {
    fillData();

    // Set up the clear button event listener
    document.getElementById('clear').addEventListener('click', function () {
        signaturePad.clear();
    });
};

async function getData(){
    let data = {
        "client_address": document.getElementById('client_address').value,
        "client_name": document.getElementById('client_name').value,
        "client_type": document.getElementById('client_type').value,
        "signature": await processCanvasToBase64('signature'),
        "date": document.getElementById('date').value,
        "time_stamp": document.getElementById('time_stamp').value,
    }
    console.log(data)
    return data
}


function getCheckboxes(checkbox_parent, doc){
    let checkedVals = []
    let inputElements = doc.getElementsByClassName(checkbox_parent)
    for(let i=0; i < inputElements.length; i++){
        if(inputElements[i].checked){
            checkedVals.push(inputElements[i].value)
        }
    }
    return checkedVals
}

function getCheckboxesAndText(checkbox_parent, doc){
    let checkedVals = []
    let inputElements = doc.getElementsByClassName(checkbox_parent)
    for(let i=0; i < inputElements.length; i++){
        if(inputElements[i].checked){
            const inputField = doc.getElementsByClassName(`${inputElements[i].value}-quantity`)[0]
            checkedVals.push([inputElements[i].value, inputField.value])
        }
    }
    return checkedVals
}

function fillCheckboxes(items, checkbox_parent, doc){
    let inputElements = doc.getElementsByClassName(checkbox_parent)
    for(let i=0; i < items.length; i++){
        for(let j=0; j < inputElements.length; j++){
            if(items[i] === inputElements[j].value){
                inputElements[j].checked = true
                break
            }
        }
    }
}

function fillCheckboxesAndText(items, checkbox_parent, doc) {
    let inputElements = doc.getElementsByClassName(checkbox_parent);
    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < inputElements.length; j++) {
            if (items[i][0] === inputElements[j].value) {
                inputElements[j].checked = true;

                // Correctly construct the class name for the quantity element
                const quantityClassName = `${items[i][0]}-quantity`;

                // Access the quantity element by class name
                const quantityElement = doc.getElementsByClassName(quantityClassName)[0];

                // Set the value of the quantity element
                quantityElement.value = items[i][1];

                // Correctly construct the class name for the input element
                const inputClassName = `${items[i][0]}-input`;

                // Access the input element by class name
                const inputElement = doc.getElementsByClassName(inputClassName)[0];

                // Show the input element
                inputElement.style.display = 'block';

                break;
            }
        }
    }
}


async function processCanvasToBase64() {
    return new Promise((resolve, reject) => {
        if (!signature_draw) {
            reject(new Error('Canvas not found with the specified ID.'));
            return;
        }

        const base64Data = signaturePad.toDataURL('image/png');
        
        if (!base64Data || base64Data.length === 0) {
            reject(new Error('Failed to convert canvas to base64.'));
            return;
        }

        resolve(base64Data);
    });
}


function processEmail() {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = "Sending email, please wait";
    document.getElementById('form').appendChild(messageContainer);

    getData().then((data) => {
        // Attach signature as an attachment
        const signatureAttachment = {
            name: 'signature.png',
            data: data.signature.split(",")[1],  // Assuming data.signature is a base64 string
            encoding: 'base64',
        };

        // Send the email with SMTP.js
        Email.send({
            SecureToken: "6bf2cac1-8cf6-4800-ba16-7ab9fece4418",
            To: 'admin@antilliaemergencynetwork.com.au',
            //To: 'therealadazartar@gmail.com',
            From: "adamautomated39@gmail.com",
            Subject: `${data.client_address}`,
            Body: `
Client Address: ${data.client_address}<br>
Client Name: ${data.client_name}<br>
Client Type: ${data.client_type}<br>
Date: ${data.date}<br>
Time Stamp: ${data.time_stamp}<br>
            `,
            Attachments: [signatureAttachment],  // Attach the signature
        }).then(
            message => {
                if (message === 'OK') {
                    messageContainer.textContent = "Email sent successfully!";
                    localStorage.removeItem("userDataATD_ATP");
                } else {
                    messageContainer.textContent = "Email failed. Try again later."
                }
            }
        );
    });
}

function handleFileSelect(event, newWidth = 800, newHeight = 640) {
    const fileInput = event.target;
    const itemDiv = fileInput.closest('.photoroom');
    const photoContainer = itemDiv.querySelector('.selectedPhotos');

    // Display selected photos for the specific item
    for (const file of fileInput.files) {
        const photoElement = document.createElement('div');

        // Display the image name
        const fileNameElement = document.createElement('div');
        fileNameElement.textContent = file.name;
        photoElement.appendChild(fileNameElement);

        const imgElement = document.createElement('img');
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // Calculate the aspect ratio to maintain proportions
                const aspectRatio = img.width / img.height;
                let imgHeight = newHeight;
                let imgWidth = newWidth;

                // Calculate the new dimensions while preserving aspect ratio
                if (aspectRatio > 1) {
                    imgHeight = newWidth / aspectRatio;
                } else {
                    imgWidth = newHeight * aspectRatio;
                }

                // Set imgElement dimensions
                imgElement.width = imgWidth;
                imgElement.height = imgHeight;

                // Display the processed image
                imgElement.src = resizeImage(img, imgWidth, imgHeight);
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);

        // Append the image element to the container
        photoElement.appendChild(imgElement);

        // Add a remove button for each photo
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            // Remove the associated photo when the button is clicked
            photoElement.remove();

            // Remove the corresponding file from the file input
            const newFiles = Array.from(fileInput.files).filter(f => f !== file);
            updateFileInput(fileInput, newFiles);
        });

        // Append the remove button to the container
        photoElement.appendChild(removeButton);
        photoContainer.appendChild(photoElement);
    }
}

function resizeImage(img, newWidth, newHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to the new dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw the resized image onto the canvas
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // Get the base64-encoded data URL
    return canvas.toDataURL('image/jpeg');
}

function updateFileInput(fileInput, files) {
    // Clear the existing files in the input
    fileInput.value = null;

    // Create a new DataTransfer object and add the files
    const dataTransfer = new DataTransfer();
    files.forEach(file => {
        dataTransfer.items.add(file);
    });

    // Update the file input with the new files
    fileInput.files = dataTransfer.files;
}

function setupFileInputs(){
    const fileInputs = document.querySelectorAll('.photos');
    fileInputs.forEach(fileInput => {
        fileInput.addEventListener('change', handleFileSelect);
    });
}

setupFileInputs()

function triggerDropdown(button){
    const parentDiv = button.parentNode;
    const dropdown = parentDiv.querySelectorAll('.collapsable-content')
    const displayVal = window.getComputedStyle(dropdown[0]).getPropertyValue('display')

    if(displayVal === 'block'){
        dropdown[0].style.display = 'none'
        button.textContent = "Show"
    }
    else {
        dropdown[0].style.display = 'block'
        button.textContent = "Hide"
    }
}

function showOptions(input) {
    const parentDiv = input.parentNode;
    const datalist = parentDiv.querySelector('datalist');
    const dropdown = parentDiv.querySelector('.dropdown');
    const datalistOptions = datalist.getElementsByTagName('option');

    // Show the dropdown
    dropdown.style.display = 'block';
    dropdown.style.width = input.offsetWidth + 'px';

    // Clear previous options
    dropdown.innerHTML = '';

    // Update the dropdown options based on the datalist
    for (var i = 0; i < datalistOptions.length; i++) {
        var optionValue = datalistOptions[i].value;

        // Create a div for each option
        var optionDiv = document.createElement('div');
        optionDiv.textContent = optionValue;

        // Add a click event listener to set the selected value in the input
        optionDiv.addEventListener('click', function () {
            input.value = this.textContent;
            dropdown.style.display = 'none'; // Hide the dropdown after selection
        });

        // Append the option div to the dropdown
        dropdown.appendChild(optionDiv);
    }

    // Hide the dropdown when clicking outside the input and dropdown
    document.addEventListener('click', function (e) {
        if (e.target !== dropdown && e.target !== input) {
            dropdown.style.display = 'none';
        }
    });
}

function toggleInput(checkbox) {

    // Get the specific input associated with the checkbox
    const parentDiv = checkbox.parentNode

    const inputField = parentDiv.getElementsByClassName(`${checkbox.value}-input`)[0];

    // Check if the checkbox is checked
    if (checkbox.checked) {
        // Show the additional input field
        inputField.style.display = 'block';
    } else {
        // Hide the additional input field if the checkbox is unchecked
        inputField.style.display = 'none';
    }

}

function calculateTimeDifference(startDateTime, endDateTime) {
    // Parse the input strings into Date objects
    const startTime = new Date(startDateTime);
    const endTime = new Date(endDateTime);

    // Calculate the difference in milliseconds
    const timeDifference = endTime - startTime;

    // Calculate hours and minutes
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hours and ${minutes} minutes`;
}

