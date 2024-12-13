const crypto = require('crypto');
const Hospitals = require('../models/hospitals');
const Pharmacies = require('../models/pharmacy');
const { sendEmail } = require('../utils/MailSender');
const { generateFacilitySubscriptionConfirmationMessage, generatePatientPaymentApprovedMessage, generateFacilityPaymentApprovedMessage } = require('../utils/messages');
const MedicalRecord = require('../models/MedicalRecord');
const Patients = require('../models/patients');

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
      const { paymenttype } = metadata;

      try {

        if (paymenttype === 'subscription') {
          const { facilityId , subscriptionDetails} = metadata;


          let facility = null

          if (facilityId) {
            facility = await Hospitals.findById(facilityId)
          } else {
            facility = await Pharmacies.findById()
          }

          if (facility) {
            return res.status(404).send('Unable to find ficility ');
          }
          facility.subscriptionstatus = true

          facility.save();

          const message = generateFacilitySubscriptionConfirmationMessage(facility, subscriptionDetails );
          await sendEmail(facility.email, 'Subscription payment Confirmation Approved Successful', message)

          res.sendStatus(200);
        }
        if(paymenttype === 'medicalbills'){
          const { patientmedicalrecords , facility, patientId} = metadata;

          const medicalRecords = await MedicalRecord.findById(patientmedicalrecords._id);
          const patient = await Patients.findById(patientId);

          medicalRecords.billingStatus = 'paid'
          await medicalRecords.save();

          const message = generatePatientPaymentApprovedMessage(patient, patientmedicalrecords.billingDetails, facility);

          await sendEmail(patient.contact.email, 'Your Medical Bill Payment Has Been Approved ', message)

          res.sendStatus(200);
        }
        if(paymenttype ==='servicescharges'){
          const { facilityId, patientId} = metadata;

          const patient = await Patients.findById(patientId);

          let facility = null

          if (facilityId) {
            facility = await Hospitals.findById(facilityId)
          } else {
            facility = await Pharmacies.findById()
          }

          if (facility) {
            return res.status(404).send('Unable to find ficility ');
          }

          patient.currentAdmission.isAdmitted = false;
          patient.currentAdmission.hospital = null;
          patient.currentAdmission.admissionDate = null;

          await patient.save();

          const facilitymessage = generateFacilityPaymentApprovedMessage(facility,  patient, patientmedicalrecords.billingDetails);

          await sendEmail(facility.email, 'Confirmation: Service Charges for Discharge Payment Completed', facilitymessage)

          res.sendStatus(200);
        }

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