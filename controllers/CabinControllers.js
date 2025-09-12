const Cabin = require("../models/Cabin");
const Accommodation = require("../models/Accommodation");

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
        const { identifier, maxCapacity, pricePerDay}=req.body;
        try {
            const newAccommodation= await Accommodation.create({type: 'cabin',identifier});
            const newCabin= await Cabin.create({ id: newAccommodation.id, identifier: newAccommodation.identifier, maxCapacity, pricePerDay})
            res.json({cabin: newCabin,message: "cabin created successfully"});
        }
        catch(error){
            res.status(500).json({message: "error"})
        }
    }
 async function edit(req, res){
    const {id}= req.params;
    const {identifier, maxCapacity, pricePerDay}= req.body;
    try{
        const cabin= await Cabin.findByPk(id);
        if (cabin){
            cabin.identifier=identifier;
            cabin.maxCapacity=maxCapacity;
            cabin.pricePerDay=pricePerDay;
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
 module.exports={create,index,show,edit,destroy};