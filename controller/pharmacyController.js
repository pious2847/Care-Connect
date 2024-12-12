const Phamarcy = require('../models/pharmacy')
const { generateFacilityWelcomeMessage } = require('../utils/messages');
const { sendEmail } = require('../utils/MailSender');
const { cloudinary, cleanupUploadedFile } = require('../config/cloudinaryConfig');
const bcrypt = require('bcrypt')
const initiatePaystackPayment = require('../utils/payment');

const PhamarcyController = {
    async createPhamarcies(req, res) {
        try {
            const { name, username, email, contact, ambulancecontact, address, walletnumber, walletname, bio, password } = req.body;
            const existingPhamarcies = await Phamarcy.find({ email: new RegExp(`^${email}$`, 'i') });

            if (existingPhamarcies.length > 0) {  
                req.flash('message', `Email already registered With Another Phamarcy`);
                req.flash('status', 'danger');
                res.redirect('/register/pharmacy')
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

            const newPhamarcies = new Phamarcy({
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

            // Initialize payment before saving
            const initializePayment = await initiatePaystackPayment(email, 300, newPhamarcies);

            // Save the Phamarcies
            await newPhamarcies.save();

            const message = generateFacilityWelcomeMessage(newPhamarcies,initializePayment )

            await sendEmail(email, 'Facility account registeration', message )
            req.flash('message', `${newPhamarcies.name}! account registered successfully. Please complete subscription to continue`);
            req.flash('status', 'success');

            res.redirect('/login')
           

        } catch (error) {
            console.error('Phamarcies registration error:', error);
            req.flash('message', `An error occurred during registration. Please try again.`);
            req.flash('status', 'danger');
            res.redirect('/register/pharmacy');
        }
    },
    async getAllPhamarcies(req, res){
        try {
            const Phamarcies = await Phamarcy.find().populate('Staffs');

            if (!Phamarcies) {
                res.status(404).json({message : "The is no records found", success: false})
            }
            res.status(200).json({message:"Phamarcies data retrieved successfully", success: true})
        } catch (error) {
            res.status(500).json({message: error.message, success: false})
        }
    },
    async getPhamarciesById(req, res){
        try {
            const {phamarcyId} = req.params;

            const Phamarcies = await Phamarcy.findById(phamarcyId).populate('Staffs');

            if (!Phamarcies) {
                res.status(404).json({message : "The is no records found", success: false})
            }
            res.status(200).json({message:"Phamarcies data retrieved successfully", success: true})
        } catch (error) {
            res.status(500).json({message: error.message, success: false})
        }
    },
    async deletePhamarciesById(req, res){
        try {
            const {phamarcyId} = req.params;

            const Phamarcies = await Phamarcy.findByIdAndDelete(phamarcyId);

            if (!Phamarcies) {
                res.status(404).json({message : "The is no records found", success: false})
            }
            res.status(200).json({message:"Phamarcies data deleted successfully", success: true})
        } catch (error) {
            res.status(500).json({message: error.message, success: false})
        }
    },
    

}

module.exports = PhamarcyController