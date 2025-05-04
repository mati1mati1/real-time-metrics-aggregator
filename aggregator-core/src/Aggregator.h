#pragma once
#include <unordered_map>
#include <string>
#include <mutex>

struct MetricData {
    int count = 0;
    double sum = 0.0;
};

class Aggregator {
    private:
        std::unordered_map<std::string, MetricData> metrics;
        std::mutex mtx;
    public:
    void addMetric(const std::string& name, double value) {
        std::lock_guard<std::mutex> lock(mtx);
        metrics[name].count += 1;
        metrics[name].sum += value;
    }

    double getAverage(const std::string& name) {
        std::lock_guard<std::mutex> lock(mtx);
        if (metrics[name].count == 0) return 0.0;
        return metrics[name].sum / metrics[name].count;
    }

    int getCount(const std::string& name) {
        std::lock_guard<std::mutex> lock(mtx);
        return metrics[name].count;
    }
};