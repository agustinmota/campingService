const { differenceInDays } = require('date-fns');
const Estadia = require('../models/Estadia');
const Alojamiento = require('../models/Alojamiento');
const Cabana = require('../models/Cabana');
const Parcela = require('../models/Parcela');
const { Op } = require('sequelize');




async function buscarDisponiblePorFechas(req, res) {
    const { ingreso, egreso } = req.body;
    try {
        const estadiasDisponibles = await Estadia.findAll({
            where: {
                ingreso: { [Op.lt]: egreso },
                  egreso: { [Op.gt]: ingreso }
                 } 
        });
        if(!estadiasDisponibles || estadiasDisponibles.length === 0) {
            res.json({message:'No hay estadías disponibles en las fechas seleccionadas'});
        }
        return res.json(estadiasDisponibles);
    } catch (error) {
        res.status(500).json({message:'error al buscar estadías disponibles'});
    }
};


async function buscarPorTipo(req, res){
   const{ingreso,egreso,tipo}=req.body;
    
  try{ const porTipoDisponibles   = await Estadia.findAll({
        where:{ tipo,
            ingreso: { [Op.lt]: egreso },
                  egreso: { [Op.gt]: ingreso }
         },
           include: [
        {
          model: Alojamiento,
          where: { tipo },
        }
      ]
         
    });
    if(!porTipoDisponibles || porTipoDisponibles.length===0){
        res.json({message:'No hay estadías disponibles en las fechas seleccionadas'});
    }
    return res.json(porTipoDisponibles);
  }
    catch(error){
        res.status(500).json({message:'error al buscar estadías disponibles'});
    }};
   
async function calcularMonto({ cantidadDePersonas, alojamientoId, ingreso, egreso }) {
    const cantidadDeDias = differenceInDays(new Date(egreso), new Date(ingreso));

    try {
        const alojamiento = await Alojamiento.findByPk(alojamientoId, {
            include: [Cabana, Parcela]
        });

        if (!alojamiento) throw new Error('Alojamiento no encontrado');

  
        let monto;
        if (alojamiento.tipo === 'cabana') {
            monto = cantidadDeDias * alojamiento.Cabana.precioPorDia;
        } else if (alojamiento.tipo === 'parcela') {
            monto = cantidadDePersonas * alojamiento.Parcela.precioPorPersona * cantidadDeDias;
        } else {
            throw new Error('Tipo de alojamiento no válido');
        }

        return monto;
    } catch (error) {
        throw new Error('Error al calcular el monto: ' + error.message);
    }
}


 



/*async function buscarDisponiblePorAlojamiento(req,res){
    const {id, alojamientoId}= req.body;
    const alojamiento = await Alojamiento.findByPk(id);
    const fechaDisponible = await Estadia.findOne({
        where: {alojamientoId,
            id=null
        }
    })
}*/

module.exports={buscarDisponiblePorFechas,buscarPorTipo,calcularMonto};