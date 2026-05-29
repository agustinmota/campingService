const Guest= require('../models/Guest');
const { notFound, serverError } = require("../utils/httpResponses");

async function create(req, res){
    const {firstName, lastName, document, phone}=req.body;
    try{
       const newGuest= await Guest.create({firstName, lastName, document, phone})
       if(!newGuest) return res.json({message:' guest could not be created'});
       return res.json({newGuest, message:'guest created successfully'});
    }
   catch(error){
        serverError(res, error)

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
        serverError(res, error);

    }
}
async function show(req, res){
    const {id}= req.params;
    try{
        const guest= await Guest.findByPk(id);
        if(!guest) return notFound(res, "guest");
        return res.json({guest, message:'guest found'});
    }
    catch(error){
        serverError(res, error);
    }
}
async function edit(req, res){
    const {id}= req.params;
    const {firstName, lastName, document, phone}=req.body;
    try{
        const guest= await Guest.findByPk(id);
        if(!guest) return notFound(res, "guest");
        const updatedGuest= await guest.update({firstName, lastName, document, phone});
        return res.json({updatedGuest, message:'guest updated successfully'});
    }
    catch(error){
        serverError(res, error);
    }
}
async function destroy(req, res){
    const{id}= req.params;
    try{
        const guest= await Guest.findByPk(id);
        if(!guest) return notFound(res, "guest");
        await guest.destroy();
        return res.json({message:'guest deleted successfully'});
    }
    catch(error){
        serverError(res, error);
    }
}




    module.exports={index, create, show,edit, destroy};
