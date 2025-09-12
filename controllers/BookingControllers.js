const Booking = require("../models/Booking");
const Accommodation = require('../models/Accommodation');
const { calculateAmount} = require('../services/campingService');

async function index(req, res){
    try {
        const bookings= await Booking.findAll();
        if(bookings){
            res.json({bookings,message:'bookings found'});

        }
        else{
            res.json({message:'bookings not found'})
        }
    }
    catch(error){
        res.status(500).json({message:'error'});
    }
};

async function show(req, res){
    const {id}= req.params;
   try{ const booking= await Booking.findByPk(id);
    if(booking){
        res.json({booking,message:'booking found'})

    }
    else{
        res.json({message:'booking not found'});
    }
}
catch(error){
    res.tatus(500).json({message:'error'});
}

}
async function edit(req,res){
    const {id}=req.params;
    const {checkIn, checkOut,amountOfPeople, totalAmount}=req.body;
   try {const booking=await Booking.findByPk(id);
    if(booking){
        booking.checkIn=checkIn;
        booking.checkOut=checkOut;
        booking.amountOfPeople=amountOfPeople;
        booking.totalAmount=totalAmount;
        res.json({booking,message:'booking edited successfully'});
    }else{
        res.json({message:'booking not found'});
    }}
    catch(error){
        res.tatus(500).json({message:'error'});
    }
}
    
    async function destroy(req,res){
        const {id}= req.params;
        try{
           booking= await Booking.findByPk(id);
           if(booking){
           await booking.destroy();
           res.json({message:'booking deleted successfully'});
           }
           else{
            res.json({message:'booking not found'});
           }
        }
        catch(error){
            res.json({message:'error'});
        }
    
    }
  async function create(req, res){
    const {checkIn, checkOut,amountOfPeople,guestId,accommodationId}=req.body;
    try {
        const totalAmount = await calculateAmount({accommodationId, amountOfPeople, checkIn, checkOut});
        const booking = await Booking.create({checkIn, checkOut, amountOfPeople, totalAmount, guestId, accommodationId});
        res.json({booking, message:'booking created successfully'});
    }
    catch(error){
        res.status(500).json({message:'server error'});
    }
}

module.exports={index,show,edit, destroy, create};