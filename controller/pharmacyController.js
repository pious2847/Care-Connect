const Phamarcy = require('../models/pharmacy')

const PhamarcyController = {
    async createPhamarcies(req, res) {
        try {
            const { name, username, email, contact, ambulancecontact, address, walletnumber, walletname, bio, password } = req.body;
            const existingPhamarcies = await Phamarcy.find({ email: new RegExp(`^${email}$`, 'i') });

            if (existingPhamarcies.length > 0) {  // Changed condition to check length
                return res.status(400).json({ message: 'Email already registered With Another Phamarcies' });
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

            // Return success response with payment details
            return res.status(201).json({
                success: true,
                message: "Phamarcies account registered successfully. Please complete subscription to continue",
                paymentDetails: initializePayment
            });

        } catch (error) {
            console.error('Phamarcies registration error:', error);
            return res.status(500).json({
                success: false,
                message: "An error occurred during registration. Please try again."
            });
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