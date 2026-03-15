#include <iostream>
#include <fstream>
#include <memory>
#include <nlohmann/json.hpp>

#include "../include/utils/jsonhandler.hpp"

#include "../include/sheduler/FCFS.hpp"
#include "../include/sheduler/SJF.hpp"
#include "../include/sheduler/SRTF.hpp"
#include "../include/sheduler/Prioritynp.hpp"
#include "../include/sheduler/Priorityp.hpp"
#include "../include/sheduler/RoundRobin.hpp"
#include "../include/sheduler/MultilevelQueue.hpp"
#include "../include/sheduler/MLFQ.hpp"

#include "../include/engine/SimulationEngine.hpp"

using namespace std;
using json = nlohmann::json;

int main()
{
    cout << "SCHEDULUX CPU ENGINE RUNNING\n";

    try
    {
        // Read JSON input
        json input;
        cin >> input;

        cout << "JSON RECEIVED:\n";
        cout << input.dump(4) << endl;

        // Parse processes
        auto processes = JsonHandler::parseProcesses(input);

        if (processes.empty())
            throw runtime_error("No processes provided");

        // Read algorithm name
        string algo = input.value("algorithm", "FCFS");

        cout << "ALGORITHM SELECTED: " << algo << endl;

        // Round Robin quantum support
        int quantum = input.value("quantum", 2);

        // Scheduler pointer
        unique_ptr<ISheduler> scheduler;

        if (algo == "FCFS")
            scheduler = make_unique<FCFS>();

        else if (algo == "SJF")
            scheduler = make_unique<SJF>();

        else if (algo == "SRTF")
            scheduler = make_unique<SRTF>();

        else if (algo == "Prioritynp")
            scheduler = make_unique<Prioritynp>();

        else if (algo == "Priorityp")
            scheduler = make_unique<Priorityp>();

        else if (algo == "RoundRobin")
            scheduler = make_unique<RoundRobin>(quantum);

        else if (algo == "MultilevelQueue")
            scheduler = make_unique<MultilevelQueue>();

        else if (algo == "MLFQ")
            scheduler = make_unique<MLFQ>();

        else
            throw runtime_error("Unknown scheduling algorithm");

        // Start simulation
        SimulationEngine engine(processes, scheduler.get());

        engine.run();

        auto result = engine.getprocesses();
        auto timeline = engine.getTimeline();

        // Prepare output JSON
        json output;
        output["timeline"] = json::array();
        output["processes"] = json::array();

        // Add timeline entries
        for (auto &t : timeline.timeline)
        {
            output["timeline"].push_back({{"time", t.time},
                                          {"running", t.processid}});
        }

        // Add process statistics
        for (auto &p : result)
        {
            output["processes"].push_back({{"id", p.id},
                                           {"waiting", p.wt},
                                           {"turnaround", p.tat}});
        }

        // Print final result
        cout << output.dump(4) << endl;
    }
    catch (exception &e)
    {
        cerr << "ERROR: " << e.what() << endl;
    }

    return 0;
}