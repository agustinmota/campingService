const Accommodation = require("../models/Accommodation");


async function index(req, res) {
    const accommodations = await Accommodation.findAll();
    res.json(accommodations);
}

async function show(req, res) {
        const { id } = req.params;
      try { const accommodation = await Accommodation.findByPk(id);
        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
        }
        res.json(accommodation);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    }

async function create(req, res) {

    const { type, identifier } = req.body;
    try {
        const newAccommodation = await Accommodation.create({ type, identifier });
        res.status(201).json(newAccommodation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function edit(req, res) {
    const { id } = req.params;
    const { maxCapacity, identifier } = req.body;
    try {
        const accommodation = await Accommodation.findByPk(id);
        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
        }
        accommodation.maxCapacity = maxCapacity;
        accommodation.identifier = identifier;
        await accommodation.save();
        res.json(accommodation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}   

async function destroy(req, res) {
    const {id} = req.params;
    try {
        const accommodation = await Accommodation.findByPk(id);
        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
        } else {
            await accommodation.destroy();
            res.json({ message: "Accommodation deleted" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

        module.exports = {
            show,
            index,
            create,
            edit,
            destroy
            
        };