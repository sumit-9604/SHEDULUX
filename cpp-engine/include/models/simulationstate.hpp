#pragma once
#include <vector>
#include "process.hpp"
using namespace std;

struct Simulationstate{
    int currenttime = 0;
    int runningprocessindex = -1;
    int contextswitches = 0;
    vector<Process> processes; 
};