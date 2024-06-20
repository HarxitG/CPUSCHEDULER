#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>

using namespace std;

struct Process {
    int id;
    int arrivalTime;
    int burstTime;
    int priority;
    int startTime;
    int completionTime;
    int turnaroundTime;
    int waitingTime;
};

bool sortByArrivalTime(const Process &a, const Process &b) {
    return a.arrivalTime < b.arrivalTime;
}

bool sortByBurstTime(const Process &a, const Process &b) {
    return a.burstTime < b.burstTime;
}

bool sortByPriority(const Process &a, const Process &b) {
    return a.priority < b.priority;
}

void calculateCompletionTimes(vector<Process> &processes, string algorithm) {
    int currentTime = 0;

    if (algorithm == "FCFS") {
        for (auto &process : processes) {
            process.startTime = currentTime;
            process.completionTime = currentTime + process.burstTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnaroundTime - process.burstTime;
            currentTime = process.completionTime;
        }
    } else if (algorithm == "SJF") {
        sort(processes.begin(), processes.end(), sortByBurstTime);
        for (auto &process : processes) {
            process.startTime = currentTime;
            process.completionTime = currentTime + process.burstTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnaroundTime - process.burstTime;
            currentTime = process.completionTime;
        }
    } else if (algorithm == "Priority") {
        sort(processes.begin(), processes.end(), sortByPriority);
        for (auto &process : processes) {
            process.startTime = currentTime;
            process.completionTime = currentTime + process.burstTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnaroundTime - process.burstTime;
            currentTime = process.completionTime;
        }
    } else if (algorithm == "RoundRobin") {
        // Implement Round Robin algorithm if needed
        // Assume quantum time, context switch, etc.
    }
}

void printGanttChart(const vector<Process> &processes) {
    cout << "Gantt Chart:\n";
    int currentTime = processes.front().startTime;
    cout << " ";
    for (const auto &process : processes) {
        for (int i = currentTime; i < process.startTime; ++i) {
            cout << "-";
        }
        for (int i = process.startTime; i < process.completionTime; ++i) {
            cout << "P" << process.id;
        }
        currentTime = process.completionTime;
    }
    cout << "\n";
}


int main(int argc, char *argv[]) {
    if (argc < 3) {
        cerr << "Usage: " << argv[0] << " <algorithm> <arrivalTime1> <burstTime1> [<arrivalTime2> <burstTime2> ...]\n";
        return 1;
    }

    string algorithm = argv[1];
    vector<Process> processes;

    // Number of processes
    int n = (argc - 2) / 2; // Each process has arrivalTime and burstTime

    for (int i = 0; i < n; ++i) {
        Process process;
        process.id = i + 1;

        // Convert arrivalTime and burstTime from command line arguments
        process.arrivalTime = atoi(argv[2 + i * 2]);
        process.burstTime = atoi(argv[3 + i * 2]);

        processes.push_back(process);
    }

    // Calculate completion times based on selected algorithm
    calculateCompletionTimes(processes, algorithm);

    // Output results
    cout << "Algorithm: " << algorithm << "\n";
    cout << setw(10) << "Process" << setw(15) << "Completion" << setw(15) << "Turnaround" << setw(15) << "Waiting" << "\n";
    for (const auto &process : processes) {
        cout << setw(10) << process.id << setw(15) << process.completionTime << setw(15) << process.turnaroundTime << setw(15) << process.waitingTime << "\n";
    }

    // Print Gantt chart
    printGanttChart(processes);

    return 0;
}
