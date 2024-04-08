var currentForm = ""

export async function saveForm() {
    var data = null
    if(currentForm == 'form1') {
        data = await getDataForm1()
    }

    data["id"] = document.getElementById("formContainer").classList[0]
    data["initial"] = false

    await fetch('/staff/jobs/submit', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    })
}

function uploadForm() {
    saveForm()
    //update form so submitted = true
    fetch('/staff/jobs/submitted',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "id":document.getElementById('formContainer').classList[0] }) //ID
    }).then((res) => {
        window.location.href = "/staff"
    })
}

function setupFileInputs(){
    const fileInputs = document.querySelectorAll('.photos');
    fileInputs.forEach(fileInput => {
        fileInput.addEventListener('change', handleFileSelect);
    });
}

async function uploadPhoto(input, container) {
    const file = input.files[0]

    const result = await fetch('/staff/get_photo_url').then(res => res.json())

    fetch(result.url, { 
        method: "PUT",
        headers: {
            "Content-Type": "image/jpeg"
        },
        body: file
    })

    container.classList.add(result.imageName)

    await saveForm()

    return result.imageName
}

async function handleFileSelect(event, newWidth = 800, newHeight = 640) {
    const fileInput = event.target;
    const photoDiv = fileInput.closest('.photocollection') || fileInput.closest('.photocollection-form');
    const photoContainer = photoDiv.querySelector('[name="selectedPhotos"]')
    const fileName = await uploadPhoto(fileInput, photoContainer)

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
            photoContainer.classList.remove(fileName)

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

function triggerDropdown(button){
    const parentDiv = button.parentNode.parentNode;
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

function generateRoom() {
    const num = document.getElementById('rooms').children.length
    let div = document.createElement('div')
    div.innerHTML = `
    <div class="room">
        <button type="button" onclick="this.parentElement.remove()">Delete Room</button>
        <br>
        <br>
        <div>
            <label for="room_name${num}">Room Name</label>
            <input id="room_name${num}" list="room_names${num}" type="text" class="room_name" autocomplete="off">

            <div class="dropdown">

            </div>

            <datalist id="room_names${num}">
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
            <label for="temperature${num}">Temperature (°C)</label>
            <input id="temperature${num}" type="number" class="temperature" min="1">
        </div>

        <div>
            <label for="relative_humidity${num}">Relative Humidity (%)</label>
            <input id="relative_humidity${num}" type="number" class="relative_humidity" min="1">
        </div>

        <div>
            <label for="dew_point${num}">Dew Point (°C)</label>
            <input id="dew_point${num}" type="number" class="dew_point" min="1">
        </div>

        <div>
            <label for="gpk${num}">GPK (g/kg)</label>
            <input id="gpk${num}" type="number" class="gpk" min="1">
        </div>

        <div>
            <label for="width${num}">Width (meters)</label>
            <input id="width${num}" type="number" class="width" min="1">
        </div>

        <div>
            <label for="length${num}">Length (meters)</label>
            <input id="length${num}" type="number" class="length" min="1">
        </div>

        <div>
            <label for="height${num}">Height (meters)</label>
            <input id="height${num}" type="number" class="height" min="1">
        </div>

        <div>
            <label for="room_dmg_percent${num}">Room Damage (%)</label>
            <input id="room_dmg_percent${num}" type="text" class="room_dmg_percent">
        </div>

        <div>
            <label for="flooring_type${num}">Flooring Type</label>
            <select id="flooring_type${num}" class="flooring_type">
                <option value="Carpet">Carpet</option>
                <option value="Carpet Tiles">Carpet Tiles</option>
                <option value="Tiles">Tiles</option>
                <option value="Floating boards">Floating boards</option>
                <option value="Laminated">Laminated</option>
                <option value="Vinyl">Vinyl</option>
                <option value="Direct Stick Vinyl">Direct Stick Vinyl</option>
                <option value="Engineered">Engineered</option>
                <option value="Hardwood">Hardwood</option>
                <option value="Parquetry">Parquetry</option>
                <option value="Direct Stick Timber">Direct Stick Timber</option>
                <option value="Concrete">Concrete</option>
                <option value="Soil">Soil</option>
                <option value="Other - See Findings">Other - See Findings</option>
                <option value="No Flooing Covering">No Flooing Covering</option>
            </select>
        </div>

        <div>
            <label for="carpet_type${num}">If Carpet, Carpet Type</label>
            <select id="carpet_type${num}" class="carpet_type">
                <option value="Wool">Wool</option>
                <option value="Nylon">Nylon</option>
                <option value="Polypropylene">Polypropylene</option>
                <option value="Polyester">Polyester</option>
                <option value="Olefin">Olefin</option>
                <option value="Acrylic">Acrylic</option>
                <option value="Carpet Tiles">Carpet Tiles</option>
                <option value="Axminister">Axminister</option>
                <option value="Other - Refer to findings">Other - Refer to findings</option>
                <option value="Not Applicable">Not Applicable</option>
            </select>
        </div>

        <div>
            <label for="underlay_type${num}">Type of Underlay</label>
            <select id="underlay_type${num}" class="underlay_type">
                <option value="Carpet not lifted - underlay not seen">Carpet not lifted - underlay not seen</option>
                <option value="Rubber - Fire rated">Rubber - Fire rated</option>
                <option value="Rubber - Not Fire Rated">Rubber - Not Fire Rated</option>
                <option value="Foam">Foam</option>
                <option value="Felt">Felt</option>
                <option value="No underlay">No underlay</option>
                <option value="Other">Other</option>
                <option value="Not Applicable">Not Applicable</option>
            </select>
        </div>

        <div>
            <label for="is_floor_restorable${num}">Is Flooring Restorable</label>
            <select id="is_floor_restorable${num}" class="is_floor_restorable">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Unsure">Unsure</option>
            </select>
        </div>

        <div>
            <label for="quantity_removed_floor${num}">Quantity of Flooring Removed (%)</label>
            <input id="quantity_removed_floor${num}" type="text" class="quantity_removed_floor">
        </div>

        <div class="checkbox-group">
            <div class="checkbox-header">
                <body class="left">Findings</body>
                <button class="right dropdown-button">Show</button>
            </div>
            <div class="collapsable-content">
                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Elevated humidity detected in the air" id="Elevated humidity detected in the air${num}">
                    <label for="Elevated humidity detected in the air${num}">Elevated humidity detected in the air</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Elevated moisture detected on flooring" id="Elevated moisture detected on flooring${num}">
                    <label for="Elevated moisture detected on flooring${num}">Elevated moisture detected on flooring</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Elevated moisture detected on sub-floor" id="Elevated moisture detected on sub-floor${num}">
                    <label for="Elevated moisture detected on sub-floor${num}">Elevated moisture detected on sub-floor</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Elevated moisture detected on skirting" id="Elevated moisture detected on skirting${num}">
                    <label for="Elevated moisture detected on skirting${num}">Elevated moisture detected on skirting</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Elevated moisture detected on plaster walls" id="Elevated moisture detected on plaster walls${num}">
                    <label for="Elevated moisture detected on plaster walls${num}">Elevated moisture detected on plaster walls</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Elevated moisture detected on ceiling" id="Elevated moisture detected on ceiling${num}">
                    <label for="Elevated moisture detected on ceiling${num}">Elevated moisture detected on ceiling</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Water staining evident on flooring" id="Water staining evident on flooring${num}">
                    <label for="Water staining evident on flooring${num}">Water staining evident on flooring</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Sewerage overflow affected flooring" id="Sewerage overflow affected flooring${num}">
                    <label for="Sewerage overflow affected flooring${num}">Sewerage overflow affected flooring</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Flooring has cupped/crowned" id="Flooring has cupped/crowned${num}">
                    <label for="Flooring has cupped/crowned${num}">Flooring has cupped/crowned</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Skirting boards have swelled" id="Skirting boards have swelled${num}">
                    <label for="Skirting boards have swelled${num}">Skirting boards have swelled</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Visible mould detected" id="Visible mould detected${num}">
                    <label for="Visible mould detected${num}">Visible mould detected</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Visible water staining on the ceiling" id="Visible water staining on the ceiling${num}">
                    <label for="Visible water staining on the ceiling${num}">Visible water staining on the ceiling</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Visible water staining on the walls" id="Visible water staining on the walls${num}">
                    <label for="Visible water staining on the walls${num}">Visible water staining on the walls</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Elevated moisture detected under the house/building" id="Elevated moisture detected under the house/building${num}">
                    <label for="Elevated moisture detected under the house/building${num}">Elevated moisture detected under the house/building</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Water detected under the house/building" id="Water detected under the house/building${num}">
                    <label for="Water detected under the house/building${num}">Water detected under the house/building</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Sewerage overflow affected outdoor areas" id="Sewerage overflow affected outdoor areas${num}">
                    <label for="Sewerage overflow affected outdoor areas${num}">Sewerage overflow affected outdoor areas</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Additional building damages observed" id="Additional building damages observed${num}">
                    <label for="Additional building damages observed${num}">Additional building damages observed</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Contents are affected" id="Contents are affected${num}">
                    <label for="Contents are affected${num}">Contents are affected</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Flooring returned dry readings" id="Flooring returned dry readings${num}">
                    <label for="Flooring returned dry readings${num}">Flooring returned dry readings</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Sub-floor returned dry readings" id="Sub-floor returned dry readings${num}">
                    <label for="Sub-floor returned dry readings${num}">Sub-floor returned dry readings</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Plaster walls returned dry readings" id="Plaster walls returned dry readings${num}">
                    <label for="Plaster walls returned dry readings${num}">Plaster walls returned dry readings</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Skirting boards returned dry readings" id="Skirting boards returned dry readings${num}">
                    <label for="Skirting boards returned dry readings${num}">Skirting boards returned dry readings</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="Ceiling returned dry readings" id="Ceiling returned dry readings${num}">
                    <label for="Ceiling returned dry readings${num}">Ceiling returned dry readings</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="All moisture readings are within acceptable parameters" id="All moisture readings are within acceptable parameters${num}">
                    <label for="All moisture readings are within acceptable parameters${num}">All moisture readings are within acceptable parameters</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="No damages found" id="No damages found${num}">
                    <label for="No damages found${num}">No damages found</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="All work completed on a previous attendance" id="All work completed on a previous attendance${num}">
                    <label for="All work completed on a previous attendance${num}">All work completed on a previous attendance</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="findings" value="No assessment required on this attendance" id="No assessment required on this attendance${num}">
                    <label for="No assessment required on this attendance${num}">No assessment required on this attendance</label>
                </div>
            </div>
        </div>

        <div>
            <label for="supporting_findings${num}">Supporting Findings</label>
            <textarea id="supporting_findings${num}" type="text" class="supporting_findings"></textarea>
        </div>

        <div class="checkbox-group">
            <div class="checkbox-header">
                <body class="left">Actions</body>
                <button class="right dropdown-button">Show</button>
            </div>
            <div class="collapsable-content">

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Completed assessment" id="Completed assessment${num}">
                    <label for="Completed assessment${num}">Completed assessment</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Undertook moisture readings" id="Undertook moisture readings${num}">
                    <label for="Undertook moisture readings${num}">Undertook moisture readings</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Obtained thermal images" id="Obtained thermal images${num}">
                    <label for="Obtained thermal images${num}">Obtained thermal images</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Moved furniture/contents" id="Moved furniture/contents${num}">
                    <label for="Moved furniture/contents${num}">Moved furniture/contents</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Extracted water" id="Extracted water${num}">
                    <label for="Extracted water${num}">Extracted water</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Installed equipment" id="Installed equipment${num}">
                    <label for="Installed equipment${num}">Installed equipment</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Removed and disposed of non-salvageable carpet" id="Removed and disposed of non-salvageable carpet${num}">
                    <label for="Removed and disposed of non-salvageable carpet${num}">Removed and disposed of non-salvageable carpet</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Removed and disposed of non-salvageable underlay" id="Removed and disposed of non-salvageable underlay${num}">
                    <label for="Removed and disposed of non-salvageable underlay${num}">Removed and disposed of non-salvageable underlay</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Removed and disposed of non-salvageable flooring" id="Removed and disposed of non-salvageable flooring${num}">
                    <label for="Removed and disposed of non-salvageable flooring${num}">Removed and disposed of non-salvageable flooring</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Removed and disposed of smooth edge" id="Removed and disposed of smooth edge${num}">
                    <label for="Removed and disposed of smooth edge${num}">Removed and disposed of smooth edge</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Cut, removed and disposed of affected plaster" id="Cut, removed and disposed of affected plaster${num}">
                    <label for="Cut, removed and disposed of affected plaster${num}">Cut, removed and disposed of affected plaster</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Drilled holes in kickers" id="Drilled holes in kickers${num}">
                    <label for="Drilled holes in kickers${num}">Drilled holes in kickers</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Removed and disposed of non-salvageable skirting boards" id="Removed and disposed of non-salvageable skirting boards${num}">
                    <label for="Removed and disposed of non-salvageable skirting boards${num}">Removed and disposed of non-salvageable skirting boards</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Cleaned sewage affected areas and treated with anti-microbial" id="Cleaned sewage affected areas and treated with anti-microbial${num}">
                    <label for="Cleaned sewage affected areas and treated with anti-microbial${num}">Cleaned sewage affected areas and treated with anti-microbial</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Set up containment(s)" id="Set up containment(s)${num}">
                    <label for="Set up containment(s)${num}">Set up containment(s)</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Contained visible mould" id="Contained visible mould${num}">
                    <label for="Contained visible mould${num}">Contained visible mould</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="PRV clean completed" id="PRV clean completed${num}">
                    <label for="PRV clean completed${num}">PRV clean completed</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Conducted Inventory" id="Conducted Inventory${num}">
                    <label for="Conducted Inventory${num}">Conducted Inventory</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Disposed of non-salvageable contents" id="Disposed of non-salvageable contents${num}">
                    <label for="Disposed of non-salvageable contents${num}">Disposed of non-salvageable contents</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Prepared Scope of Works" id="Prepared Scope of Works${num}">
                    <label for="Prepared Scope of Works${num}">Prepared Scope of Works</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="Prepared variation of Scope of Works" id="Prepared variation of Scope of Works${num}">
                    <label for="Prepared variation of Scope of Works${num}">Prepared variation of Scope of Works</label>
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="actions" value="No further work required" id="No further work required${num}">
                    <label for="No further work required${num}">No further work required</label>
                </div>
            </div>
        </div>
        
        <div>
            <label for="supporting_actions${num}">Supporting Actions</label>
            <textarea id="supporting_actions${num}" type="text" class="supporting_actions"></textarea>
        </div>

        <div class="checkbox-group">
            <div class="checkbox-header">
                <body class="left">Equipment</body>
                <button class="right dropdown-button">Show</button>
            </div>
            <div class="collapsable-content">

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="Air Mover" id="Air Mover${num}">
                    <label for="Air Mover${num}">Air Mover</label>
                </div>
                <div class="Air Mover-input" style="display: none;">
                    <label for="Air Mover-quantity${num}">Quantity:</label>
                    <input id="Air Mover-quantity${num}" type="number" class="Air Mover-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="Dehumidifiers" id="Dehumidifiers${num}">
                    <label for="Dehumidifiers${num}">Dehumidifiers</label>
                </div>
                <div class="Dehumidifiers-input" style="display: none;">
                    <label for="Dehumidifiers-quantity${num}">Quantity:</label>
                    <input id="Dehumidifiers-quantity${num}" type="number" class="Dehumidifiers-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="AFD's" id="AFD's${num}">
                    <label for="AFD's${num}">AFD's</label>
                </div>
                <div class="AFD's-input" style="display: none;">
                    <label for="AFD's-quantity${num}">Quantity:</label>
                    <input id="AFD's-quantity${num}" type="number" class="AFD's-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="Axial Drier" id="Axial Drier${num}">
                    <label for="Axial Drier${num}">Axial Drier</label>
                </div>
                <div class="Axial Drier-input" style="display: none;">
                    <label for="Axial Drier-quantity${num}">Quantity:</label>
                    <input id="Axial Drier-quantity${num}" type="number" class="Axial Drier-quantity" min="1">
                </div>

                <div class="checkbox-pair">
                    <input type="checkbox" class="equipment" value="Drying Matt" id="Drying Matt${num}">
                    <label for="Drying Matt${num}">Drying Matt</label>
                </div>
                <div class="Drying Matt-input" style="display: none;">
                    <label for="Drying Matt-quantity${num}">Quantity:</label>
                    <input id="Drying Matt-quantity${num}" type="number" class="Drying Matt-quantity" min="1">
                </div>
            </div>
        </div>

        <div class="photocollection">
            <label for="photos${num}">Photos</label>
            <input id="photos${num}" type="file" accept="image/jpg, image/jpeg" class="photos" multiple>
            <div name="selectedPhotos" class=""></div>
        </div>
    </div>
    `
    document.getElementById('rooms').appendChild(div)
    setupFileInputs()

    for(const dropdown of document.querySelectorAll('.dropdown-button')) {
        dropdown.onclick = function() {
            triggerDropdown(this)
        }
    }

    for(const checkbox of document.querySelectorAll('.equipment')) {
        checkbox.onchange = function() {
            toggleInput(this)
        }
    }

    document.getElementById(`room_name${num}`).onclick = function() {
        showOptions(document.getElementById(`room_name${num}`))
    }
}

async function getDataRooms(){
    let roomElements = Array.from(document.getElementById("rooms").children)
    roomElements = roomElements.filter(element => element.innerHTML.trim() !== '')
    return Promise.all(roomElements.map(async (roomElement) => {
        let room = {
            "room_name": roomElement.querySelector('.room_name').value,
            "temperature": roomElement.querySelector('.temperature').value,
            "relative_humidity": roomElement.querySelector('.relative_humidity').value,
            "dew_point": roomElement.querySelector('.dew_point').value,
            "gpk": roomElement.querySelector('.gpk').value,
            "width": roomElement.querySelector('.width').value,
            "length": roomElement.querySelector('.length').value,
            "height": roomElement.querySelector('.height').value,
            "room_dmg_percent": roomElement.querySelector('.room_dmg_percent').value,
            "flooring_type": roomElement.querySelector('.flooring_type').value,
            "carpet_type": roomElement.querySelector('.carpet_type').value,
            "underlay_type": roomElement.querySelector('.underlay_type').value,
            "is_floor_restorable": roomElement.querySelector('.is_floor_restorable').value,
            "quantity_removed_floor": roomElement.querySelector('.quantity_removed_floor').value,
            "findings": getCheckboxes('findings', roomElement),
            "supporting_findings": roomElement.querySelector('.supporting_findings').value,
            "actions": getCheckboxes('actions', roomElement),
            "supporting_actions": roomElement.querySelector('.supporting_actions').value,
            "equipment": getCheckboxesAndText('equipment', roomElement),
            "photos": getPhotos(roomElement.querySelector('.photocollection').querySelector('[name=selectedPhotos]'))
        }
        return room
    }))
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

function getPhotos(container) {
    try {
        return Array.from(container.classList)
    } catch {
        return []
    }
}

async function getDataForm1(){
    let data = {
        "job_address": document.getElementById('job_address').value,
        "outside": getPhotos(document.querySelector('.photocollection-form').querySelector('[name=selectedPhotos]')),
        "account": document.getElementById('account').value,
        "job_category": document.getElementById('job_category').value,
        "start_time": document.getElementById('start_time').value,
        "num_resources": document.getElementById('num_resources').value,
        "date_damage": document.getElementById('date_damage').value,
        "cause_dmg": document.getElementById('cause_dmg').value,
        "attendance_num": document.getElementById('attendance_num').value,
        "client_discussion": document.getElementById('client_discussion').value,
        "water_damage_class": document.getElementById('water_damage_class').value,
        "water_damage_category": document.getElementById('water_damage_category').value,
        "outdoor_temperature": document.getElementById('outdoor_temperature').value,
        "outdoor_relative_humidity": document.getElementById('outdoor_relative_humidity').value,
        "outdoor_dew_point": document.getElementById('outdoor_dew_point').value,
        "outdoor_gpk": document.getElementById('outdoor_gpk').value,
        "rooms": await getDataRooms(),
        "other_equipment": document.getElementById('other_equipment').value,
        "next_steps": document.getElementById('next_steps').value,
        "next_steps_typing": document.getElementById('next_steps_typing').value,
        "other_trades": document.getElementById('other_trades').value,
        "other_trades_typing": document.getElementById('other_trades_typing').value,
        "matters_for_consideration": document.getElementById('matters_for_consideration').value,
        "accomodation": document.getElementById('accomodation').value,
        "estimated_equipment_pickup": document.getElementById('estimated_equipment_pickup').value,
        "end_time": document.getElementById('end_time').value,
    }
    return data
}

export function createForm1(form, id) {
    const div = document.createElement('div')
    div.id = "formContainer"
    div.innerHTML = `
    <div id="form1">
        <div id="formHeader">
            <h2>Work Order Report</h2>  
            <button id="saveBtn">Save Button</button>
        </div>
        
        <div>
            <label for="job_address">Job Address</label>
            <input type="text" id="job_address">
        </div>

        <div class="photocollection-form">
            <label for="outside">Front Elevation Image</label>
            <input id="outside" type="file" accept="image/jpg, image/jpeg" class="photos">
            <div name="selectedPhotos"></div>
        </div>

        <div>
            <label for="account">Account</label>
            <input list="account" type="text" id="account" autocomplete="off">

            <div class="dropdown">

            </div>

            <datalist id="account">
                <option value="ANT Renovations"></option>
                <option value="Emergency Trade Services"></option>
                <option value="Johns Lyng Group"></option>
                <option value="RestorX Major Loss Pty Ltd"></option>
                <option value="Rizon Commercial"></option>
                <option value="Total Construction and Maintenance Solutions"></option>
                <option value="Private"></option>
            </datalist>

        </div>

        <div>
            <label for="job_category">Job Category</label>
            <select id="job_category">
                <option value="Water Damage Restoration">Water Damage Restoration</option>
                <option value="Mould Remediation">Mould Remediation</option>
                <option value="Fire Damage Restoration">Fire Damage Restoration</option>
                <option value="Commerical Cleaning">Commerical Cleaning</option>
            </select>
        </div>

        <div>
            <label for="start_time">Start Time</label>
            <input type="datetime-local" id="start_time">
        </div>

        <div>
            <label for="num_resources">Number of Resources</label>
            <input type="number" id="num_resources" min="1">
        </div>

        <div>
            <label for="date_damage">Date Damage Occurred</label>
            <input type="date" id="date_damage">
        </div>

        <div>
            <label for="cause_dmg">Cause of Damage</label>
            <input type="text" id="cause_dmg">
        </div>

        <div>
            <label for="attendance_num">Attendance Number</label>
            <input type="number" id="attendance_num" min="1">
        </div>

        <div>
            <label for="client_discussion">Client Discussion</label>
            <textarea type="text" id="client_discussion"></textarea>
        </div>

        <div>
            <label for="water_damage_class">Water Damage Class</label>
            <select id="water_damage_class">
                <option value="Not Applicable">Not Applicable</option>
                <option value="Class 1- Least amount of water absorption and evaporation load">Class 1- Least amount of water absorption and evaporation load</option>
                <option value="Class 2 - Significant amount of water absorption and evaporation load">Class 2 - Significant amount of water absorption and evaporation load</option>
                <option value="Class 3 - Greatest amount of water absorption and evaporation load">Class 3 - Greatest amount of water absorption and evaporation load</option>
                <option value="Class 4 - Deeply held or bound water">Class 4 - Deeply held or bound water</option>
            </select>
        </div>

        <div>
            <label for="water_damage_category">Water Damage Category</label>
            <select id="water_damage_category">
                <option value="Not Applicable">Not Applicable</option>
                <option value="Category 1 - Clean Water">Category 1 - Clean Water</option>
                <option value="Category 2 - Grey Water">Category 2 - Grey Water</option>
                <option value="Category 3 - Black Water">Category 3 - Black Water</option>
            </select>
        </div>

        <div>
            <label for="outdoor_temperature">Outdoor Temperature (°C)</label>
            <input type="number" id="outdoor_temperature" min="1">
        </div>

        <div>
            <label for="outdoor_relative_humidity">Outdoor Relative Humidity (%)</label>
            <input type="number" id="outdoor_relative_humidity" min="1">
        </div>

        <div>
            <label for="outdoor_dew_point">Outdoor Dew Point (°C)</label>
            <input type="number" id="outdoor_dew_point" min="1">
        </div>

        <div>
            <label for="outdoor_gpk">Outdoor GPK (g/kg)</label>
            <input type="number" id="outdoor_gpk" min="1">
        </div>

        <div id="rooms"></div>

        <button id='roomBtn'>Add Room</button>
        <br>
        <br>
        <div>
            <label for="other_equipment">Other equipment left on site (e.g Bins, RCD's, extension lead)</label>
            <textarea type="text" id="other_equipment"></textarea>
        </div>

        <div>
            <label for="next_steps">Next Steps</label>
            <select id="next_steps">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Unsure">Unsure</option>
            </select>
        </div>

        <div>
            <label for="next_steps_typing">Comments (What work is required from us?)</label>
            <textarea type="text" id="next_steps_typing"></textarea>
        </div>

        <div>
            <label for="other_trades">Other Trades</label>
            <select id="other_trades">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Unsure">Unsure</option>
            </select>
        </div>

        <div>
            <label for="other_trades_typing">Comments (What work is required from other trades?)</label>
            <textarea type="text" id="other_trades_typing"></textarea>
        </div>

        <div>
            <label for="matters_for_consideration">Matters For Consideration</label>
            <textarea type="text" id="matters_for_consideration"></textarea>
        </div>

        <div>
            <label for="accomodation">Accomodation Y/N - Days</label>
            <input type="text" id="accomodation">
        </div>

        <div>
            <label for="estimated_equipment_pickup">Estimated Equipment Pickup</label>
            <input type="date" id="estimated_equipment_pickup">
        </div>

        <div>
            <label for="end_time">End Time</label>
            <input type="datetime-local" id="end_time">
        </div>

        <button id='uploadBtn'>Upload</button>
        <br>
        <br>
        
    </div>`
    div.classList.add(id)
    form.appendChild(div)

    setupFileInputs()

    document.getElementById("saveBtn").addEventListener('click', saveForm)
    document.getElementById("account").onclick = function() {
        showOptions(document.getElementById("account"))
    }
    document.getElementById("roomBtn").addEventListener('click', generateRoom)
    document.getElementById("uploadBtn").addEventListener('click', uploadForm)

    currentForm = 'form1'

    fillDataForm1(id)
}

async function fillDataForm1(id) {
    let parsedData = null

    await fetch('/staff/jobs/getForm', {
        method:"POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({ "id":id })
    }).then(res => res.json())
    .then(data => {
        parsedData = data
    })

    if(parsedData){
        document.getElementById('job_address').value = parsedData.job_address
        //work order number
        //attendance number
        if(!parsedData.initial) {
            if(parsedData.outside.length !== 0){
                const photoDiv = document.querySelector('[name=selectedPhotos]');
                photoDiv.classList.add(parsedData.outside[0])
                const photoElement = document.createElement('div');

                // Display the image name
                const fileNameElement = document.createElement('p');
                fileNameElement.textContent = parsedData.outside[0];  // Add the actual file name if available
                photoElement.appendChild(fileNameElement);

                const img = document.createElement('img');
                img.src = "https://antillia-forms.s3.ap-southeast-2.amazonaws.com/" + parsedData.outside[0];
                photoElement.appendChild(img);

                // Add a delete button for each photo
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    // Handle delete functionality here
                    // For now, let's just remove the image from the DOM
                    photoDiv.remove(parsedData.outside[0])
                    photoElement.remove();
                });
                photoElement.appendChild(deleteButton);

                photoDiv.appendChild(photoElement);
            }

            document.getElementById('account').value = parsedData.account
            document.getElementById('job_category').value = parsedData.job_category
            document.getElementById('start_time').value = parsedData.start_time
            document.getElementById('num_resources').value = parsedData.num_resources
            document.getElementById('date_damage').value = parsedData.date_damage
            document.getElementById('cause_dmg').value = parsedData.cause_dmg
            document.getElementById('attendance_num').value = parsedData.attendance_num
            document.getElementById('client_discussion').value = parsedData.client_discussion
            document.getElementById('water_damage_class').value = parsedData.water_damage_class
            document.getElementById('water_damage_category').value = parsedData.water_damage_category
            document.getElementById('outdoor_temperature').value = parsedData.outdoor_temperature
            document.getElementById('outdoor_relative_humidity').value = parsedData.outdoor_relative_humidity
            document.getElementById('outdoor_dew_point').value = parsedData.outdoor_dew_point
            document.getElementById('outdoor_gpk').value = parsedData.outdoor_gpk
            document.getElementById('other_equipment').value = parsedData.other_equipment
            document.getElementById('next_steps').value = parsedData.next_steps
            document.getElementById('next_steps_typing').value = parsedData.next_steps_typing
            document.getElementById('other_trades').value = parsedData.other_trades
            document.getElementById('other_trades_typing').value = parsedData.other_trades_typing
            document.getElementById('matters_for_consideration').value = parsedData.matters_for_consideration
            document.getElementById('accomodation').value = parsedData.accomodation
            document.getElementById('estimated_equipment_pickup').value = parsedData.estimated_equipment_pickup
            document.getElementById('end_time').value = parsedData.end_time
            
            for(let i = 0; i < parsedData.rooms.length; i++){
                generateRoom()
            }
            const divs = document.getElementsByClassName('room')

            for(let i = 0; i < parsedData.rooms.length; i++){
                divs[i].querySelector('.room_name').value = parsedData.rooms[i].room_name
                divs[i].querySelector('.temperature').value = parsedData.rooms[i].temperature
                divs[i].querySelector('.relative_humidity').value = parsedData.rooms[i].relative_humidity
                divs[i].querySelector('.dew_point').value = parsedData.rooms[i].dew_point
                divs[i].querySelector('.gpk').value = parsedData.rooms[i].gpk
                divs[i].querySelector('.width').value = parsedData.rooms[i].width
                divs[i].querySelector('.length').value = parsedData.rooms[i].length
                divs[i].querySelector('.height').value = parsedData.rooms[i].height
                divs[i].querySelector('.room_dmg_percent').value = parsedData.rooms[i].room_dmg_percent
                divs[i].querySelector('.flooring_type').value = parsedData.rooms[i].flooring_type
                divs[i].querySelector('.carpet_type').value = parsedData.rooms[i].carpet_type
                divs[i].querySelector('.underlay_type').value = parsedData.rooms[i].underlay_type
                divs[i].querySelector('.is_floor_restorable').value = parsedData.rooms[i].is_floor_restorable
                divs[i].querySelector('.quantity_removed_floor').value = parsedData.rooms[i].quantity_removed_floor
                fillCheckboxes(parsedData.rooms[i].findings, 'findings', divs[i])
                divs[i].querySelector('.supporting_findings').value = parsedData.rooms[i].supporting_findings
                fillCheckboxes(parsedData.rooms[i].actions, 'actions', divs[i])
                divs[i].querySelector('.supporting_actions').value = parsedData.rooms[i].supporting_actions
                fillCheckboxesAndText(parsedData.rooms[i].equipment, 'equipment', divs[i])
                const photosDiv = divs[i].querySelector('[name=selectedPhotos]');
                parsedData.rooms[i].photos.forEach((name) => {
                    photosDiv.classList.add(name)
                    const photoElement = document.createElement('div');

                    // Display the image name
                    const fileNameElement = document.createElement('p');
                    fileNameElement.innerText = name;  // Add the actual file name if available
                    photoElement.appendChild(fileNameElement);

                    const img = document.createElement('img');
                    img.src = "https://antillia-forms.s3.ap-southeast-2.amazonaws.com/" + name;
                    photoElement.appendChild(img);

                    // Add a delete button for each photo
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => {
                        // Handle delete functionality here
                        // For now, let's just remove the image from the DOM
                        photosDiv.classList.remove(name)
                        photoElement.remove();
                    });
                    photoElement.appendChild(deleteButton);

                    photosDiv.appendChild(photoElement);
                });
            }
        }
    }
    else{
        console.log("No cached data")
    }
}

export function createForm2(form) {
    const div = document.createElement('div')
    div.innerHTML = `
    <div id="form2">
        <h2>Work Order Report</h2>
        <div>
            <label for="job_address">Job Address</label>
            <input type="text" id="job_address">
        </div>

        <div class="photocollection-form">
            <label for="outside">Front Elevation Image</label>
            <input id='outside' type="file" accept="image/jpg, image/jpeg" class="photos">
            <div name="selectedPhotos" class=""></div>
        </div>

        <div>
            <label for="account">Account</label>
            <input list="account" type="text" id="account" autocomplete="off">

            <div class="dropdown">

            </div>

            <datalist id="account">
                <option value="ANT Renovations"></option>
                <option value="Emergency Trade Services"></option>
                <option value="Johns Lyng Group"></option>
                <option value="RestorX Major Loss Pty Ltd"></option>
                <option value="Rizon Commercial"></option>
                <option value="Total Construction and Maintenance Solutions"></option>
                <option value="Private"></option>
            </datalist>

        </div>

        <div>
            <label for="start_time">Start Time</label>
            <input type="datetime-local" id="start_time">
        </div>

        <div>
            <label for="num_resources">Number of Resources</label>
            <input type="number" id="num_resources" min="1">
        </div>

        <div>
            <label for="attendence_num">Attendance Number</label>
            <input type="number" id="attendence_num" min="1">
        </div>

        <div>
            <label for="client_discussion">Client Discussion</label>
            <textarea type="text" id="client_discussion"></textarea>
        </div>

        <div>
            <label for="outdoor_temperature">Outdoor Temperature (°C)</label>
            <input type="number" id="outdoor_temperature" min="1">
        </div>

        <div>
            <label for="outdoor_relative_humidity">Outdoor Relative Humidity (%)</label>
            <input type="number" id="outdoor_relative_humidity" min="1">
        </div>

        <div>
            <label for="outdoor_dew_point">Outdoor Dew Point (°C)</label>
            <input type="number" id="outdoor_dew_point" min="1">
        </div>

        <div>
            <label for="outdoor_gpk">Outdoor GPK (g/kg)</label>
            <input type="number" id="outdoor_gpk" min="1">
        </div>

        <div id="rooms"></div>
        <button id="roomBtn">Add Room</button>
        <br>

        <div id="existing_rooms">
            <div></div>
        </div>
        <button id="exisitingRoomBtn">Add Exisiting Room</button>
        <br>
        <br>
        
        <div>
            <label for="other_equipment">Other equipment left on site (e.g Bins, RCD's, extension lead)</label>
            <textarea type="text" id="other_equipment"></textarea>
        </div>

        <div>
            <label for="next_steps">Next Steps</label>
            <select id="next_steps">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Unsure">Unsure</option>
            </select>
        </div>

        <div>
            <label for="next_steps_typing">Comments (What work is required from us?)</label>
            <textarea type="text" id="next_steps_typing"></textarea>
        </div>

        <div>
            <label for="other_trades">Other Trades</label>
            <select id="other_trades">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Unsure">Unsure</option>
            </select>
        </div>

        <div>
            <label for="other_trades_typing">Comments (What work is required from other trades?)</label>
            <textarea type="text" id="other_trades_typing"></textarea>
        </div>

        <div>
            <label for="matters_for_consideration">Matters For Consideration</label>
            <textarea type="text" id="matters_for_consideration"></textarea>
        </div>

        <div>
            <label for="accomodation">Accomodation Y/N - Days</label>
            <input type="text" id="accomodation">
        </div>

        <div>
            <label for="estimated_equipment_pickup">Estimated Equipment Pickup</label>
            <input type="date" id="estimated_equipment_pickup">
        </div>

        <div>
            <label for="end_time">End Time</label>
            <input type="datetime-local" id="end_time">
        </div>

        <button id="saveButton" onclick=saveData()>Save Data</button>
        <!-- <button onclick=fillData()>Fill Data</button> -->
        <button id="uploadBtn">Upload</button>
        <br>
        <br>
        
    </div>`
    form.appendChild(div)

    currentForm = 'form2'
}