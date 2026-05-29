const Cabin = require("../models/Cabin");
const Accommodation = require("../models/Accommodation");
const Booking = require("../models/Booking");
const { Op } = require("sequelize");
const BLOCKING_BOOKING_STATUSES = ["pending", "confirmed", "checked_in"];

async function index(req, res){
    try{  const cabins = await Cabin.findAll();
        if (cabins.length > 0){
            return res.json({cabins, message:'cabins found'})
        }else{
            return res.json({message:'cabins not found'})
        }
    }
    catch(error){
        res.status(500).json({message:'error'})
    }
}

async function available(req, res) {
    const { checkIn, checkOut, amountOfPeople } = req.query;

    if (!checkIn || !checkOut) {
        return res.status(400).json({ message: "checkIn and checkOut are required" });
    }

    try {
        const where = amountOfPeople ? { maxCapacity: { [Op.gte]: Number(amountOfPeople) } } : {};
        const cabins = await Cabin.findAll({ where });
        const cabinIds = cabins.map((cabin) => cabin.id);
        const bookedCabins = await Booking.findAll({
            attributes: ["accommodationId"],
            where: {
                accommodationId: { [Op.in]: cabinIds },
                status: { [Op.in]: BLOCKING_BOOKING_STATUSES },
                checkIn: { [Op.lt]: checkOut },
                checkOut: { [Op.gt]: checkIn }
            }
        });
        const bookedIds = new Set(bookedCabins.map((booking) => booking.accommodationId));
        const availableCabins = cabins.filter((cabin) => !bookedIds.has(cabin.id));

        return res.json({ cabins: availableCabins, message: "available cabins found" });
    } catch (error) {
        return res.status(500).json({ message: "error" });
    }
}
    
    async function show(req, res){
        const {id}=req.params
        try{ const cabin= await Cabin.findByPk(id);
            if(cabin){
                return res.json({cabin, message:'cabin found'})
            }
            else{
                return res.json({message:'cabin not found'})
            }
        }
        catch(error){
            res.tatus(500).json({message:'error'})
        }
    }
    
    async function create(req, res){
        const { identifier, maxCapacity, pricePerDay, description, imageUrl}=req.body;
        try {
            const newAccommodation= await Accommodation.create({type: 'cabin',identifier});
            const newCabin= await Cabin.create({ id: newAccommodation.id, identifier: newAccommodation.identifier, maxCapacity, pricePerDay, description, imageUrl})
            res.json({cabin: newCabin,message: "cabin created successfully"});
        }
        catch(error){
            res.status(500).json({message: "error"})
        }
    }
 async function edit(req, res){
    const {id}= req.params;
    const {identifier, maxCapacity, pricePerDay, description, imageUrl}= req.body;
    try{
        const cabin= await Cabin.findByPk(id);
        if (cabin){
            const accommodation = await Accommodation.findByPk(id);
            if (accommodation) {
                accommodation.identifier = identifier;
                await accommodation.save();
            }
            cabin.identifier=identifier;
            cabin.maxCapacity=maxCapacity;
            cabin.pricePerDay=pricePerDay;
            cabin.description=description;
            cabin.imageUrl=imageUrl;
            await cabin.save();
            res.json({cabin,message:'cabin edited successfully'})
        }
        else{
            res.json({message:'cabin not found'})
        }
    }
    catch(error){
       res.tatus(500).json({message:'error'});
    }
 }

 async function destroy(req, res){
    
    const {id}=req.params;
    try {const cabin= await Cabin.findByPk(id);
if(cabin){
    await cabin.destroy();
   return res.json({message:'cabin deleted successfully'})
} else{
     return res.json({message:'cabin not found'})

}
}
catch(error){
    return res.status(500).json({message:'error'})
}
 }
 module.exports={create,index,show,edit,destroy,available};
