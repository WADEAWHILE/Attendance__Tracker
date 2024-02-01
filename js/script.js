const eventNameText = document.getElementById("attendance__name");
const attendeeListUL = document.getElementById("attendee-list");
const downloadForm = document.getElementById("downloadForm");
const submitButton = document.getElementById("submit-button");
const fileTypeSelector = document.getElementById("fileType");

let rows = [];
let manualCounter = 0; // Counter for unique manual entry IDs

function checkInput() {
    if (eventNameText.value.trim() === "") {
        downloadForm.style.display = "none";
    } else {
        downloadForm.style.display = "block";
    }
}

function load__Data__List(dataListValue) {
    attendeeListUL.innerHTML = '';
    if (dataListValue === "manual") {
        const listItem = document.createElement('li');
        const nameTextbox = document.createElement('input');
        nameTextbox.setAttribute('type', 'text');
        nameTextbox.setAttribute('placeholder', 'Enter attendee name');
        
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.addEventListener('click', () => {
            const manualName = nameTextbox.value.trim();
            if (manualName !== "") {
                const manualListItem = document.createElement('li');
                const checkboxId = `checkbox-manual-${manualCounter++}`; // Unique ID for manual entries
                manualListItem.innerHTML = `
                    <input type="checkbox" id="${checkboxId}" />
                    <label for="${checkboxId}">${manualName}</label>
                `;
                attendeeListUL.appendChild(manualListItem);
                nameTextbox.value = ''; // Clear the textbox after adding
            }
        });
        
        listItem.appendChild(nameTextbox);
        listItem.appendChild(addButton);
        attendeeListUL.appendChild(listItem);
    } else {
        fetch('data/' + dataListValue)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            rows = data.split('\n');
            let counter = 0;
            rows.forEach(row => {
                const attendeeName = row.split(',')[0];
                const listItem = document.createElement('li');
                const checkboxId = `checkbox-${counter++}`;
                listItem.innerHTML = `
                    <input type="checkbox" id="${checkboxId}" />
                    <label for="${checkboxId}">${attendeeName}</label>
                `;
                attendeeListUL.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }
}

submitButton.addEventListener("click", () => {
    const selectedAttendees = [];
    rows.forEach((row, index) => {
        const checkbox = document.getElementById(`checkbox-${index}`);
        if (checkbox && checkbox.checked) {
            selectedAttendees.push(row);
        }
    });

    // Gather manually entered attendees
    document.querySelectorAll('[id^="checkbox-manual-"]').forEach(checkbox => {
        if (checkbox.checked) {
            selectedAttendees.push(checkbox.nextElementSibling.textContent);
        }
    });

    const fileType = fileTypeSelector.value;
    const headerTitle = `Attendance for ${eventNameText.value}`;
    const pageTitle = `${document.querySelector('h1').textContent} ${document.querySelector('p').textContent} ${eventNameText.value}`;
    let dataToDownload = '';
    let fileName = `${pageTitle}.${fileType}`;

    if (fileType === 'txt') {
        dataToDownload = headerTitle + '\nName\n' + selectedAttendees.join('\n');
        triggerDownload('data:text/plain;charset=utf-8,' + encodeURIComponent(dataToDownload), fileName);
    } else if (fileType === 'csv') {
        const csvHeader = headerTitle + '\nName';
        const csvRows = selectedAttendees.map(attendee => `"${attendee}"`).join('\n');
        dataToDownload = `${csvHeader}\n${csvRows}`;
        triggerDownload('data:text/csv;charset=utf-8,' + encodeURIComponent(dataToDownload), fileName);
    } else if (fileType === 'xlsx') {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([[headerTitle], ['Name'], ...selectedAttendees.map(attendee => [attendee.split(',')[0]])]);
        XLSX.utils.book_append_sheet(workbook, worksheet, headerTitle);
        XLSX.writeFile(workbook, fileName); // This automatically triggers the download
    }

    console.log("Attendees:", selectedAttendees);
    alert("Attendance Downloaded!");
});

function triggerDownload(url, fileName) {
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}