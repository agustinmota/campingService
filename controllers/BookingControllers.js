const Booking = require("../models/Booking");
const Guest = require("../models/Guest");
const { calculateAmount} = require('../services/campingService');
const { BOOKING_STATUSES } = require("../constants/bookingStatuses");
const { badRequest, notFound, serverError } = require("../utils/httpResponses");
const { assignDefined } = require("../utils/modelUpdates");

function getAuthenticatedUserId(req) {
    return req.auth?.id || req.auth?.userId;
}

async function getOrCreateBookingGuest({ guestId, firstName, lastName, document, phone }) {
    if (guestId) {
        return guestId;
    }

    if (!firstName || !lastName || !document) {
        return null;
    }

    const guest = await Guest.create({ firstName, lastName, document, phone });
    return guest.id;
}

async function index(req, res){
    try {
        const bookings= await Booking.findAll({ include: [{ model: Guest }] });
        if(bookings){
            res.json({bookings,message:'bookings found'});
            
        }
        else{
            res.json({message:'bookings not found'})
        }
    }
    catch(error){
        serverError(res, error);
    }
};

async function show(req, res){
    const {id}= req.params;
    try{ const booking= await Booking.findByPk(id, { include: [{ model: Guest }] });
        if(booking){
            res.json({booking,message:'booking found'})
            
        }
        else{
            notFound(res, "booking");
        }
    }
    catch(error){
        serverError(res, error);
    }
    
}
async function create(req, res){
  const {checkIn, checkOut,amountOfPeople,guestId,accommodationId, firstName, lastName, document, phone}=req.body;
  try {
      const bookingGuestId = await getOrCreateBookingGuest({ guestId, firstName, lastName, document, phone });

      if (!bookingGuestId) {
        return badRequest(res, "holder firstName, lastName and document are required");
      }

      const totalAmount = await calculateAmount({accommodationId, amountOfPeople, checkIn, checkOut});
      const booking = await Booking.create({
        checkIn,
        checkOut,
        amountOfPeople,
        totalAmount,
        status: "pending",
        guestId: bookingGuestId,
        accommodationId,
        userId: getAuthenticatedUserId(req)
      });
      res.json({booking, message:'booking created successfully'});
  }
  catch(error){
      serverError(res, error);
  }
}
async function edit(req,res){
    const {id}=req.params;
    const {checkIn, checkOut,amountOfPeople, totalAmount}=req.body;
    try {const booking=await Booking.findByPk(id);
        if(booking){
            assignDefined(booking, { checkIn, checkOut, amountOfPeople, totalAmount });
            await booking.save();
            res.json({booking,message:'booking edited successfully'});
    }else{
        notFound(res, "booking");
    }}
    catch(error){
        serverError(res, error);
    }
}
    
    async function destroy(req,res){
        const {id}= req.params;
        try{
           const booking = await Booking.findByPk(id);
           if(booking){
           await booking.destroy();
           res.json({message:'booking deleted successfully'});
           }
           else{
            notFound(res, "booking");
           }
        }
        catch(error){
            serverError(res, error);
        }
    
    }

    async function myBookings(req, res) {
        const userId = getAuthenticatedUserId(req);
        try {
            const bookings = await Booking.findAll({ where: { userId }, include: [{ model: Guest }] });
            res.json({ bookings, message: 'Bookings retrieved successfully' });
        } catch (error) {
            serverError(res, error);
    }
}

async function updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!BOOKING_STATUSES.includes(status)) {
        return badRequest(res, "Invalid booking status");
    }

    try {
        const booking = await Booking.findByPk(id, { include: [{ model: Guest }] });
        if (!booking) {
            return notFound(res, "booking");
        }

        booking.status = status;
        await booking.save();

        return res.json({ booking, message: "booking status updated successfully" });
    } catch (error) {
        return serverError(res, error);
    }
}

module.exports={index,show,edit, destroy, create,myBookings,updateStatus};
