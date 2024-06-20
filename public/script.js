// Ensure addProcess function correctly adds new process inputs
function addProcess() {
    const processInputs = document.getElementById('processInputs');
    const newProcessInput = document.createElement('div');
    newProcessInput.classList.add('process-input');
    newProcessInput.innerHTML = `
        <label for="processId">Process ID:</label>
        <input type="text" class="processId" name="processId" required>
        <label for="arrivalTime">Arrival Time:</label>
        <input type="text" class="arrivalTime" name="arrivalTime" required>
        <label for="burstTime">Burst Time:</label>
        <input type="text" class="burstTime" name="burstTime" required>
    `;
    processInputs.appendChild(newProcessInput);
}

async function submitForm() {
    const formData = new FormData();
    const processInputs = document.querySelectorAll('.process-input');

    processInputs.forEach((input, index) => {
        const processId = input.querySelector('.processId').value;
        const arrivalTime = input.querySelector('.arrivalTime').value;
        const burstTime = input.querySelector('.burstTime').value;

        formData.append(`processId${index}`, processId);
        formData.append(`arrivalTime${index}`, arrivalTime);
        formData.append(`burstTime${index}`, burstTime);
    });

    const algorithm = document.getElementById('algorithm').value;
    formData.append('algorithm', algorithm);

    try {
        const response = await fetch('/runScheduler', {
            method: 'POST',
            body: formData
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayOutput(data);
    } catch (error) {
        console.error('Error:', error);
        // Handle error here, e.g., display an error message to the user
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error occurred while processing your request.';
        errorMessage.style.color = 'red';
        document.getElementById('output').appendChild(errorMessage);
    }
}




function displayOutput(data) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <h2>Output:</h2>
        <table>
            <tr>
                <th>Process ID</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Completion Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
            </tr>
            ${data.tableRows}
        </table>

        <div class="gantt-chart">
            <!-- Display Gantt chart here -->
            ${data.ganttChart}
        </div>

        <p>CPU Utilization: ${data.cpuUtilization}%</p>
    `;
}
