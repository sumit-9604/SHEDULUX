#pragma once
#include <queue>
#include "ISheduler.hpp"

using namespace std;

class RoundRobin : public ISheduler
{
private:
    int quantum;
    int timeSlice = 0;
    queue<int> readyQueue;

public:
    RoundRobin(int q) : quantum(q) {}

    int selectProcess(
        int currentTime,
        vector<Process> &processes,
        int currentRunning) override
    {
        // Add newly arrived processes
        for (int i = 0; i < processes.size(); i++)
        {
            if (processes[i].at == currentTime)
            {
                readyQueue.push(i);
            }
        }

        // If no running process, pick next
        if (currentRunning == -1)
        {
            if (!readyQueue.empty())
            {
                int next = readyQueue.front();
                readyQueue.pop();
                timeSlice = 0;
                return next;
            }
            return -1;
        }

        timeSlice++;

        // If process finished
        if (processes[currentRunning].remainingtime == 0)
        {
            timeSlice = 0;
            if (!readyQueue.empty())
            {
                int next = readyQueue.front();
                readyQueue.pop();
                return next;
            }
            return -1;
        }

        // If quantum expired
        if (timeSlice >= quantum)
        {
            readyQueue.push(currentRunning);

            if (!readyQueue.empty())
            {
                int next = readyQueue.front();
                readyQueue.pop();
                timeSlice = 0;
                return next;
            }
        }

        return currentRunning;
    }
};