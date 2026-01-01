const Department = require('./Department');
const asyncHandler = require('./asyncHandler');

const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({}).sort({ name: 1 });
  res.json(departments);
});

const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, manager, location } = req.body;
  const exists = await Department.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error('Department already exists');
  }
  const department = await Department.create({ name, description, manager, location });
  res.status(201).json(department);
});

const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }
  const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }
  await department.deleteOne();
  res.json({ message: 'Department removed' });
});

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };