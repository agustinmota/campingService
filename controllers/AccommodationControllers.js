const Accommodation = require("../models/Accommodation");
const { notFound, serverError } = require("../utils/httpResponses");


async function index(req, res) {
  try {
    const accommodations = await Accommodation.findAll();
    res.json(accommodations);
  } catch (error) {
    serverError(res, error);
  }
}

async function show(req, res) {
        const { id } = req.params;
      try { const accommodation = await Accommodation.findByPk(id);
        if (!accommodation) {
            return notFound(res, "Accommodation");
        }
        res.json(accommodation);

    } catch (error) {
        serverError(res, error);
    }
    }

async function create(req, res) {

    const { type, identifier } = req.body;
    try {
        const newAccommodation = await Accommodation.create({ type, identifier });
        res.status(201).json(newAccommodation);
    } catch (error) {
        serverError(res, error);
    }
}

async function edit(req, res) {
    const { id } = req.params;
    const { maxCapacity, identifier } = req.body;
    try {
        const accommodation = await Accommodation.findByPk(id);
        if (!accommodation) {
            return notFound(res, "Accommodation");
        }
        accommodation.maxCapacity = maxCapacity;
        accommodation.identifier = identifier;
        await accommodation.save();
        res.json(accommodation);
    } catch (error) {
        serverError(res, error);
    }
}   

async function destroy(req, res) {
    const {id} = req.params;
    try {
        const accommodation = await Accommodation.findByPk(id);
        if (!accommodation) {
            return notFound(res, "Accommodation");
        } else {
            await accommodation.destroy();
            res.json({ message: "Accommodation deleted" });
        }
    } catch (error) {
        serverError(res, error);
    }
};

        module.exports = {
            show,
            index,
            create,
            edit,
            destroy
            
        };
