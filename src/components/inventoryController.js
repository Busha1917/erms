const SparePart = require('../models/SparePart');

const getInventory = async (req, res) => {
  const parts = await SparePart.find({});
  res.json(parts);
};

const addPart = async (req, res) => {
  const { name, category, quantity, minStock, price, status } = req.body;
  const part = new SparePart({ name, category, quantity, minStock, price, status });
  const createdPart = await part.save();
  res.status(201).json(createdPart);
};

const updatePart = async (req, res) => {
  const part = await SparePart.findById(req.params.id);
  if (part) {
    const updatedPart = await SparePart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPart);
  } else {
    res.status(404).json({ message: 'Part not found' });
  }
};

const deletePart = async (req, res) => {
  const part = await SparePart.findById(req.params.id);
  if (part) {
    await part.deleteOne();
    res.json({ message: 'Part removed' });
  } else {
    res.status(404).json({ message: 'Part not found' });
  }
};

module.exports = { getInventory, addPart, updatePart, deletePart };