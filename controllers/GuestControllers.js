const Guest= require('../models/Guest');

async function create(req, res){
    const {firstName, lastName, document, phone}=req.body;
    try{
        newGuest= await Guest.create({firstName, lastName, document, phone})
       if(!newGuest) return res.json({message:' guest could not be created'});
       return res.json({newGuest, message:'guest created successfully'});
    }
   catch(error){
        res.status(500).json({message: "error"})

    }
}
async function index(req, res){
    try{
        const guests= await Guest.findAll();
        if(!guests){
               return res.json({message:'guests not found'});
        }
        return res.json({guests, message:'guests loaded'})

    }
    catch(error){
        res.status(500).json({message:'error'});

    }
}
async function show(req, res){
    const {id}= req.params;
    try{
        const guest= await Guest.findByPk(id);
        if(!guest) return res.json({message:'guest not found'});
        return res.json({guest, message:'guest found'});
    }
    catch(error){
        res.status(500).json({message:'error'});
    }
}
async function edit(req, res){
    const {id}= req.params;
    const {firstName, lastName, document, phoned}=req.body;
    try{
        const guest= await Guest.findByPk(id);
        if(!guest) return res.json({message:'guest not found'});
        const updatedGuest= await guest.update({firstName, lastName, document, phone});
        return res.json({updatedGuest, message:'guest updated successfully'});
    }
    catch(error){
        res.status(500).json({message:'error'});
    }
}
async function destroy(req, res){
    const{id}= req.params;
    try{
        const guest= await Guest.findByPk(id);
        if(!guest) return res.json({message:'guest not found'});
        await guest.destroy();
        return res.json({message:'guest deleted successfully'});
    }
    catch(error){
        res.status(500).json({message:'error'});
    }
}




    module.exports={index, create, show,edit, destroy};