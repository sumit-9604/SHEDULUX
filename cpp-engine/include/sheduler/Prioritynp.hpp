#pragma once
#include <vector>
#include "ISheduler.hpp"
using namespace std;

class Prioritynp : public ISheduler
{
public:
    int selectProcess(
        int currentTime,
        vector<Process> &processes,
        int currentRunning
        ) override
    {

        if (currentRunning != -1 && processes[currentRunning].remainingtime > 0)
        {
            return currentRunning;
        }
        int idx = -1;
        int best = 1e9;

        for (int i = 0; i < processes.size(); i++)
        {
            auto &p = processes[i];

            if (p.at <= currentTime && p.remainingtime > 0)
            {
                if (p.priority < best)
                {
                    best = p.priority;
                    idx = i;
                }
            }
        }

        return idx;
    }
};