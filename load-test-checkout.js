/**
 * Care Beauty Solution — E2E Checkout Load Testing Script (k6 / Artillery / Node runner)
 * Measures concurrency, p95 latency, rate-limiting response, and order throughput.
 */

import http from 'http';

const TARGET_HOST = process.env.TEST_HOST || 'localhost';
const TARGET_PORT = process.env.TEST_PORT || 3000;
const CONCURRENT_USERS = 50;
const DURATION_SECONDS = 5;

console.log(`🚀 Starting Care Beauty Solution Checkout Load Test...`);
console.log(`Target: http://${TARGET_HOST}:${TARGET_PORT}/api/checkout`);
console.log(`Simulating ${CONCURRENT_USERS} concurrent user checkout sessions...`);

let totalRequests = 0;
let successfulOrders = 0;
let rateLimitedRequests = 0;
let failedRequests = 0;
const latencies = [];

async function simulateCheckoutUser(userId) {
  const payload = JSON.stringify({
    customerEmail: `loadtest.user${userId}@example.com`,
    items: [
      { productId: 'p1', quantity: 2, price: 599 },
    ],
    couponCode: 'GLOW200',
    shippingAddress: {
      fullName: `Test User ${userId}`,
      addressLine1: '100ft Road Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      phone: '9876543210',
    },
    paymentMethod: 'RAZORPAY',
  });

  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: '/api/checkout',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = Date.now() - startTime;
        latencies.push(duration);
        totalRequests++;

        if (res.statusCode === 200) {
          successfulOrders++;
        } else if (res.statusCode === 429) {
          rateLimitedRequests++;
        } else {
          failedRequests++;
        }
        resolve({ statusCode: res.statusCode, duration });
      });
    });

    req.on('error', () => {
      failedRequests++;
      totalRequests++;
      resolve({ statusCode: 500, duration: 0 });
    });

    req.write(payload);
    req.end();
  });
}

async function runLoadTest() {
  const promises = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    promises.push(simulateCheckoutUser(i));
  }

  await Promise.all(promises);

  latencies.sort((a, b) => a - b);
  const p95Index = Math.floor(latencies.length * 0.95);
  const p95Latency = latencies[p95Index] || 0;
  const avgLatency = latencies.length ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2) : 0;

  console.log(`\n================ LOAD TEST RESULTS ================`);
  console.log(`Total Requests Sent:    ${totalRequests}`);
  console.log(`Successful Checkout 200: ${successfulOrders}`);
  console.log(`Rate Limited 429:        ${rateLimitedRequests}`);
  console.log(`Failed Requests:         ${failedRequests}`);
  console.log(`Average Latency:         ${avgLatency} ms`);
  console.log(`P95 Latency:             ${p95Latency} ms`);
  console.log(`====================================================\n`);
}

runLoadTest();
