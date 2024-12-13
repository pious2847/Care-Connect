const crypto = require('crypto');
const Hospitals = require('../models/hospitals');
const Pharmacies = require('../models/pharmacy');
const { sendEmail } = require('../utils/MailSender');
const { generateFacilitySubscriptionConfirmationMessage, generatePatientPaymentApprovedMessage, generateFacilityPaymentApprovedMessage } = require('../utils/messages');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/patients');


const purchaseController = {
  /**
  * Handled Paystack Payment Webhook
  * @param {Object} req - Express request object
  * @param {Object} res - Express response object
  */
  async handlePaystackWebhook(req, res) {
    const secret = process.env.PAYSTACK_API_KEY;

    // Signature verification
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;
    if (event.event !== 'charge.success') {
      return res.sendStatus(200);
    }

    const { metadata } = event.data;
    const { paymenttype } = metadata;

    try {
      switch (paymenttype) {
        case 'subscription':
          await handleSubscriptionPayment(metadata);
          break;
        case 'medicalbills':
          await handleMedicalBillsPayment(metadata);
          break;
        case 'servicescharges':
          await handleServiceChargesPayment(metadata);
          break;
        default:
          console.warn('Unhandled payment type:', paymenttype);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.sendStatus(500);
    }
  },


};

  // Helper functions to handle different payment types
  async function  handleSubscriptionPayment(metadata)  {
    const { facilityId, subscriptionDetails } = metadata;

    const facility = await Hospitals.findById(facilityId) ||
      await Pharmacies.findById(facilityId);

    if (!facility) {
      throw new Error('Facility not found');
    }

    facility.subscriptionstatus = true;
    await facility.save();

    const message = generateFacilitySubscriptionConfirmationMessage(facility, subscriptionDetails);
    await sendEmail(facility.email, 'Subscription Payment Confirmation', message);
  }
  async function handleMedicalBillsPayment(metadata) {
    const { patientmedicalrecords, facility, patientId } = metadata;

    const medicalRecords = await MedicalRecord.findById(patientmedicalrecords._id);
    const patient = await Patient.findById(patientId._id);
    const curentmedicleRecords = medicalRecords;

    if (!medicalRecords || !patient) {
      throw new Error('Medical records or patient not found');
    }

    medicalRecords.billingStatus = 'paid';
    medicalRecords.billingDetails.daysAdmitted = curentmedicleRecords.billingDetails.daysAdmitted;
    medicalRecords.billingDetails.totalAmount = curentmedicleRecords.billingDetails.totalAmount;
    await medicalRecords.save();

    const message = generatePatientPaymentApprovedMessage(patient, medicalRecords.billingDetails, facility);
    await sendEmail(patient.contact.email, 'Medical Bill Payment Approved', message);
  }

  async function handleServiceChargesPayment(metadata) {
    const { facilityId, patientId } = metadata;

    const patient = await Patient.findById(patientId);
    const facility = await Hospitals.findById(facilityId) ||
      await Pharmacies.findById(facilityId);

    if (!patient || !facility) {
      throw new Error('Patient or facility not found');
    }

    patient.currentAdmission.isAdmitted = false;
    patient.currentAdmission.hospital = null;
    patient.currentAdmission.admissionDate = null;
    await patient.save();

    const facilitymessage = generateFacilityPaymentApprovedMessage(facility, patient, paymentDetails={dischargeProcessingFee: 50});
    await sendEmail(facility.email, 'Service Charges Payment Completed', facilitymessage);
  }

module.exports = purchaseController;