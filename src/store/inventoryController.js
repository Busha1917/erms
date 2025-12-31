const SparePart = require('./SparePart');
const asyncHandler = require('./asyncHandler');

const getInventory = asyncHandler(async (req, res) => {
  const parts = await SparePart.find({});
  res.json(parts);
});

const addPart = asyncHandler(async (req, res) => {
  const part = new SparePart(req.body);
  const createdPart = await part.save();
  res.status(201).json(createdPart);
});

const updatePart = asyncHandler(async (req, res) => {
  const part = await SparePart.findById(req.params.id);
  if (!part) return res.status(404).json({ message: 'Part not found' });

  const updatedPart = await SparePart.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedPart);
});

const deletePart = asyncHandler(async (req, res) => {
  const part = await SparePart.findById(req.params.id);
  if (!part) return res.status(404).json({ message: 'Part not found' });
  
  await part.deleteOne();
  res.json({ message: 'Part removed' });
});

module.exports = { getInventory, addPart, updatePart, deletePart };