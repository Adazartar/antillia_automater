
console.log("Heyo")

function generate(){
    const doc = fetch('http://localhost:3000/report');
    console.log("Document has been sent");
    console.log(doc);
}

async function saveData(){
    let data = await getData()
    localStorage.setItem("userDataScope", JSON.stringify(data))
}

function fillData(){
    let storedData = localStorage.getItem("userDataScope")
    if(storedData){
        let parsedData = JSON.parse(storedData)
        console.log(parsedData)

        document.getElementById('job_address').value = parsedData.job_address
        document.getElementById('account').value = parsedData.account
        document.getElementById('job_category').value = parsedData.job_category
        document.getElementById('matters_for_consideration').value = parsedData.matters_for_consideration
        fillCheckboxes(parsedData.other_trades_req, 'other_trades_req', document)
        document.getElementById('other_trades_req_comments').value = parsedData.other_trades_req_comments
        document.getElementById('num_resources_1').value = parsedData.num_resources_1
        document.getElementById('num_hours_1').value = parsedData.num_hours_1
        document.getElementById('num_resources_2').value = parsedData.num_resources_2
        document.getElementById('num_hours_2').value = parsedData.num_hours_2
        document.getElementById('num_resources_3').value = parsedData.num_resources_3
        document.getElementById('num_hours_3').value = parsedData.num_hours_3
        document.getElementById('num_resources_4').value = parsedData.num_resources_4
        document.getElementById('num_hours_4').value = parsedData.num_hours_4
        document.getElementById('est_disposal').value = parsedData.est_disposal

        for(let i = 0; i < parsedData.rooms.length; i++){
            generateRoom()
        }
        const divs = document.getElementsByClassName('room')

        for(let i = 0; i < parsedData.rooms.length; i++){
            divs[i].querySelector('.room_name').value = parsedData.rooms[i].room_name
            divs[i].querySelector('.scope_works').value = parsedData.rooms[i].scope_works
            fillCheckboxesAndText(parsedData.rooms[i].materials_req, 'materials_req', divs[i])
            divs[i].querySelector('.materials_comments').value = parsedData.rooms[i].materials_comments
            fillCheckboxesAndTextx2(parsedData.rooms[i].equipment, 'equipment', divs[i])
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
        "matters_for_consideration": document.getElementById('matters_for_consideration').value,
        "other_trades_req": getCheckboxes('other_trades_req', document),
        "other_trades_req_comments": document.getElementById('other_trades_req_comments').value,
        "num_resources_1": document.getElementById('num_resources_1').value,
        "num_hours_1": document.getElementById('num_hours_1').value,
        "num_resources_2": document.getElementById('num_resources_2').value,
        "num_hours_2": document.getElementById('num_hours_2').value,
        "num_resources_3": document.getElementById('num_resources_3').value,
        "num_hours_3": document.getElementById('num_hours_3').value,
        "num_resources_4": document.getElementById('num_resources_4').value,
        "num_hours_4": document.getElementById('num_hours_4').value,
        "est_disposal": document.getElementById('est_disposal').value,
        "rooms": await getDataRooms(),
    }
    console.log(data)
    return data
}

async function getDataRooms(){
    let roomElements = Array.from(document.getElementById("rooms").children)
    return Promise.all(roomElements.map(async (roomElement) => {
        let room = {
            "room_name": roomElement.querySelector('.room_name').value,
            "scope_works": roomElement.querySelector('.scope_works').value,
            "materials_req": getCheckboxesAndText('materials_req', roomElement),
            "materials_comments": roomElement.querySelector('.materials_comments').value,
            "equipment": getCheckboxesAndTextx2('equipment', roomElement),
        }
        return room
    }))
}

function generateRoom(){
    let div = document.createElement('div')
    div.innerHTML = `
    <div class="room">
        <button type="button" onclick="this.parentElement.remove()">Delete Item</button>
        <br>
        <br>
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
            <label for="scope_works">Scope of Works</label>
            <textarea type="text" class="scope_works"></textarea>
        </div>

        <div class="checkbox-group">
            <label for="materials_req">Materials Required</label>
            <button class="dropdown-button" onclick=triggerDropdown(this)>Show</button>
            <br>
            <div class="collapsable-content">
                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Containment Plastic" onchange="toggleInput(this)">
                    <label for="Containment Plastic">Containment Plastic</label>
                </div>
                <div class="Containment Plastic-input" style="display: none;">
                    <label for="Containment Plastic-quantity">Quantity:</label>
                    <select class="Containment Plastic-quantity">
                        <option value="2m">2m</option>
                        <option value="3m">3m</option>
                        <option value="4m">4m</option>
                    </select>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Zip Poles" onchange="toggleInput(this)">
                    <label for="Zip Poles">Zip Poles</label>
                </div>
                <div class="Zip Poles-input" style="display: none;">
                    <label for="Zip Poles-quantity">Quantity:</label>
                    <select class="Zip Poles-quantity">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Zippers" onchange="toggleInput(this)">
                    <label for="Zippers">Zippers</label>
                </div>
                <div class="Zippers-input" style="display: none;">
                    <label for="Zippers-quantity">Quantity:</label>
                    <input type="number" class="Zippers-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Masking Tape" onchange="toggleInput(this)">
                    <label for="Masking Tape">Masking Tape</label>
                </div>
                <div class="Masking Tape-input" style="display: none;">
                    <label for="Masking Tape-quantity">Quantity:</label>
                    <input type="number" class="Masking Tape-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Bonding Tape" onchange="toggleInput(this)">
                    <label for="Bonding Tape">Bonding Tape</label>
                </div>
                <div class="Bonding Tape-input" style="display: none;">
                    <label for="Bonding Tape-quantity">Quantity:</label>
                    <input type="number" class="Bonding Tape-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Percide" onchange="toggleInput(this)">
                    <label for="Percide">Percide</label>
                </div>
                <div class="Percide-input" style="display: none;">
                    <label for="Percide-quantity">Litres:</label>
                    <input type="number" class="Percide-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Percide boost" onchange="toggleInput(this)">
                    <label for="Percide boost">Percide boost</label>
                </div>
                <div class="Percide boost-input" style="display: none;">
                    <label for="Percide boost-quantity">Litres:</label>
                    <input type="number" class="Percide boost-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Anti-microbial solution" onchange="toggleInput(this)">
                    <label for="Anti-microbial solution">Anti-microbial solution</label>
                </div>
                <div class="Anti-microbial solution-input" style="display: none;">
                    <label for="Anti-microbial solution-quantity">Litres:</label>
                    <input type="number" class="Anti-microbial solution-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Disposal Bags" onchange="toggleInput(this)">
                    <label for="Disposal Bags">Disposal Bags</label>
                </div>
                <div class="Disposal Bags-input" style="display: none;">
                    <label for="Disposal Bags-quantity">Quantity:</label>
                    <input type="number" class="Disposal Bags-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Hard floor protection" onchange="toggleInput(this)">
                    <label for="Hard floor protection">Hard floor protection</label>
                </div>
                <div class="Hard floor protection-input" style="display: none;">
                    <label for="Hard floor protection-quantity">Meters:</label>
                    <input type="number" class="Hard floor protection-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Fire Sponges" onchange="toggleInput(this)">
                    <label for="Fire Sponges">Fire Sponges</label>
                </div>
                <div class="Fire Sponges-input" style="display: none;">
                    <label for="Fire Sponges-quantity">Quantity:</label>
                    <input type="number" class="Fire Sponges-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="materials_req" value="Cross Fire" onchange="toggleInput(this)">
                    <label for="Cross Fire">Cross Fire</label>
                </div>
                <div class="Cross Fire-input" style="display: none;">
                    <label for="Cross Fire-quantity">Litres:</label>
                    <input type="number" class="Cross Fire-quantity" min="1">
                </div>

            </div>
        </div>

        <div>
            <label for="materials_comments">Comments (Specify any other required materials)</label>
            <textarea type="text" class="materials_comments"></textarea>
        </div>

        <div class="checkbox-group">
            <label for="equipment">Equipment</label>
            <button class="dropdown-button" onclick=triggerDropdown(this)>Show</button>
            <br>
            <div class="collapsable-content">

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="Air Mover" onchange="toggleInput(this)">
                    <label for="Air Mover">Air Mover</label>
                </div>
                <div class="Air Mover-input" style="display: none;">
                    <label for="Air Mover-quantity">Quantity:</label>
                    <input type="number" class="Air Mover-quantity" min="1">
                    <label for="Air Mover-days">Number of Days:</label>
                    <input type="number" class="Air Mover-days" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="Dehumidifiers" onchange="toggleInput(this)">
                    <label for="Dehumidifiers">Dehumidifiers</label>
                </div>
                <div class="Dehumidifiers-input" style="display: none;">
                    <label for="Dehumidifiers-quantity">Quantity:</label>
                    <input type="number" class="Dehumidifiers-quantity" min="1">
                    <label for="Dehumidifiers-days">Number of Days:</label>
                    <input type="number" class="Dehumidifiers-days" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="AFD's" onchange="toggleInput(this)">
                    <label for="AFD's">AFD's</label>
                </div>
                <div class="AFD's-input" style="display: none;">
                    <label for="AFD's-quantity">Quantity:</label>
                    <input type="number" class="AFD's-quantity" min="1">
                    <label for="AFD's-days">Number of Days:</label>
                    <input type="number" class="AFD's-days" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="Axial Drier" onchange="toggleInput(this)">
                    <label for="Axial Drier">Axial Drier</label>
                </div>
                <div class="Axial Drier-input" style="display: none;">
                    <label for="Axial Drier-quantity">Quantity:</label>
                    <input type="number" class="Axial Drier-quantity" min="1">
                    <label for="Axial Drier-days">Number of Days:</label>
                    <input type="number" class="Axial Drier-days" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="Drying Matt" onchange="toggleInput(this)">
                    <label for="Drying Matt">Drying Matt</label>
                </div>
                <div class="Drying Matt-input" style="display: none;">
                    <label for="Drying Matt-quantity">Quantity:</label>
                    <input type="number" class="Drying Matt-quantity" min="1">
                    <label for="Drying Matt-days">Number of Days:</label>
                    <input type="number" class="Drying Matt-days" min="1">
                </div>
            </div>
        </div>
    </div>
    `
    document.getElementById('rooms').appendChild(div)
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

function getCheckboxesAndTextx2(checkbox_parent, doc){
    let checkedVals = []
    let inputElements = doc.getElementsByClassName(checkbox_parent)
    for(let i=0; i < inputElements.length; i++){
        if(inputElements[i].checked){
            const inputField = doc.getElementsByClassName(`${inputElements[i].value}-quantity`)[0]
            const inputField2 = doc.getElementsByClassName(`${inputElements[i].value}-days`)[0]
            checkedVals.push([inputElements[i].value, inputField.value, inputField2.value])
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

function fillCheckboxesAndTextx2(items, checkbox_parent, doc) {
    let inputElements = doc.getElementsByClassName(checkbox_parent);
    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < inputElements.length; j++) {
            if (items[i][0] === inputElements[j].value) {
                inputElements[j].checked = true;

                // Correctly construct the class name for the quantity element
                const quantityClassName = `${items[i][0]}-quantity`;
                const daysClassName = `${items[i][0]}-days`;

                // Access the quantity element by class name
                const quantityElement = doc.getElementsByClassName(quantityClassName)[0];
                const daysElement = doc.getElementsByClassName(daysClassName)[0];

                // Set the value of the quantity element
                quantityElement.value = items[i][1];
                daysElement.value = items[i][2];

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
Matters for Consideration: ${data.matters_for_consideration}<br>
Other Trades Required: ${data.other_trades_req}<br>
Comments: ${data.other_trades_req_comments}<br>
Attendence 1: ${data.num_resources_1*data.num_hours_1} hours<br>
Attendence 2: ${data.num_resources_2*data.num_hours_2} hours<br>
Attendence 3: ${data.num_resources_3*data.num_hours_3} hours<br>
Attendence 4: ${data.num_resources_4*data.num_hours_4} hours<br>
Totals hours: ${data.num_resources_1*data.num_hours_1+data.num_resources_2*data.num_hours_2+data.num_resources_3*data.num_hours_3+data.num_resources_4*data.num_hours_4} hours<br>
Estimated Disposal: ${data.est_disposal}<br>
-----------------------------------------------------------------------------------------<br>
${generateRoomText(data.rooms)}
<br><br>

                    `,
        }).then(
            message => {
                if(message === 'OK'){
                    messageContainer.textContent = "Email sent successfully!";
                    localStorage.removeItem("userDataScope")

                    
                }
                else{
                    messageContainer.textContent = "Email failed try again later"
                }
            }
        );
    })
    .catch(error => console.error(error));
}


function generateRoomText(data){
    let text = ""
    for(let i = 0; i < data.length; i++){
        text += `
Room Name: ${data[i].room_name}<br>
Scope of Works: ${data[i].scope_works}<br>
Materials Required: ${data[i].materials_req}<br>
Comments: ${data[i].materials_comments}<br>
Equipment (type/quantity/days req): ${data[i].equipment}<br>
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
    const checkBoxPair = checkbox.parentNode

    const parentDiv = checkBoxPair.parentNode

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
