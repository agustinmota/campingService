const Cabin = require("../models/Cabin");
const Accommodation = require("../models/Accommodation");
const { findAvailableUnits, validateAvailabilityQuery } = require("../services/availabilityService");
const { assignDefined } = require("../utils/modelUpdates");
const { badRequest, notFound, serverError } = require("../utils/httpResponses");

async function index(req, res){
    try{  const cabins = await Cabin.findAll();
        if (cabins.length > 0){
            return res.json({cabins, message:'cabins found'})
        }else{
            return res.json({message:'cabins not found'})
        }
    }
    catch(error){
        serverError(res, error)
    }
}

async function available(req, res) {
    const { checkIn, checkOut, amountOfPeople } = req.query;
    const queryError = validateAvailabilityQuery({ checkIn, checkOut });

    if (queryError) {
        return badRequest(res, queryError);
    }

    try {
        const availableCabins = await findAvailableUnits(Cabin, { checkIn, checkOut, amountOfPeople });
        return res.json({ cabins: availableCabins, message: "available cabins found" });
    } catch (error) {
        return serverError(res, error);
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
            serverError(res, error)
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
            serverError(res, error)
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
                assignDefined(accommodation, { identifier });
                await accommodation.save();
            }
            assignDefined(cabin, { identifier, maxCapacity, pricePerDay, description, imageUrl });
            await cabin.save();
            res.json({cabin,message:'cabin edited successfully'})
        }
        else{
            notFound(res, "cabin")
        }
    }
    catch(error){
       serverError(res, error);
    }
 }

 async function destroy(req, res){
    
    const {id}=req.params;
    try {const cabin= await Cabin.findByPk(id);
if(cabin){
    await cabin.destroy();
   return res.json({message:'cabin deleted successfully'})
} else{
     return notFound(res, "cabin")

}
}
catch(error){
    return serverError(res, error)
}
 }
 module.exports={create,index,show,edit,destroy,available};
