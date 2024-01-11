const eventNameText = document.getElementById("attendance__name");
const attendeeListUL = document.getElementById("attendee-list");
const submitButton = document.getElementById("submit-button");

let rows = [];

function checkInput() {
    if (eventNameText.value.trim() === "") {
      submitButton.style.display = "none";
    } else {
      submitButton.style.display = "block";
    }
}

function load__Data__List(dataListValue) {
    attendeeListUL.innerHTML = '';
    if(dataListValue === "manual") {
        const listItem = document.createElement('li');
        const nameTextbox = document.createElement('input');
        nameTextbox.setAttribute('type', 'text');
        nameTextbox.setAttribute('id', 'manual-name');
        nameTextbox.setAttribute('placeholder', 'Enter attendee name');
        
        const addButton = document.createElement('button');
        addButton.textContent = 'Enter';
        addButton.addEventListener('click', () => {
            const manualName = nameTextbox.value.trim();
            if (manualName !== "") {
                const manualListItem = document.createElement('li');
                manualListItem.innerHTML = `
                    <input type="checkbox" id="checkbox-manual" />
                    <label for="checkbox-manual">${manualName}</label>
                `;
                attendeeListUL.appendChild(manualListItem);
                nameTextbox.value = ''; // Clear the textbox after adding
            }
        });
        
        listItem.appendChild(nameTextbox);
        listItem.appendChild(addButton);
        attendeeListUL.appendChild(listItem);
    } else {
        fetch('data/' + dataListValue)  // Change to the path of your CSV file
        .then(response => response.text())
        .then(data => {
            rows = data.split('\n');

            let counter = 0;  // Initialize a counter for unique IDs

            rows.forEach(row => {
                const attendeeName = row.split(',')[0];  // Extract attendee name

                const listItem = document.createElement('li');
                const checkboxId = `checkbox-${counter}`;  // Create unique checkbox ID
                listItem.innerHTML = `
                    <input type="checkbox" id="${checkboxId}" />
                    <label for="${checkboxId}">${attendeeName}</label>
                `;
                attendeeListUL.appendChild(listItem);

                counter++;  // Increment counter for next attendee
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }
}

// Handle submit button click
submitButton.addEventListener("click", () => {
    const selectedAttendees = [];

    // Gather selected attendees from the generated checkboxes
    rows.forEach((row, index) => {
        const checkbox = document.getElementById(`checkbox-${index}`);
        if (checkbox.checked) {
            selectedAttendees.push(row);
        }
    });

    // Gather manually entered attendees from the manual checkboxes
    const manualCheckboxes = document.querySelectorAll('#checkbox-manual');
    manualCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedAttendees.push(checkbox.nextElementSibling.textContent);
        }
    });

    // Prepare data for download
    const pageTitle = document.querySelector('h1').textContent + ' ' + document.querySelector('p').textContent + ' ' + document.getElementById('attendance__name').value + ':';
    const dataToDownload = pageTitle + '\n\n' + selectedAttendees.join('\n');

    // Create and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataToDownload));
    downloadLink.setAttribute('download', pageTitle + '.txt');
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log("Attendees:", selectedAttendees);
    alert("Attendance Downloaded!");
});