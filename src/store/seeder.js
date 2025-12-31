const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');
const User = require('./User');
const Device = require('./Device');
const RepairRequest = require('./RepairRequest');
const SparePart = require('./SparePart');
const Notification = require('./Notification');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Device.deleteMany();
    await RepairRequest.deleteMany();
    await SparePart.deleteMany();
    await Notification.deleteMany();

    // Create Users
    const users = await User.create([
      {
        name: 'Admin User',
        username: 'admin',
        email: 'admin@example.com'.toLowerCase(),
        password: '123', // Will be hashed by pre-save hook
        role: 'admin',
        department: 'IT',
        phone: '555-0100',
        address: 'Server Room 1'
      },
      {
        name: 'Technician Sarah',
        username: 'sarah',
        email: 'sarah@example.com',
        password: '123',
        role: 'technician',
        department: 'IT',
        specialty: 'Laptops',
        phone: '555-0101'
      },
      {
        name: 'User John',
        username: 'john',
        email: 'john@example.com',
        password: '123',
        role: 'user',
        department: 'HR',
        phone: '555-0102',
        address: 'HR Office 101'
      }
    ]);

    const admin = users[0];
    const tech = users[1];
    const user = users[2];

    // Create Devices
    const devices = await Device.create([
      {
        deviceName: 'Dell Latitude 5420',
        serialNumber: 'SN-DELL-001',
        type: 'Laptop',
        model: 'Latitude 5420',
        assignedToId: user._id,
        status: 'Active'
      },
      {
        deviceName: 'HP LaserJet Pro',
        serialNumber: 'SN-HP-002',
        type: 'Printer',
        model: 'M404n',
        assignedToId: admin._id,
        status: 'Active'
      }
    ]);

    // Create Inventory
    await SparePart.create([
      { name: 'Laptop Screen 14"', category: 'Screen', quantity: 5, price: 120.00 },
      { name: 'SSD 512GB', category: 'Storage', quantity: 10, price: 80.00 },
      { name: 'DDR4 RAM 8GB', category: 'Memory', quantity: 20, price: 45.00 }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Device.deleteMany();
    await RepairRequest.deleteMany();
    await SparePart.deleteMany();
    await Notification.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}