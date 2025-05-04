FROM gcc:12

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    librabbitmq-dev \
    libboost-system-dev libboost-thread-dev libboost-chrono-dev \
    cmake \
    git \
    make


# Clone and build SimpleAmqpClient
RUN git clone https://github.com/alanxz/SimpleAmqpClient.git && \
    cd SimpleAmqpClient && \
    cmake . && \
    make && make install && \
    ldconfig

# Copy application source
COPY . .

# Build aggregator-core
RUN mkdir build && cd build && cmake .. && make

# Run the app
CMD ["./build/aggregator-core"]
