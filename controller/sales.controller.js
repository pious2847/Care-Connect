const Sale = require('../models/sales');
const Drug = require('../models/drugs');
const Pharmacies = require('../models/pharmacy');

const salesController = {
    // Create new sale
    async createSale(req, res) {
        try {
            const { 
                customerName, 
                customerContact, 
                drugs, 
                paymentMethod ,
                totalPrice
            } = req.body;
            const {accountId,accountType} = req.session;

            const pharmacy = await Pharmacies.findById(accountId);
            console.log(totalPrice);

            if (!pharmacy) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized access. Only pharmacies can create drugs.'
                });
            }
            // Validate and update drug quantities
            for (let item of drugs) {
                const drug = await Drug.findById(item.drugId);
                if (!drug) {
                    return res.status(404).json({
                        success: false,
                        message: `Drug with ID ${item.drugId} not found`
                    });
                }

                if (drug.quantityInStock < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient stock for drug ${drug.name}`
                    });
                }

                // Update drug quantity
                drug.quantityInStock -= item.quantity;
                await drug.save();

                console.log('Updated drug quantity', drugs, item)
            }
            // Prepare sale data
            const saleData = {
                customerName,
                customerContact,
                totalPrice,
                drugs: [...drugs],
                paymentMethod
            };

            const newSale = await Sale.create(saleData);
            
            pharmacy.sales.push(newSale._id)

            await pharmacy.save();
            res.status(201).json({
                success: true,
                message: 'Sale recorded successfully',
                data: newSale
            });
        } catch (error) {
            console.error('Error creating sale:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while creating the sale' 
            });
        }
    },

    // Get all sales
    async getAllSales(req, res) {
        try {
            const sales = await Sale.find().populate('drugs.drugId');
            res.status(200).json({
                success: true,
                count: sales.length,
                data: sales
            });
        } catch (error) {
            console.error('Error fetching sales:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while fetching sales' 
            });
        }
    },

    // Search sales
    async searchSales(req, res) {
        try {
            const { query } = req.query;

            const searchConditions = [
                { customerName: { $regex: new RegExp(query, 'i') } },
                { customerContact: { $regex: new RegExp(query, 'i') } },
                { paymentMethod: { $regex: new RegExp(query, 'i') } }
            ];

            const sales = await Sale.find({ 
                $or: searchConditions 
            }).populate('drugs.drugId');

            res.status(200).json({
                success: true,
                count: sales.length,
                data: sales
            });
        } catch (error) {
            console.error('Error searching sales:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while searching sales' 
            });
        }
    },

    // Get sales by date range
    async getSalesByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const sales = await Sale.find({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }).populate('drugs.drugId');

            res.status(200).json({
                success: true,
                count: sales.length,
                data: sales
            });
        } catch (error) {
            console.error('Error fetching sales by date range:', error);
            res.status(500).json({ 
                success: false, 
                message: 'An error occurred while fetching sales by date range' 
            });
        }
    }
};

module.exports = salesController;