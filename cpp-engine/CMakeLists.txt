cmake_minimum_required(VERSION 3.10)

project(ScheduluxEngine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include header files
include_directories(include)

# Collect all source files
file(GLOB_RECURSE SOURCES
    src/*.cpp
)

# Create executable
add_executable(cpu_scheduler ${SOURCES})