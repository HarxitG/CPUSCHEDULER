const { exec } = require("child_process");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

// POST endpoint to run scheduler
app.post("/runScheduler", async (req, res) => {
    try {
        const processes = [];
        const arrivalTimes = [];
        const burstTimes = [];

        // Extract process data from request body
        Object.keys(req.body).forEach((key) => {
            if (key.startsWith("processId")) {
                const index = key.slice("processId".length);
                const processId = req.body[`processId${index}`];
                const arrivalTime = req.body[`arrivalTime${index}`];
                const burstTime = req.body[`burstTime${index}`];

                processes.push({ processId, arrivalTime, burstTime });
                arrivalTimes.push(arrivalTime);
                burstTimes.push(burstTime);
            }
        });

        const algorithm = req.body.algorithm;

        // Validate inputs
        if (
            !algorithm ||
            arrivalTimes.length === 0 ||
            burstTimes.length === 0
        ) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        // Construct command to execute scheduler
        const command = `./scheduler ${algorithm} ${arrivalTimes.join(" ")} ${burstTimes.join(" ")}`;

        const { stdout, stderr } = await executeCommand(command);
        const outputData = stdout.toString();

        // Parse output from C++ program
        const parsedOutput = JSON.parse(outputData);
        res.json(parsedOutput);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Function to execute shell command
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Error executing command:", error);
                reject(error); // Reject with the actual error object
            } else {
                resolve({ stdout, stderr }); // Resolve with the output
            }
        });
    });
}

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
