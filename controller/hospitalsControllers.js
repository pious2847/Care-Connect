const Hospitals = require('../models/hospitals')
const { cloudinary, cleanupUploadedFile } = require('../config/cloudinaryConfig');
const bcrypt = require('bcrypt')
const initiatePaystackPayment = require('../utils/payment');
const Pharmacies = require('../models/pharmacy');
const staffs = require('../models/staffs');
const Patient = require('../models/patients');
const { generateFacilityWelcomeMessage } = require('../utils/messages');
const { sendEmail } = require('../utils/MailSender');


const hospitalController = {
    async createHospital(req, res) {
        try {
            const { name, username, email, contact, ambulancecontact, address, walletnumber, walletname, bio, password } = req.body;
            const existingHospital = await Hospitals.find({ email: new RegExp(`^${email}$`, 'i') });

            if (existingHospital.length > 0) {
                req.flash('message', `Email already registered With Another Hospital`);
                req.flash('status', 'danger');
                res.redirect('/register/hospital')
            }

            let logoUrl = null;
            let publicId = null;
            if (req.files && req.files.logo) {
                const profileResult = await cloudinary.uploader.upload(
                    req.files.logo[0].path,
                    {
                        folder: "facilities_logo",
                    }
                );
                logoUrl = profileResult.secure_url;
                publicId = profileResult.public_id;
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newHospital = new Hospitals({
                name,
                bio,
                contact,
                email,
                username,
                password: hashedPassword, // Added missing password field
                wallet: {
                    name: walletname,
                    number: walletnumber
                },
                ambulancecontact,
                address,
                logo: {
                    picture: logoUrl || 'https://via.placeholder.com/150',
                    publicId
                }
            });

            const metadata = {
                facilityId: newHospital._id,
                ...newHospital,
                paymenttype: 'subscription',
                subscriptionDetails :{
                    planName: "Professional Plan",
                    period: "Annual",
                    amount: 300.00
                }
            }

            // Initialize payment before saving
            const initializePayment = await initiatePaystackPayment(email, 300, metadata);

            // Save the hospital
            await newHospital.save();

            const message = generateFacilityWelcomeMessage(newHospital,initializePayment )

            await sendEmail(email, 'Facility account registeration', message )
            req.flash('message', `${newHospital.name}! account has been created successfully. please check email to complete subscription'`);
            req.flash('status', 'success');

            res.redirect('/login')


        } catch (error) {
            console.error('Hospital registration error:', error);
            req.flash('message', `An error occurred during registration. Please try again.`);
            req.flash('status', 'danger');
        }
    },
    async login(req, res) {
        try {
            const { accountType, email, password } = req.body;

            let account = null;
            if (accountType === 'hospitals') {
                account = await Hospitals.findOne({ email });
            } else if (accountType === 'pharmacies') {
                account = await Pharmacies.findOne({ email });
            } else if (accountType === 'staff') {
                account = await staffs.findOne({ email });
            } else {
                account = await Patient.findOne({'contact.email':  email });
            }

            if (!account) {
                req.flash('message', 'Account not found. Please check your email.');
                req.flash('status', 'danger');
                return res.redirect('/login');
            }
            
            if (!account.password) {
                req.flash('message', 'Invalid account data. Please check your email and  password.');
                req.flash('status', 'danger');
                return res.redirect('/login');
            }

            const isMatch = await bcrypt.compare(password, account.password);

            if (!isMatch) {
                req.flash('message', 'Incorrect password entered. Please check your password.');
                req.flash('status', 'danger');
                return res.redirect('/login');
            }

            req.session.accountId = account._id;
            req.session.accountType = accountType;
            req.session.isLoggedIn = true;

            req.flash('message', `Welcome back ${account.username || account.name || account.firstname +' '+ account.lastname||'User'}!`);
            req.flash('status', 'success');


            const redirectMap = {
                'hospitals': `/dashboard/${accountType}/${account._id}`,
                'pharmacies': `/dashboard/${accountType}/${account._id}`,
                'staff': `/dashboard/${accountType}/${account._id}`,
                'patient': `/dashboard/${accountType}/${account._id}`
            };

            return res.redirect(redirectMap[accountType]);

        } catch (error) {
            console.error('Login error:', error);
            req.flash('message', 'An error occurred during login. Please check your email.');
            req.flash('status', 'danger');
            return res.redirect('/login');
        }
    },
    async logout(req, res) {
        try {
            // Destroy the user's session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    req.flash('message', 'Failed to log out. Please try again.');
                    req.flash('status', 'danger');
                    return res.redirect('/login');
                }
    
                // Clear the cookie that stores the session ID
                res.clearCookie('connect.sid', { path: '/' });
    
               
                return res.redirect('/login');
            });
        } catch (error) {
            console.error('Logout error:', error);
            req.flash('message', 'An unexpected error occurred during logout');
            req.flash('status', 'danger');
            return res.redirect('/login');
        }
    }, 
    async getAllHospital(req, res) {
        try {
            const Hospital = await Hospitals.find().populate('Staffs');

            if (!Hospital) {
                res.status(404).json({ message: "The is no records found", success: false })
            }
            res.status(200).json({ message: "Hospital data retrieved successfully", success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    },
    async getHospitalById(req, res) {
        try {
            const { HospitalsId } = req.params;

            const Hospital = await Hospitals.findById(HospitalsId).populate('Staffs');

            if (!Hospital) {
                res.status(404).json({ message: "The is no records found", success: false })
            }
            res.status(200).json({ message: "Hospital data retrieved successfully", success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    },
    async deleteHospitalById(req, res) {
        try {
            const { HospitalsId } = req.params;

            const Hospital = await Hospitals.findByIdAndDelete(HospitalsId);

            if (!Hospital) {
                res.status(404).json({ message: "The is no records found", success: false })
            }
            res.status(200).json({ message: "Hospital data deleted successfully", success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    },

}

module.exports = hospitalController;