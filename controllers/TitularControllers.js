const Titular= require('../models/Titular')

async function create(req, res){
    const {nombre, apellido, documento, telefono, esUruguayo, tarjetaDeCredito}=req.body;
    try{
        newTitular= await Titular.create({nombre, apellido, documento, telefono, esUruguayo, tarjetaDeCredito})
       if(!newTitular) return res.json({message:'no se pudo crear el titular'})
       return res.json({newTitular, message:'titular creado con exito'})
    }
   catch(error){
        res.status(500).json({message: "error"})

    }
}
async function index(req, res){
    try{
        const titulares= await Titular.findAll();
        if(!titulares){
               return res.json({message:'no se encontraron titulares'});
        }
        return res.json({titulares, message:'titulares cargados'})
        
    }
    catch(error){
        res.status(500).json({message:'error'});

    }
}
async function show(req, res){
    const {id}= req.params;
    try{
        const titular= await Titular.findByPk(id);
        if(!titular) return res.json({message:'no se encontro el titular'});
        return res.json({titular, message:'titular encontrado'});
    }
    catch(error){
        res.status(500).json({message:'error'});
    }
}
async function edit(req, res){
    const {id}= req.params;
    const {nombre, apellido, documento, telefono, esUruguayo, tarjetaDeCredito}=req.body;
    try{
        const titular= await Titular.findByPk(id);
        if(!titular) return res.json({message:'no se encontro el titular'});
        const updatedTitular= await titular.update({nombre, apellido, documento, telefono, esUruguayo, tarjetaDeCredito});
        return res.json({updatedTitular, message:'titular actualizado con exito'});
    }
    catch(error){
        res.status(500).json({message:'error'});
    }
}
async function destroy(req, res){
    const{id}= req.params;
    try{
        const titular= await Titular.findByPk(id);
        if(!titular) return res.json({message:'no se encontro el titular'});
        await titular.destroy();
        return res.json({message:'titular eliminado con exito'});
    }
    catch(error){
        res.status(500).json({message:'error'});
    }
}




    module.exports={index, create, show,edit, destroy};