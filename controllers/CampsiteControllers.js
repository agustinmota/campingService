const Campsite = require("../models/Campsite");
const Accommodation = require("../models/Accommodation");
const { findAvailableUnits, validateAvailabilityQuery } = require("../services/availabilityService");
const { assignDefined } = require("../utils/modelUpdates");
const { badRequest, notFound, serverError } = require("../utils/httpResponses");

async function index(req, res){
    const campsites= await Campsite.findAll();
    res.json(campsites);
}

async function available(req, res) {
  const { checkIn, checkOut, amountOfPeople } = req.query;
  const queryError = validateAvailabilityQuery({ checkIn, checkOut });

  if (queryError) {
    return badRequest(res, queryError);
  }

  try {
    const availableCampsites = await findAvailableUnits(Campsite, { checkIn, checkOut, amountOfPeople });

    return res.json({ campsites: availableCampsites, message: "available campsites found" });
  } catch (error) {
    return serverError(res, error);
  }
}

async function show(req, res) {
    const {id}= req.params;
    try{
       const campsite= await Campsite.findByPk(id);
        if(campsite){
            res.json({campsite,message:'campsite found'});
        }
        else{
            res.json({message:'campsite not found'})
        }
    }
    catch(error){
        serverError(res, error)
    }
    
}
async function create(req, res){
  const  { identifier, maxCapacity, pricePerPerson, description, imageUrl }= req.body;
  try{
    const newAccommodation= await Accommodation.create({type:"campsite", identifier});
    const newCampsite= await Campsite.create({id:newAccommodation.id, identifier:newAccommodation.identifier, maxCapacity, pricePerPerson, description, imageUrl })
    if(newCampsite){
        res.json({newCampsite,message:'campsite created'});
    }
  }
  catch(error){
    serverError(res, error);
  }

}

async function  edit(req, res) {
    const {id} = req.params;
    const  {identifier, maxCapacity, pricePerPerson, description, imageUrl }= req.body;
   try{
    const campsite= await Campsite.findByPk(id);
    if(campsite){
   const accommodation = await Accommodation.findByPk(id);
   if (accommodation) {
    assignDefined(accommodation, { identifier });
    await accommodation.save();
   }
   assignDefined(campsite, { identifier, maxCapacity, pricePerPerson, description, imageUrl });
   await  campsite.save()
    res.json(campsite)}
    else {
        notFound(res, "campsite")
    }

}
    catch(error){
        serverError(res, error)

    }
}

async function destroy(req, res) {
  const { id } = req.params;

  try {
    const campsite = await Campsite.findByPk(id);

    if (campsite) {
      await campsite.destroy();
      return res.json({ message: "Campsite deleted successfully" });
    } else {
      return notFound(res, "Campsite");
    }
  } catch (error) {
    return serverError(res, error);
  }
}
module.exports={index,create,edit,destroy ,show,available};
