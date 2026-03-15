#pragma once
#include "../models/process.hpp"
#include <vector>

class MetricesCalculator
{
public:
    static double avgWaiting(vector<Process> &p)
    {
        double sum = 0;
        for (auto &x : p)
        {
            sum += x.wt;
        }
        return sum / p.size();
    }

    static double avgTurnaround(vector<Process> &p)
    {
        double sum = 0;

        for (auto &x : p)
        {
            sum += x.tat;
        }
        return sum / p.size();
    }
};