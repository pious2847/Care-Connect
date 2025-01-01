const https = require('https');

/**
 * Initiates a payment transaction with Paystack.
 * 
 * This function sends a request to Paystack's API to initialize a payment transaction.
 * It uses the HTTPS module to make a secure POST request to Paystack's server.
 * 
 * @param {string} email - The email address of the user making the payment.
 * @param {number} amount - The amount to be paid in the smallest currency unit (e.g., kobo for Naira).
 * @param {Object} [metadata={}] - Additional information to be sent with the payment request.
 * @returns {Promise<Object>} A promise that resolves with the payment initialization data from Paystack.
 * @throws {Error} If the payment initialization fails or if there's an error parsing the response.
 */
function initiatePaystackPayment(email, amount, metadata = {}) {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email,
      amount: amount * 100, // Convert to kobo
      metadata
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 seconds timeout
    };

    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.status) {
            resolve(parsedData.data);
          } else {
            console.error('Paystack API Error:', parsedData);
            reject(new Error(parsedData.message || 'Payment initialization failed'));
          }
        } catch (error) {
          console.error('Error parsing Paystack response:', data);
          reject(new Error('Failed to parse Paystack response'));
        }
      });
    });

    req.on('error', error => {
      console.error('Paystack Request Error:', error);
      reject(error);
    });

    req.on('timeout', () => {
      reject(new Error('Request to Paystack timed out'));
      req.destroy();
    });

    req.write(params);
    req.end();
  });
}

module.exports = initiatePaystackPayment;