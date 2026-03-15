#pragma once
#include "ISheduler.hpp"

class FCFS : public ISheduler{
    public:
        int selectProcess(
            int currenttime,
            vector<Process>&processes,
            int currentrunning
        )override{

            if (currentrunning!= -1){
                return currentrunning;}
            
            int idx = -1;
            int earliest = 1e9;
            
            for (int i = 0; i < processes.size(); i++)
            {
                auto &p = processes[i];

                if (p.at <= currenttime && p.remainingtime > 0)
                {
                    if (p.at<earliest)
                    {
                        earliest = p.at;
                        idx = i;
                    }
                }               
            }
            return idx;
        }
};