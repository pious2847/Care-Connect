const Drug = require('../models/drugs');
const Pharmacies = require('../models/pharmacy');

const drugsController = {
    // Create new drug
    async createDrug(req, res) {
        try {
            const { 
                name, 
                description, 
                unitPrice, 
                quantityInStock, 
                supplier 
            } = req.body;
            const {accountId,accountType} = req.session;

            const pharmacy = await Pharmacies.findById(accountId);
            
            if (!pharmacy) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized access. Only pharmacies can create drugs.'
                });
            }

            const newDrug = await Drug.create({
                name,
                description,
                unitPrice,
                quantityInStock,
                supplier: {
                    name: supplier.name,
                    contact: supplier.contact,
                    address: supplier.address
                }
            });

            pharmacy.drugs.push(newDrug._id)
            await pharmacy.save();

            res.status(201).json({
                success: true,
                message: `Drug ${newDrug.name} has been added successfully`,
                data: newDrug
            });
        } catch (error) {
            console.error('Error creating drug:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while creating the drug' 
            });
        }
    },

    // Get all drugs
    async getAllDrugs(req, res) {
        try {
            const drugs = await Drug.find();
            res.status(200).json({
                success: true,
                count: drugs.length,
                data: drugs
            });
        } catch (error) {
            console.error('Error fetching drugs:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while fetching drugs' 
            });
        }
    },

    // Update drug
    async updateDrug(req, res) {
        try {
            const { drugId } = req.params;
            const { 
                name, 
                description, 
                unitPrice, 
                quantityInStock, 
                supplier 
            } = req.body;

            const updatedDrug = await Drug.findByIdAndUpdate(
                drugId,
                {
                    $set: {
                        name,
                        description,
                        unitPrice,
                        quantityInStock,
                        supplier: {
                            name: supplier.name,
                            contact: supplier.contact,
                            address: supplier.address
                        }
                    }
                },
                { new: true, runValidators: true }
            );

            if (!updatedDrug) {
                return res.status(404).json({
                    success: false,
                    message: 'Drug not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Drug information updated successfully',
                data: updatedDrug
            });
        } catch (error) {
            console.error('Error updating drug:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while updating the drug' 
            });
        }
    },

    // Delete drug
    async deleteDrug(req, res) {
        try {
            const { drugId } = req.params;

            const deletedDrug = await Drug.findByIdAndDelete(drugId);

            if (!deletedDrug) {
                return res.status(404).json({
                    success: false,
                    message: 'Drug not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Drug deleted successfully',
                data: deletedDrug
            });
        } catch (error) {
            console.error('Error deleting drug:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while deleting the drug' 
            });
        }
    },

    // Search drugs
    async searchDrugs(req, res) {
        try {
            const { query } = req.query;

            const searchConditions = [
                { name: { $regex: new RegExp(query, 'i') } },
                { description: { $regex: new RegExp(query, 'i') } },
                { 'supplier.name': { $regex: new RegExp(query, 'i') } }
            ];

            const drugs = await Drug.find({ 
                $or: searchConditions 
            });

            res.status(200).json({
                success: true,
                count: drugs.length,
                data: drugs
            });
        } catch (error) {
            console.error('Error searching drugs:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while searching drugs' 
            });
        }
    }
};

module.exports = drugsController;