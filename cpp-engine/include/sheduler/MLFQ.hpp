#pragma once
#include <vector>
#include "ISheduler.hpp"

using namespace std;

class MLFQ : public ISheduler
{
private:
    vector<int> queueLevel;
    vector<int> timeUsed;

    int q0 = 2;
    int q1 = 4;

public:
    int selectProcess(
        int currentTime,
        vector<Process> &processes,
        int currentRunning
    ) override
    {

        if (queueLevel.size() != processes.size())
        {
            queueLevel.resize(processes.size(), 0);
            timeUsed.resize(processes.size(), 0);
        }

        int idx = -1;
        int bestLevel = 1e9;

        for (int i = 0; i < processes.size(); i++)
        {
            auto &p = processes[i];

            if (p.at <= currentTime && p.remainingtime > 0)
            {
                if (queueLevel[i] < bestLevel)
                {
                    bestLevel = queueLevel[i];
                    idx = i;
                }
            }
        }

        if (idx != -1)
        {
            timeUsed[idx]++;

            if (queueLevel[idx] == 0 && timeUsed[idx] >= q0)
            {
                queueLevel[idx] = 1;
                timeUsed[idx] = 0;
            }
            else if (queueLevel[idx] == 1 && timeUsed[idx] >= q1)
            {
                queueLevel[idx] = 2;
                timeUsed[idx] = 0;
            }
        }

        return idx;
    }
};