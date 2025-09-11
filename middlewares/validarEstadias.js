const Alojamiento = require('../models/Alojamiento');
const Estadia = require('../models/Estadia');
const Cabana = require('../models/Cabana');
const Parcela = require('../models/Parcela');
const { Op } = require('sequelize');




async function validarEstadia(req, res, next) {
    const { ingreso, egreso, alojamientoId, cantidadDePersonas } = req.body;

    try {
  
        const alojamiento = await Alojamiento.findByPk(alojamientoId, {
    include: [
        { model: Cabana, required: false },
        { model: Parcela, required: false }
    ]
});


let maximaCapacidad;
if (alojamiento.Cabana) {
    maximaCapacidad = alojamiento.Cabana.maximaCapacidad;
} else if (alojamiento.Parcela) {
    maximaCapacidad = alojamiento.Parcela.maximaCapacidad;
}

if (cantidadDePersonas > maximaCapacidad) {
    return res.status(400).json({ message: 'Se supera la capacidad máxima del alojamiento' });
}

        if (!alojamiento) {
            return res.status(404).json({ message: 'Alojamiento no encontrado' });
        }

       


        const conflicto = await Estadia.findOne({
            where: {
                alojamientoId,
                ingreso: { [Op.lt]: egreso },   
                egreso: { [Op.gt]: ingreso }    
            }
        });

        if (conflicto) {
            return res.status(400).json({ message: 'El alojamiento no está disponible en esas fechas' });
        }

        next(); 
    } catch (error) {
        res.status(500).json({ message: 'Error al validar la estadía', error: error.message });
    }
}
module.exports = validarEstadia;