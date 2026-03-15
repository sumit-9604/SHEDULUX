#pragma once
#include <vector>
#include "ISheduler.hpp"
using namespace std;

class SRTF : public ISheduler
{
public:
    int selectProcess(
        int currentTime,
        vector<Process> &processes,
        int currentRunning

        ) override
    {
        int idx = -1;
        int shortest = 1e9;

        for (int i = 0; i < processes.size(); i++)
        {
            auto &p = processes[i];

            if (p.at <= currentTime && p.remainingtime > 0)
            {
                if (p.remainingtime < shortest)
                {
                    shortest = p.remainingtime;
                    idx = i;
                }
            }
        }
        return idx;
    }
};