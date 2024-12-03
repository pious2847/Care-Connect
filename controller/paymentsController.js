const crypto = require('crypto');
const Hospitals = require('../models/hospitals');
const Pharmacies = require('../models/pharmacy');

const purchaseController = {
   /**
   * Handled Paystack Payment Webhook
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async handlePaystackWebhook(req, res) {
    const secret = process.env.PAYSTACK_API_KEY;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).send('Invalid signature');
    }
  
    const event = req.body;
  
    if (event.event === 'charge.success') {
      const { metadata } = event.data;
      const {facilityId } = metadata;
  
      try {
        let facility = null

        if(facilityId){
          facility = await Hospitals.findById(facilityId)
        }else{
            facility = await Pharmacies.findById()
        }

        if (facility) {
          return res.status(404).send('Unable to find ficility ');
        }
        facility.subscriptionstatus = true

        facility.save();

        res.sendStatus(200);
        
      } catch (error) {
        console.error('Error processing webhook:', error);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(200);
    }
  }
};

module.exports = purchaseController;