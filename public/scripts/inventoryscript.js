
console.log("Heyo")

function generate(){
    const doc = fetch('http://localhost:3000/report');
    console.log("Document has been sent");
    console.log(doc);
}

async function saveData(){
    let data = await getData()
    localStorage.setItem("userDataInventory", JSON.stringify(data))
}

function fillData(){
    let storedData = localStorage.getItem("userDataInventory")
    if(storedData){
        let parsedData = JSON.parse(storedData)
        console.log(parsedData)

        document.getElementById('job_address').value = parsedData.job_address
        document.getElementById('account').value = parsedData.account
        document.getElementById('job_category').value = parsedData.job_category
        document.getElementById('start_time').value = parsedData.start_time
        document.getElementById('num_resources').value = parsedData.num_resources
        document.getElementById('date_damage').value = parsedData.date_damage
        document.getElementById('cause_dmg').value = parsedData.cause_dmg
        document.getElementById('attendence_num').value = parsedData.attendence_num
        document.getElementById('client_discussion').value = parsedData.client_discussion
        document.getElementById('matters_for_consideration').value = parsedData.matters_for_consideration
        document.getElementById('end_time').value = parsedData.end_time

        for(let i = 0; i < parsedData.items.length; i++){
            generateItem()
        }
        const divs = document.getElementsByClassName('item')

        for(let i = 0; i < parsedData.items.length; i++){
            divs[i].querySelector('.item_name').value = parsedData.items[i].item_name
            divs[i].querySelector('.room_name').value = parsedData.items[i].room_name
            divs[i].querySelector('.inventory_type').value = parsedData.items[i].inventory_type
            divs[i].querySelector('.item_desc_quan').value = parsedData.items[i].item_desc_quan
            divs[i].querySelector('.make_model_brand').value = parsedData.items[i].make_model_brand
            divs[i].querySelector('.serial_num').value = parsedData.items[i].serial_num
            divs[i].querySelector('.type_damage').value = parsedData.items[i].type_damage
            divs[i].querySelector('.damage_assessment').value = parsedData.items[i].damage_assessment
            divs[i].querySelector('.item_location').value = parsedData.items[i].item_location
            divs[i].querySelector('.comments').value = parsedData.items[i].comments
            const photosDiv = divs[i].querySelector('.selectedPhotos');
            parsedData.items[i].photos.forEach((base64Data, index) => {
                const photoElement = document.createElement('div');

                // Display the image name
                const fileNameElement = document.createElement('div');
                fileNameElement.textContent = `photo${index}`;  // Add the actual file name if available
                photoElement.appendChild(fileNameElement);

                const img = document.createElement('img');
                img.src = base64Data;
                photoElement.appendChild(img);

                // Add a delete button for each photo
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    // Handle delete functionality here
                    // For now, let's just remove the image from the DOM
                    photoElement.remove();
                });
                photoElement.appendChild(deleteButton);

                photosDiv.appendChild(photoElement);
            });
        }
    }
    else{
        console.log("No cached data")
    }
    
}

window.onload = fillData()

async function getData(){
    let data = {
        "job_address": document.getElementById('job_address').value,
        "account": document.getElementById('account').value,
        "job_category": document.getElementById('job_category').value,
        "start_time": document.getElementById('start_time').value,
        "num_resources": document.getElementById('num_resources').value,
        "date_damage": document.getElementById('date_damage').value,
        "cause_dmg": document.getElementById('cause_dmg').value,
        "attendence_num": document.getElementById('attendence_num').value,
        "client_discussion": document.getElementById('client_discussion').value,
        "matters_for_consideration": document.getElementById('matters_for_consideration').value,
        "items": await getDataItems(),
        "end_time": document.getElementById('end_time').value,
    }
    console.log(data)
    return data
}

async function getDataItems(){
    let itemElements = Array.from(document.getElementById("items").children)
    return Promise.all(itemElements.map(async (itemElement) => {
        let item = {
            "item_name": itemElement.querySelector('.item_name').value,
            "room_name": itemElement.querySelector('.room_name').value,
            "inventory_type": itemElement.querySelector('.inventory_type').value,
            "item_desc_quan": itemElement.querySelector('.item_desc_quan').value,
            "make_model_brand": itemElement.querySelector('.make_model_brand').value,
            "serial_num": itemElement.querySelector('.serial_num').value,
            "type_damage": itemElement.querySelector('.type_damage').value,
            "damage_assessment": itemElement.querySelector('.damage_assessment').value,
            "item_location": itemElement.querySelector('.item_location').value,
            "comments": itemElement.querySelector('.comments').value,
            "photos": await processPhotos(itemElement.querySelector('.photoroom')),
        }
        return item
    }))
}

function generateItem(){
    let div = document.createElement('div')
    div.innerHTML = `
    <div class="item">
        <button type="button" onclick="this.parentElement.remove()">Delete Item</button>
        <br>
        <br>
        <div>
            <label for="item_name">Item Name</label>
            <input type="text" class="item_name">
        </div>

        <div>
            <label for="room_name">Room Name</label>
            <input list="room_name" type="text" class="room_name" autocomplete="off" onclick=showOptions(this)>

            <div class="dropdown">

            </div>

            <datalist id="room_name">
                <option value="Master Bedroom"></option>
                <option value="WIR"></option>
                <option value="En-suite"></option>
                <option value="Bedroom 1"></option>
                <option value="Bedroom 2"></option>
                <option value="Bedroom 3"></option>
                <option value="Bathroom"></option>
                <option value="Hallway"></option>
                <option value="Laundry"></option>
                <option value="Living Room"></option>
                <option value="Dining Room"></option>
                <option value="Study"></option>
                <option value="Open Plan Kitchen/Living"></option>
                <option value="Kitchen"></option>
                <option value="Garage"></option>
            </datalist>

        </div>

        <div>
            <label for="inventory_type">Inventory Type</label>
            <select class="inventory_type">
                <option value="General">General</option>
                <option value="Electrical">Electrical</option>
            </select>
        </div>

        <div>
            <label for="item_desc_quan">Item Description & Quantity</label>
            <input type="text" class="item_desc_quan">
        </div>

        <div>
            <label for="make_model_brand">Make/Model/Brand</label>
            <input type="text" class="make_model_brand">
        </div>

        <div>
            <label for="serial_num">Serial Number</label>
            <input type="text" class="serial_num">
        </div>

        <div>
            <label for="type_damage">Type of Damage</label>
            <select class="type_damage">
                <option value="Water damaged">Water damaged</option>
                <option value="Sewerage damaged">Sewerage damaged</option>
                <option value="Mould affected">Mould affected</option>
                <option value="General poor condition">General poor condition</option>
                <option value="Scratched">Scratched</option>
                <option value="Thermally damaged">Thermally damaged</option>
                <option value="Dented">Dented</option>
                <option value="Parts missing">Parts missing</option>
                <option value="Impact damage">Impact damage</option>
                <option value="Corroded">Corroded</option>
                <option value="Fading">Fading</option>
                <option value="Not assessed">Not assessed</option>
                <option value="Unknown">Unknown</option>
            </select>
        </div>

        <div>
            <label for="damage_assessment">Damage Assessment</label>
            <select class="damage_assessment">
                <option value="Non-salvageable">Non-salvageable</option>
                <option value="Requires professional assessment">Requires professional assessment</option>
                <option value="Pre-existing damage">Pre-existing damage</option>
                <option value="Not claim related">Not claim related</option>
                <option value="Restored on site">Restored on site</option>
                <option value="Not claim related">Not claim related</option>
                <option value="Not assessed">Not assessed</option>
                <option value="Not affected">Not affected</option>
            </select>
        </div>

        <div>
            <label for="item_location">Item Location</label>
            <select class="item_location">
                <option value="Removed from site">Removed from site</option>
                <option value="On-site">On-site</option>
                <option value="Removal to be scheduled">Removal to be scheduled</option>
                <option value="Client removed item from site prior to assessment">Client removed item from site prior to assessment</option>
            </select>
        </div>

        <div>
            <label for="comments">Damage/Status Comments</label>
            <textarea type="text" class="comments"></textarea>
        </div>

        <div class="photoroom">
            <label for="photos">Photos</label>
            <input type="file" accept="image/jpg, image/jpeg" class="photos" multiple>
            <div class="selectedPhotos"></div>
        </div>
    </div>
    `
    document.getElementById('items').appendChild(div)
    setupFileInputs()
    
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


async function processPhotos(photosDiv) {
    return new Promise((resolve, reject) => {
        const existingImages = photosDiv.querySelectorAll('.selectedPhotos img');
        const base64Array = [];
        let processedCount = 0;

        if (existingImages.length === 0) {
            // If no images, resolve with an empty array
            resolve(base64Array);
        }

        existingImages.forEach((imgElement, index) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Create a new Image object to load the image
            const img = new Image();

            // Set up an event listener to handle image load
            img.onload = function () {
                // Set canvas dimensions to the image dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0, img.width, img.height);

                // Get the base64-encoded data URL
                const base64Data = canvas.toDataURL('image/jpeg');
                base64Array.push(base64Data);

                // Check if this is the last image
                processedCount++;
                if (processedCount === existingImages.length) {
                    resolve(base64Array);
                }
            };

            // Set up an event listener to handle image load errors
            img.onerror = function () {
                reject(new Error('Error loading image.'));
            };

            // Set the src attribute to start loading the image
            img.src = imgElement.src;
        });
    });
}


function processEmail() {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = "Sending email please wait"
    document.getElementById('form').appendChild(messageContainer);

    getData().then((data) => {
        // Create an array of Promises for generating zip files
        let zipPromises = data.items.map((item) => {
            const zip = new JSZip();

            // Add images to the zip file
            item.photos.forEach((imageData, j) => {
                zip.file(`image${j + 1}.jpg`, imageData.split(",")[1], { base64: true });
            });

            // Generate the zip content and push the promise to the array
            return zip.generateAsync({ type: "base64" });
        });

        // Wait for all zip files to be generated
        Promise.all(zipPromises)
            .then(zipContents => {
                // Attachments array for Email.send
                let attachments = zipContents.map((zipBase64, i) => {
                    return {
                        name: `${data.items[i].item_name}.zip`, // Assuming you want the zip file named after the item_name
                        data: zipBase64,
                        encoding: "base64"
                    };
                });

                
                // Send the email with SMTP.js
                Email.send({
                    SecureToken: "6bf2cac1-8cf6-4800-ba16-7ab9fece4418",
                    To: 'admin@antilliaemergencynetwork.com.au',
                    //To: 'therealadazartar@gmail.com',
                    From: "adamautomated39@gmail.com",
                    Subject: `${data.job_address}`,
                    Body: `
Job Address: ${data.job_address}<br>
Account: ${data.account}<br>
Job Category: ${data.job_category}<br>
Start Time: ${data.start_time}<br>
Number of Resources: ${data.num_resources}<br>
Date Damage Occurred: ${data.date_damage}<br>
Cause of Damage: ${data.cause_dmg}<br>
Attendence Number: ${data.attendence_num}<br>
Client Discussion: ${data.client_discussion}<br>
Matters for Consideration: ${data.matters_for_consideration}<br>
-----------------------------------------------------------------------------------------<br>
${generateItemText(data.items)}
End Time: ${data.end_time}<br><br>

                    `,
                    Attachments: attachments
                }).then(
                    message => {
                        if(message === 'OK'){
                            messageContainer.textContent = "Email sent successfully!";
                            localStorage.removeItem("userDataInventory")

                            
                        }
                        else{
                            messageContainer.textContent = "Email failed try again later"
                        }
                    }
                );
            })
            .catch(error => console.error(error));
    })
}

function generateItemText(data){
    let text = ""
    for(let i = 0; i < data.length; i++){
        text += `
Item Name: ${data[i].item_name}<br>
Room Name: ${data[i].room_name}<br>
Inventory Type: ${data[i].inventory_type}<br>
Item Description & Quantity: ${data[i].item_desc_quan}<br>
Make/Model/Brand: ${data[i].make_model_brand}<br>
Serial Number: ${data[i].serial_num}<br>
Type of Damage: ${data[i].type_damage}<br>
Damage Assessment: ${data[i].damage_assessment}<br>
Item Location: ${data[i].item_location}<br>
Damage/Status Comments: ${data[i].comments}<br>
-----------------------------------------------------------------------------------------<br>
`
    }
    return text
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
