#pragma once
#include "sheduler/ISheduler.hpp"
#include "../models/simulationstate.hpp"
#include "./TimelineRecorder.hpp"

class SimulationEngine{
    private:
        Simulationstate state;
        ISheduler *scheduler;

        TimelineRecorder recorder;

    public:
        SimulationEngine(
            vector<Process> processes,
            ISheduler *scheduler
        );
        
        void run();
        TimelineRecorder getTimeline();
        vector <Process> getprocesses();
};