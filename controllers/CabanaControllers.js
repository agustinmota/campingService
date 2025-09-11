const Cabana = require("../models/Cabana");
const Alojamiento = require("../models/Alojamiento");

async function index(req, res){
    try{  const cabanas = await Cabana.findAll();
        if (cabanas.length > 0){
            return res.json({cabanas, message:'cabanas encontradas'})
        }else{
            return res.json({message:'cabanas no encontradas'})
        }
    }
    catch(error){
        res.tatus(500).json({message:'error'})
    }}
    
    async function show(req, res){
        const {id}=req.params
        try{ const cabana= await Cabana.findByPk(id);
            if(cabana){
                return res.json({cabana, message:'cabana encontrada'})
            }
            else{
                return res.json({message:'cabana no encontrada'})
            }
        }
        catch(error){
            res.tatus(500).json({message:'error'})
        }
    }
    
    async function create(req, res){
        const { identificador, maximaCapacidad,precioPorDia}=req.body;
        try {
            const newAlojamiento= await Alojamiento.create({tipo: 'cabana',identificador});
            const newCabana= await Cabana.create({ id: newAlojamiento.id, identificador: newAlojamiento.identificador, maximaCapacidad,precioPorDia})
            res.json({cabana: newCabana,message: "cabana creada con exito"});
        }
        catch(error){
            res.status(500).json({message: "error"})
        }
    }
 async function edit(req, res){
    const {id}= req.params;
    const {identificador, maximaCapacidad,precioPorDia}= req.body;
    try{
        const cabana= await Cabana.findByPk(id);
        if (cabana){
            cabana.identificador=identificador;
            cabana.maximaCapacidad=maximaCapacidad;
            cabana.precioPorDia=precioPorDia;
            res.json({cabana,message:'cabana editada'})
        }
        else{
            res.json({message:'no se encontro la cabana'})
        }
    }
    catch(error){
       res.tatus(500).json({message:'error'});
    }
 }

 async function destroy(req, res){
    
    const {id}=req.params;
    try {const cabana= await Cabana.findByPk(id);
if(cabana){
    await cabana.destroy();
   return res.json({message:'cabana borrada'})
} else{
     return res.json({message:'cabana no encontrada'})

}
}
catch(error){
    return res.status(500).json({message:'error'})
}
 }
 module.exports={create,index,show,edit,destroy};