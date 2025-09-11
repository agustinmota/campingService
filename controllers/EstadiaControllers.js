const Estadia = require("../models/Estadia");
const Alojamiento = require('../models/Alojamiento')
const {calcularMonto} = require('../services/campingService');

async function index(req, res){
    try {
        const estadias= await Estadia.findAll();
        if(estadias){
            res.json({estadias,message:'estadias encontradas'});

        }
        else{
            res.json({message:'estadias no encontradas'})
        }
    }
    catch(error){
        res.status(500).json({message:'error'});
    }
};

async function show(req, res){
    const {id}= req.params;
   try{ const estadia= await Estadia.findByPk(id);
    if(estadia){
        res.json({estadia,message:'estadia encontrada'})
        
    }
    else{
        res.json({message:'estadia no encontrada'});
    }
}
catch(error){
    res.tatus(500).json({message:'error'});
}

}
async function edit(req,res){
    const {id}=req.params;
    const {ingreso, egreso,cantidadDePersonas, montoTotal}=req.body;
   try {const estadia=await Estadia.findByPk(id);
    if(estadia){
        estadia.ingreso=ingreso;
        estadia.egreso=egreso;
        estadia.cantidadDePersonas=cantidadDePersonas;
        estadia.montoTotal=montoTotal;
        res.json({estadia,message:'estadia editada correctamente'});
    }else{
        res.json({message:'estadia no encontrada'});
    }}
    catch(error){
        res.tatus(500).json({message:'error'});
    }
}
    
    async function destroy(req,res){
        const {id}= req.params;
        try{
           estadia= await Estadia.findByPk(id);
           if(estadia){
           await estadia.destroy();
           res.json({message:'estadia borrada'});
           }
           else{
            res.json({message:'la estadia no existe'});
           }
        }
        catch(error){
            res.json({message:'error'});
        }
    
    }
  async function create(req, res){
    const {ingreso, egreso,cantidadDePersonas,titularId,alojamientoId}=req.body;
    try {  
        const montoTotal= await calcularMonto({alojamientoId,cantidadDePersonas,ingreso,egreso})
        const estadia= await Estadia.create({ingreso, egreso,cantidadDePersonas, montoTotal,titularId,alojamientoId});
        res.json({estadia,message:'estadia creada correctamente'});
    }
    catch(error){
        res.status(500).json({message:'error servidor'});
    }
}

module.exports={index,show,edit, destroy, create};