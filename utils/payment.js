const https = require('https');

/**
 * Initiates a payment transaction with Paystack.
 * 
 * @param {string} email - User's email address
 * @param {number} amount - Amount in main currency unit (will be converted to kobo)
 * @param {Object} metadata - Additional transaction information
 * @returns {Promise<Object>} Payment initialization data
 */
function initiatePaystackPayment(email, amount, metadata = {}) {
  return new Promise((resolve, reject) => {
    // Add request timeout
    const TIMEOUT_MS = 30000; // 30 seconds

    const params = JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Convert to kobo and ensure integer
      metadata: JSON.parse(JSON.stringify(metadata)) // Sanitize metadata
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      timeout: TIMEOUT_MS
    };

    const req = https.request(options, res => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          
          // Check for both status and response code
          if (parsedData.status && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData.data);
          } else {
            const error = new Error(parsedData.message || 'Payment initialization failed');
            error.code = 'PAYMENT_INIT_FAILED';
            error.details = parsedData;
            reject(error);
          }
        } catch (error) {
          error.code = 'PARSE_ERROR';
          reject(error);
        }
      });
    });

    // Handle request timeout
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      const error = new Error('Request timed out');
      error.code = 'TIMEOUT';
      reject(error);
    });

    req.on('error', error => {
      error.code = error.code || 'NETWORK_ERROR';
      reject(error);
    });

    req.write(params);
    req.end();
  });
}

module.exports = initiatePaystackPayment;