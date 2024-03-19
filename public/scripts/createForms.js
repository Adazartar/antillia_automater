export function createForm1(form) {
    const div = document.createElement('div')
    div.innerHTML = `
    <div id="form1">
        <h2>Work Order Report</h2>
        <div>
            <label for="job_address">Job Address</label>
            <input type="text" id="job_address">
        </div>

        <div class="photocollection-form">
            <label for="outside">Front Elevation Image</label>
            <input id="outside" type="file" accept="image/jpg, image/jpeg" class="photos">
            <div name="selectedPhotos" class=""></div>
        </div>

        <div>
            <label for="account">Account</label>
            <input list="account" type="text" id="account" autocomplete="off" onclick=showOptions(this)>

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

        <button id="saveButton" onclick=saveData()>Save Data</button>
        <!-- <button onclick=fillData()>Fill Data</button> -->
        <button id='uploadBtn'>Upload</button>
        <br>
        <br>
        
    </div>`
    form.appendChild(div)
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
}