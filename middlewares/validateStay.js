const { Accommodation, Cabin, Campsite,Booking  } = require('../models');
const { Op } = require('sequelize');




async function validateStay(req, res, next) {
    const { checkIn, checkOut, accommodationId, amountOfPeople } = req.body;

    try {

        const accommodation = await Accommodation.findByPk(accommodationId, {
    include: [
        { model: Cabin, required: false },
        { model: Campsite, required: false }
    ]
});


let maxCapacity;
if (accommodation.Cabin) {
    maxCapacity = accommodation.Cabin.maxCapacity;
} else if (accommodation.Campsite) {
    maxCapacity = accommodation.Campsite.maxCapacity;
}

if (amountOfPeople > maxCapacity) {
    return res.status(400).json({ message: 'Max capacity exceeded' });
}

        if (!accommodation) {
            return res.status(404).json({ message: 'Accommodation not found' });
        }

       


        const conflict = await Booking.findOne({
            where: {
                accommodationId,
                checkIn: { [Op.lt]: checkOut },
                checkOut: { [Op.gt]: checkIn }
            }
        });

        if (conflict) {
            return res.status(400).json({ message: 'Accommodation not available on these dates' });
        }

        next(); 
    } catch (error) {
        res.status(500).json({ message: 'Error validating stay', error: error.message });
    }
}
module.exports = validateStay;