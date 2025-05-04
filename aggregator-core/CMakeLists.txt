cmake_minimum_required(VERSION 3.15)
project(aggregator-core)

set(CMAKE_CXX_STANDARD 17)

# Fetch nlohmann/json
include(FetchContent)
FetchContent_Declare(
  json
  GIT_REPOSITORY https://github.com/nlohmann/json.git
  GIT_TAG v3.11.3
)
FetchContent_MakeAvailable(json)

# Find SimpleAmqpClient
find_library(SimpleAmqpClient_LIB SimpleAmqpClient)
find_library(Rabbitmq_LIB rabbitmq)

include_directories(/usr/local/include)

add_executable(aggregator-core src/main.cpp src/Aggregator.cpp)

target_link_libraries(aggregator-core
  ${SimpleAmqpClient_LIB}
  ${Rabbitmq_LIB}
  nlohmann_json::nlohmann_json
)
