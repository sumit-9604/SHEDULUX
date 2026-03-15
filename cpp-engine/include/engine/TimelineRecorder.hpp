#pragma once
#include<vector>
#include<queue>
#include<string>
using namespace std;

struct TimelineEntry{
    int time;
    string processid;
};

class TimelineRecorder{
    public:
        vector<TimelineEntry> timeline;
        void record(int time, const string &pid){
            timeline.push_back({time,pid});
        }
};