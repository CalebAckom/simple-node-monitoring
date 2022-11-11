'use strict';

const express = require('express');

// Constant
const PORT = 5000

// Application
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const counter = new client.Counter({
    name: 'node_request_operations_total',
    help: 'The total number of processed requests'
});

const histogram = new client.Histogram({
    name: 'node_request_duration_seconds',
    help: 'Histogram for the duration in seconds',
    buckets: [1, 2, 5, 6, 10]
});

const app = express();
app.get('/', (req, res) => {
    // Simulating sleep
    var start = new Date()
    var simulateTime = 1000

    setTimeout(function(argument) {
        // Simulating execution time with setTimeout function
        var end = new Date() - start
        histogram.observe(end / 1000); //converting to seconds
    }, simulateTime)

    counter.inc();

    res.send('We are DevOps\n');
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
    res.set('Content-Type', client.register.contentType)
    res.end(client.register.metrics())
})

app.listen(PORT)
console.log(`Running on PORT ${PORT}`);