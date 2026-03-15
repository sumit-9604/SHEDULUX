#pragma once
#include "ISheduler.hpp"
#include <vector>
#include <climits>

using namespace std;

class SJF : public ISheduler
{
public:
    int selectProcess(
        int currentTime,
        vector<Process> &processes,
        int currentRunning) override
    {
        if (currentRunning != -1  && processes[currentRunning].remainingtime>0)
            return currentRunning;
        int idx = -1;
        int shortest = INT_MAX;

        for (int i = 0; i < processes.size(); i++)
        {
            auto &p = processes[i];

            if (p.at <= currentTime && p.remainingtime > 0)
            {
                if (p.bt < shortest)
                {
                    shortest = p.bt;
                    idx = i;
                }
            }
        }
        return idx;
    }
};