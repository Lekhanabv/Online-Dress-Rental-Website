const http = require('http');
const registerUser = async () => {
  const data = JSON.stringify({ name: 'Payment Tester', email: `paytest_${Date.now()}@example.com`, password: 'Pay12345', role: 'customer' });
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

const createRental = async (token) => {
  const data = JSON.stringify({ dressId: 1, rentalDate: '2026-05-15', durationDays: 2 });
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: 5000, path: '/api/rentals', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), Authorization: `Bearer ${token}` } }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

const processPayment = async (token, rentalId) => {
  const data = JSON.stringify({ rentalId, amount: 130, paymentMethod: 'card' });
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: 5000, path: '/api/payments', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), Authorization: `Bearer ${token}` } }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

(async () => {
  try {
    const reg = await registerUser();
    console.log('register', reg);
    if (reg.status !== 201) return;
    const token = reg.body.token;
    const rental = await createRental(token);
    console.log('rental', rental);
    if (rental.status !== 201) return;
    const payment = await processPayment(token, rental.body.rentalId);
    console.log('payment', payment);
  } catch (error) {
    console.error('error', error);
  }
})();
