const { Accommodation, Cabin, Campsite, Booking } = require('../models');
const { Op } = require('sequelize');
const { BLOCKING_BOOKING_STATUSES } = require("../constants/bookingStatuses");
const { badRequest, notFound, serverError } = require("../utils/httpResponses");

function getAccommodationCapacity(accommodation) {
    if (accommodation.Cabin) {
        return accommodation.Cabin.maxCapacity;
    }

    if (accommodation.Campsite) {
        return accommodation.Campsite.maxCapacity;
    }

    return null;
}

async function validateStay(req, res, next) {
    const { checkIn, checkOut, accommodationId, amountOfPeople } = req.body;

    if (!checkIn || !checkOut || !accommodationId || !amountOfPeople) {
        return badRequest(res, "checkIn, checkOut, accommodationId and amountOfPeople are required");
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        return badRequest(res, "checkOut must be after checkIn");
    }

    try {
        const accommodation = await Accommodation.findByPk(accommodationId, {
            include: [
                { model: Cabin, required: false },
                { model: Campsite, required: false }
            ]
        });

        if (!accommodation) {
            return notFound(res, "Accommodation");
        }

        const maxCapacity = getAccommodationCapacity(accommodation);

        if (!maxCapacity) {
            return badRequest(res, "Accommodation has no configured capacity");
        }

        if (Number(amountOfPeople) > Number(maxCapacity)) {
            return badRequest(res, 'Max capacity exceeded');
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
            return badRequest(res, 'Accommodation not available on these dates');
        }

        next();
    } catch (error) {
        serverError(res, error);
    }
}

module.exports = validateStay;
