const { Accommodation, Cabin, Campsite, Booking } = require('../models');
const { Op } = require('sequelize');

const BLOCKING_BOOKING_STATUSES = ["pending", "confirmed", "checked_in"];

async function validateStay(req, res, next) {
    const { checkIn, checkOut, accommodationId, amountOfPeople } = req.body;

    try {
        const accommodation = await Accommodation.findByPk(accommodationId, {
            include: [
                { model: Cabin, required: false },
                { model: Campsite, required: false }
            ]
        });

        if (!accommodation) {
            return res.status(404).json({ message: 'Accommodation not found' });
        }

        let maxCapacity;
        if (accommodation.Cabin) {
            maxCapacity = accommodation.Cabin.maxCapacity;
        } else if (accommodation.Campsite) {
            maxCapacity = accommodation.Campsite.maxCapacity;
        }

        if (amountOfPeople > maxCapacity) {
            return res.status(400).json({ message: 'Max capacity exceeded' });
        }

        const conflict = await Booking.findOne({
            where: {
                accommodationId,
                status: { [Op.in]: BLOCKING_BOOKING_STATUSES },
                checkIn: { [Op.lt]: checkOut },
                checkOut: { [Op.gt]: checkIn }
            }
        });

        if (conflict) {
            return res.status(400).json({ message: 'Accommodation not available on these dates' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = validateStay;
