#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <string>
#include <thread>
#include "Aggregator.h"

using json = nlohmann::json;

AmqpClient::Channel::ptr_t connectWithRetry(int retries, int delayMs) {
    while (retries-- > 0) {
        try {
            auto channel = AmqpClient::Channel::Create("rabbitmq", 5672, "admin", "admin", "/");
            std::cout << "[*] Connected to RabbitMQ" << std::endl;
            return channel;
        } catch (const std::exception& e) {
            std::cerr << "[!] RabbitMQ connection failed, retries left: " << retries
                      << ". Error: " << e.what() << std::endl;
            std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
        }
    }
    throw std::runtime_error("Failed to connect to RabbitMQ after retries");
}

int main() {
    Aggregator aggregator;
    std::cout << " [*] Starting Aggregator" << std::endl;
    std::cout << " [*] Connecting to RabbitMQ" << std::endl;
    auto channel = connectWithRetry(10, 5000);

    std::string queue_name = "metrics-events";
    channel->DeclareQueue(queue_name, false, true, false, false);

    std::cout << " [*] Waiting for messages. To exit press CTRL+C\n";

    while (true) {
        AmqpClient::Envelope::ptr_t envelope;
        bool success = channel->BasicGet(envelope, queue_name, true);

        if (success && envelope) {
            std::string body = envelope->Message()->Body();
            std::cout << " [x] Received: " << body << std::endl;

            try {
                auto j = json::parse(body);
                std::string metric = j["metric"];
                double value = j["value"];
                aggregator.addMetric(metric, value);

                std::cout << " [*] Count for " << metric << ": " << aggregator.getCount(metric)
                          << ", Average: " << aggregator.getAverage(metric) << std::endl;
            } catch (const std::exception& e) {
                std::cerr << " [!] JSON parse error: " << e.what() << std::endl;
            }
        }
    }

    return 0;
}
