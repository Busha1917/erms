const SystemSetting = require('./SystemSetting');

const getSettings = async (req, res) => {
  let settings = await SystemSetting.findOne();
  if (!settings) {
    settings = await SystemSetting.create({});
  }
  res.json(settings);
};

const updateSettings = async (req, res) => {
  let settings = await SystemSetting.findOne();
  if (!settings) {
    settings = await SystemSetting.create(req.body);
  } else {
    settings = await SystemSetting.findByIdAndUpdate(settings._id, req.body, { new: true });
  }
  res.json(settings);
};

module.exports = { getSettings, updateSettings };