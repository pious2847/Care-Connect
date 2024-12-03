const Staffs = require('../models/staffs');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { cloudinary, cleanupUploadedFile } = require('../config/cloudinaryConfig');
const { sendEmail } = require('../utils/MailSender');
const { generatStaffeWelcomeMessage } = require('../utils/messages');
const Hospitals = require('../models/hospitals');
const Pharmacies = require('../models/pharmacy');



const staffController = {

  async getstaffs(req, res) {
    try {
      const staffs = await Staffs.find();

      res.status(200).json({ success: true, message: "Staffs account data retrieved successful", staffs })
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getstaffsByID(req, res) {
    try {
      const { staffId } = req.params
      const staff = await Staffs.findById(staffId);

      if (!staff) {
        res.status(404).json({ success: false, message: "Unable to find staff" })
      }

      res.status(200).json({ success: true, message: "Staff data retrieved successful", staff })
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create new staff member with profile image
  async createStaff(req, res) {
    try {
      const { accountType, accountId } = req.session;
      
        console.log('session', req.session)
      
      const {
        title,
        firstname,
        middlename,
        lastname,
        gender,
        dob,
        cardnumber,
        email,
        maritalstatuse,
        position,
        status,
        contact,
        password,
      } = req.body;



      const existingStaff = await Staffs.findOne({ email: new RegExp(`^${email}$`, 'i') });
      if (existingStaff) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      let profileUrl = null;
      let publicId = null;
      if (req.files && req.files.profile) {
        const profileResult = await cloudinary.uploader.upload(
          req.files.profile[0].path,
          {
            folder: "staff_profiles",
          }
        );
        profileUrl = profileResult.secure_url;
        publicId = profileResult.public_id;
      }


      const staffId = `STAFF${Date.now().toString().slice(-6)}`;
      const hashedPassword = await bcrypt.hash(password, 12);

      const newStaff = new Staffs({
        title,
        firstname,
        middlename,
        lastname,
        gender,
        dob,
        cardnumber,
        email: email.toLowerCase(),
        maritalstatuse,
        staffId,
        position,
        status: status || 'offline',
        contact,
        facilityId: accountId,
        facilityType: accountType,
        password: hashedPassword,
        profile: {
          picture: profileUrl || 'https://via.placeholder.com/150',
          publicId,
        },
      });

      await newStaff.save();

      const staffResponse = newStaff.toObject();
      delete staffResponse.password;

      let account = null;
      if (accountId) {
        account = await Hospitals.findById(accountId)
          .populate('staffs')
        if (!account) {
          account = await Pharmacies.findById(accountId)
            .populate('staffs')
        }
      }

      account.staffs.push(newStaff._id);
      await account.save();

      const message = await generatStaffeWelcomeMessage(account, newStaff, password)


      await sendEmail(email, 'Staff Account Registeration', message)


      req.flash('message', `${newStaff.firstname + ' ' + newStaff.lastname}! account has been created successfully'`);
      req.flash('status', 'success');

      res.redirect(`/dashboard/${accountType}/${accountId}/staffs`)
    } catch (error) {
      console.log('Create staff error:', error);

      req.flash('message', `Error creating staff member`);
      req.flash('status', 'success');

      res.redirect(`/dashboard/${accountType}/${Id}/staffs`)

    }
  },

  // Update staff profile image
  async updateProfileImage(req, res) {
    try {
      const staffId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const staff = await Staffs.findById(staffId);
      if (!staff) {
        // Delete uploaded file if staff not found
        await cloudinary.uploader.destroy(req.file.filename);
        return res.status(404).json({ message: 'Staff member not found' });
      }

      // If staff has an existing profile image (not the default), delete it
      if (staff.profile && !staff.profile.includes('blank-profile-picture')) {
        const publicId = staff.profile.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Update profile image URL
      staff.profile = req.file.path;
      await staff.save();

      res.status(200).json({
        message: 'Profile image updated successfully',
        profile: staff.profile
      });

    } catch (error) {
      // If there's an error, delete the uploaded file
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      console.error('Update profile image error:', error);
      res.status(500).json({ message: 'Error updating profile image', error: error.message });
    }
  },

  // Update staff member (modified to handle profile image update)
  async updateStaff(req, res) {
    try {
      const staffId = req.params.id;
      const updates = req.body;

      // Remove fields that shouldn't be updated directly
      delete updates.password;
      delete updates.staffId;
      delete updates.email;

      // If there's a new profile image
      if (req.file) {
        updates.profile = req.file.path;

        // Delete old profile image if it exists and is not the default
        const staff = await Staff.findById(staffId);
        if (staff && staff.profile && !staff.profile.includes('blank-profile-picture')) {
          const publicId = staff.profile.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Find and update staff
      const updatedStaff = await Staff.findByIdAndUpdate(
        staffId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedStaff) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(404).json({ message: 'Staff member not found' });
      }

      res.status(200).json({
        message: 'Staff updated successfully',
        staff: updatedStaff
      });

    } catch (error) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      console.error('Update staff error:', error);
      res.status(500).json({ message: 'Error updating staff member', error: error.message });
    }
  },

  // Delete staff member (modified to delete profile image)
  async deleteStaff(req, res) {
    try {
      const staffId = req.params.id;

      const staff = await Staff.findById(staffId);
      if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      // Delete profile image from Cloudinary if it exists and is not the default
      if (staff.profile && !staff.profile.includes('blank-profile-picture')) {
        const publicId = staff.profile.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      await staff.remove();

      res.status(200).json({ message: 'Staff member deleted successfully' });

    } catch (error) {
      console.error('Delete staff error:', error);
      res.status(500).json({ message: 'Error deleting staff member', error: error.message });
    }
  }


}

module.exports = staffController;