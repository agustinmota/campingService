const Alojamiento = require("../models/Alojamiento");


async function index(req, res) {
    const alojamientos = await Alojamiento.findAll();
    res.json(alojamientos);
}

async function show(req, res) {
        const { id } = req.params;
      try { const alojamiento = await Alojamiento.findByPk(id);
        if (!alojamiento) {
            return res.status(404).json({ error: "Alojamiento no encontrado" });
        }
        res.json(alojamiento);
       
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    }

async function create(req, res) {
    console.log(req.body);
    const {tipo, identificador} = req.body;
    try {
        const newAlojamiento = await Alojamiento.create({ tipo, identificador });
        res.status(201).json(newAlojamiento);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function edit(req, res) {
    const { id } = req.params;
    const { maximaCapacidad, identificador } = req.body;
    try {
        const alojamiento = await Alojamiento.findByPk(id);
        if (!alojamiento) {
            return res.status(404).json({ error: "Alojamiento no encontrado" });
        }
        alojamiento.maximaCapacidad = maximaCapacidad;
        alojamiento.identificador = identificador;
        await alojamiento.save();
        res.json(alojamiento);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}   

async function destroy(req, res) {
    const {id} = req.params;
    try {
        const alojamiento = await alojamiento.findByPk(id);
        if (!alojamiento) {
            return res.status(404).json({ error: "Alojamiento no encontrado" });
        } else {
            await alojamiento.destroy();
            res.json({ message: "Alojamiento eliminado" });
            };
    } catch (error) {
        res.status(400).json({ error: error.message })}};

        module.exports = {
            show,
            index,
            create,
            edit,
            destroy
        };