#pragma once
#include <vector>
#include "ISheduler.hpp"

using namespace std;

class MultilevelQueue : public ISheduler
{
public:
    int selectProcess(
        int currentTime,
        vector<Process> &processes,
        int currentRunning
    ) override
    {
        // ✅ Keep running if not finished (non-preemptive within queue)
        if (currentRunning != -1 && processes[currentRunning].remainingtime > 0)
            return currentRunning;

        int idx = -1;
        int bestQueue = INT_MAX;  // ✅ use INT_MAX not 1e9

        for (int i = 0; i < (int)processes.size(); i++)
        {
            auto &p = processes[i];

            if (p.at <= currentTime && p.remainingtime > 0)
            {
                if (p.queueLevel < bestQueue)  // ✅ queueLevel not priority
                {
                    bestQueue = p.queueLevel;
                    idx = i;
                }
            }
        }

        return idx;
    }
};