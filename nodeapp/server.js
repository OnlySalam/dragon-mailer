const express = require("express");
const client = require("prom-client");

// Check if default metrics are already registered
if (!global.metricsInitialized) {
    client.collectDefaultMetrics();
    global.metricsInitialized = true;
}

// set the PORT 
const PORT = 1234;
const HOSTNAME = "0.0.0.0";

// create custom metrics
const aboutus_counter = new client.Counter({
    name: "simple_app_counter_metric", 
    help: "This metric counts the number of requests made to the contact us page"
});

const register_counter = new client.Counter({
    name: "simple_register_counter_metric",
    help: "This metric counts the number of times the register page is visited"
});

// create the server
const server = express();

// set the endpoints
server.get("/contact-us", (req, res) => {
    aboutus_counter.inc();
    res.send({ message: "Working fine" });
});

server.get("/register", (req, res) => {
    register_counter.inc();
    res.send({ message: "Register page" });
});

// set the /metrics endpoint
server.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
});

// start listening for connections
server.listen(PORT, HOSTNAME, () => console.log(`Server is listening on ${HOSTNAME}:${PORT}`));
