const Campsite = require("../models/Campsite");
const Accommodation = require("../models/Accommodation");


async function index(req, res){
    const campsites= await Campsite.findAll();
    res.json(campsites);
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
        res.status(500).json({message: "error"})
    }
    
}
async function create(req, res){
  const  { identifier, maxCapacity, pricePerPerson }= req.body;
  try{
    const newAccommodation= await Accommodation.create({type:"campsite", identifier});
    const newCampsite= await Campsite.create({id:newAccommodation.id, identifier:newAccommodation.identifier, maxCapacity, pricePerPerson })
    if(newCampsite){
        res.json({newCampsite,message:'campsite created'});
    }
  }
  catch{
    res.error()
  }

}

async function  edit(req, res) {
    const {id} = req.params;
    const  {identifier, maxCapacity, pricePerPerson }= req.body;
   try{
    const campsite= await Campsite.findByPk(id);
    if(campsite){
   campsite.identifier=identifier;
   campsite.maxCapacity=maxCapacity;
   campsite.pricePerPerson=pricePerPerson;
   await  campsite.save()
    res.json(campsite)}
    else {
        res.status(404).json({message: "campsite not found"})
    }

}
    catch(error){
        res.status(500).json({message: "error"})

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
      return res.status(404).json({ error: "Campsite not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting campsite" });
  }
}
module.exports={index,create,edit,destroy ,show};