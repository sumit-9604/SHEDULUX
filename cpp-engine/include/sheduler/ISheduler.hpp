#pragma once
#include <vector>
#include "../models/process.hpp"
using namespace std;

class ISheduler{
    public:
        virtual ~ISheduler(){}
        virtual int selectProcess(
            int currenttime,
            vector <Process> &processes,
            int currentrunning
        )=0;
};