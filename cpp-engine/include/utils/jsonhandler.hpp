#pragma once
#include "../models/Process.hpp"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class JsonHandler
{
public:
    static std::vector<Process> parseProcesses(json input)
    {
        std::vector<Process> processes;

        for (auto &p : input["processes"])
        {
            Process proc;

            proc.id = p["id"];
            proc.at = p["arrival"];
            proc.bt = p["burst"];
            proc.remainingtime = proc.bt;
            proc.priority = p.value("priority", 0);
            proc.queueLevel = p.value("queueLevel", 0);
            processes.push_back(proc);
        }

        return processes;
    }
};