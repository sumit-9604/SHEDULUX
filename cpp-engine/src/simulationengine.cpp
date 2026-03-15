#include "../include/engine/SimulationEngine.hpp"

SimulationEngine::SimulationEngine(
    vector<Process> processes,
    ISheduler *scheduler)
{
    state.processes = processes;
    this->scheduler = scheduler;

    // initialize remaining time
    for (auto &p : state.processes)
    {
        p.remainingtime = p.bt;
    }
}

void SimulationEngine::run()
{
    int completed = 0;

    while (completed < state.processes.size())
    {
        if (state.runningprocessindex != -1 &&
            state.processes[state.runningprocessindex].remainingtime <= 0)
        {
            state.runningprocessindex = -1;
        }
        int idx = scheduler->selectProcess(
            state.currenttime,
            state.processes,
            state.runningprocessindex);

        if (idx != -1)
        {
            state.runningprocessindex = idx;
        }

        if (state.runningprocessindex != -1)
        {
            auto &p = state.processes[state.runningprocessindex];

            if (p.starttime == -1)
            {
                p.starttime = state.currenttime;
            }

            p.remainingtime--;

            recorder.record(state.currenttime, p.id);

            if (p.remainingtime == 0)
            {
                p.completiontime = state.currenttime + 1;
                p.tat = p.completiontime - p.at;
                p.wt = p.tat - p.bt;

                completed++;
                
            }
        }
        else
        {
            recorder.record(state.currenttime, "IDLE");
        }

        state.currenttime++;
    }
}

TimelineRecorder SimulationEngine::getTimeline()
{
    return recorder;
}

std::vector<Process> SimulationEngine::getprocesses()
{
    return state.processes;
}