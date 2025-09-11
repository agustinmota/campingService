const Parcela = require("../models/Parcela");
const Alojamiento = require("../models/Alojamiento");


async function index(req, res){
    const parcelas= await Parcela.findAll();
    res.json(parcelas);
}

async function show(req, res) {
    const {id}= req.params;
    try{
       parcela= await Parcela.findByPk(id);
        if(parcela){
            res.json({parcela,message:'parcela encontrada'});
        }
        else{
            res.json({message:'parcela no encontrada'})
        }
    }
    catch(error){
        res.status(500).json({message: "error"})
    }
    
}
async function create(req, res){
  const  { identificador, maximaCapacidad, precioPorPersona }= req.body;
  try{
    const newAlojamiento= await Alojamiento.create({tipo:"parcela", identificador});
    const newParcela= await Parcela.create({id:newAlojamiento.id, identificador:newAlojamiento.identificador, maximaCapacidad, precioPorPersona })
    if(newParcela){
        res.json({newParcela,message:'parcela creada'});
    }
  }
  catch{
    res.error()
  }

}

async function  edit(req, res) {
    const {id} = req.params;
    const  {identificador, maximaCapacidad, precioPorPersona }= req.body;
   try{
    const parcela= await Parcela.findByPk(id);
    if(parcela){
   parcela.identificador=identificador;
   parcela.maximaCapacidad=maximaCapacidad;
   parcela.precioPorPersona=precioPorPersona;
   await  parcela.save()
    res.json(parcela)}
    else {
        res.status(404).json({message: "parcela no encontrada"})
    }

}
    catch(error){
        res.status(500).json({message: "error"})

    }
}

async function destroy(req, res) {
  const { id } = req.params;

  try {
    const parcela = await Parcela.findByPk(id);

    if (parcela) {
      await parcela.destroy();
      return res.json({ message: "Parcela eliminada correctamente" });
    } else {
      return res.status(404).json({ error: "Parcela no existe" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar la parcela" });
  }
}
module.exports={index,create,edit,destroy ,show};