#pragma once
#include <string>
using namespace std;

enum class processstate{
    NEW,READY,RUNNING,TERMINATED
};

struct Process{
    string id;
    int at;
    int bt;
    int queueLevel = 0;
    int remainingtime = 0;
    int priority = 0;
    int starttime = -1;
    int completiontime = 0;
    int wt = 0;
    int tat = 0;
    int rt = 0;


    processstate state = processstate :: NEW;
};