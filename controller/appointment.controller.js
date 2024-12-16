const { request } = require("express");
const Appointments = require("../models/appointments");
const Hospitals = require("../models/hospitals");
const Pharmacies = require("../models/pharmacy");
const { sendEmail } = require('../utils/MailSender');
const { generateAppointmentEmail, generateFacilityAppointmentEmail } = require("../utils/messages");

const AppointmentController = {
    async getmeeting(req, res)  {
      
        try {
            const {roomId} = req.params
       
            const appointment = await Appointments.findById(roomId).populate('facility');
           
            let facility = appointment.facility;
    
       
             if(!facility){
                req.flash('message', `Unable to book appointment because facility cant be found`);
                req.flash('status', 'danger');
                res.redirect('/')
             }
            
    
            const meeting =
            {
                title: `Appointment with ${facility.name}`,
                date: appointment.date,
                startTime: appointment.time,
                duration: 30,
                organizer: facility.name,
                roomId: appointment._id,
                description: appointment.message
            }
            if(!appointment){
                req.flash('message', `Unable to book appointment because appointment cant be found`);
                req.flash('status', 'danger');
                res.redirect('/')
            }
            // Update appointment status
            appointment.isAttended = true;
            await appointment.save();

            res.render('./meeting/room', { meeting })
        } catch (error) {
            console.error(error.message)
        }
    },
    async createAppointment(req, res){
        try {
            const { name, email, time, facilityId, date, message} = req.body;

          

            let facility;
             if(facilityId){
                facility = await Hospitals.findById(facilityId);
                if(!facility){
                    facility = await Pharmacies.findById(facilityId)
                }
             }

             if(!facility){
                req.flash('message', `Unable to book appointment because facility cant be found`);
                req.flash('status', 'danger');
             }

            const newAppointment = new Appointments({
                name,
                email,
                facility: facilityId,
                date,
                message,
                time
            })

            newAppointment.save();

             facility.appointments.push(newAppointment._id)
             await facility.save();
             
            const appointmentmessage = await generateAppointmentEmail(newAppointment, facility)
            const facilityappointmentmessage = await generateFacilityAppointmentEmail(newAppointment, facility)

            await sendEmail(email, 'Appointment Booking Notice' , appointmentmessage);

            await sendEmail(facility.email, 'Appointment Booking Notice' , facilityappointmentmessage);

            if(req.session){
             const {accountType, accountId} = req.session;

                req.flash('message', ` Appointment successfully booked with ${facility.name}!`);
                req.flash('status', 'success');
                res.redirect(`/dashboard/${accountType}/${accountId}`);
            }else{  
                req.flash('message', ` Appointment successfully booked with ${facility.name}!`);
                req.flash('status', 'success');
                res.redirect('/')
            }
           
        } catch (error) {
            console.error(error.message);
            req.flash('message', 'An error occurred during login. Please check your email.');
            req.flash('status', 'danger');
            res.redirect('/');
        }
    }
}
module.exports = AppointmentController;