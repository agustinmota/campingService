const { differenceInDays } = require('date-fns');
const Booking = require('../models/Booking');
const Accommodation = require('../models/Accommodation');
const Cabin= require('../models/Cabin');
const Campsite = require('../models/Campsite');
const { Op } = require('sequelize');




async function searchAvailableDates(req, res) {
    const { checkIn, checkOut } = req.body;
    try {
        const availableBookings = await Booking.findAll({
            where: {
                checkIn: { [Op.lt]: checkOut },
                checkOut: { [Op.gt]: checkIn }
            }
        });
        if(!availableBookings || availableBookings.length === 0) {
            res.json({message:'No available bookings for the selected dates'});
        }
        return res.json(availableBookings);
    } catch (error) {
        res.status(500).json({message:'Error searching for available bookings'});
    }
};


async function searchByType(req, res){
   const{checkIn,checkOut,type}=req.body;

  try{ const byTypeAvailable = await Booking.findAll({
        where:{ type,
            checkIn: { [Op.lt]: checkOut },
            checkOut: { [Op.gt]: checkIn }
         },
           include: [
        {
          model: Accommodation,
          where: { type },
        }
      ]
         
    });
    if(!byTypeAvailable || byTypeAvailable.length===0){
        res.json({message:'No available stays for the selected type and dates'});
    }
    return res.json(byTypeAvailable);
  }
    catch(error){
        res.status(500).json({message:'Error searching for available stays'});
    }};

async function calculateAmount({ amountOfPeople, accommodationId, checkIn, checkOut }) {
    const numberOfDays = differenceInDays(new Date(checkOut), new Date(checkIn));

    try {
        const accommodation = await Accommodation.findByPk(accommodationId, {
            include: [Cabin, Campsite]
        });

        if (!accommodation) throw new Error('Accommodation not found');

        let amount;
        if (accommodation.type === 'cabin') {
            amount = numberOfDays * accommodation.Cabin.pricePerDay;
        } else if (accommodation.type === 'campsite') {
            amount = amountOfPeople * accommodation.Campsite.pricePerPerson * numberOfDays;
        } else {
            throw new Error('Invalid accommodation type');
        }

        return amount;
    } catch (error) {
        throw new Error('Error calculating amount: ' + error.message);
    }
}


 



/*async function buscarDisponiblePorAlojamiento(req,res){
    const {id, alojamientoId}= req.body;
    const alojamiento = await Alojamiento.findByPk(id);
    const fechaDisponible = await Estadia.findOne({
        where: {alojamientoId,
            id=null
        }
    })
}*/

module.exports={searchAvailableDates,searchByType,calculateAmount};