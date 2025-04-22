const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Device = require('../models/Device');
const User = require('../models/User');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

// Configure multer for CSV uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
});

// Get all devices for a user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user.id });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Import devices from CSV - Move this BEFORE the /:id routes
router.post('/import', ensureAuthenticated, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const devices = [];
    await new Promise((resolve, reject) => {
      csv.parseFile(req.file.path, {
        headers: true,
        trim: true
      })
      .on('data', (data) => {
        devices.push({
          name: data.name,
          ipAddress: data.ipAddress,
          operatingSystem: data.operatingSystem,
          hostname: data.hostname,
          network: data.network || 'Default',
          systemRole: data.systemRole || 'Standard',
          hypervisorInstalledOn: data.hypervisorInstalledOn || 'None',
          domainUserSignedIn: data.domainUserSignedIn || 'None',
          zscalerUserSignedIn: data.zscalerUserSignedIn || 'None',
          zscalerAppSegment: data.zscalerAppSegment || 'None',
          notes: data.notes || '',
          user: req.user.id
        });
      })
      .on('end', resolve)
      .on('error', reject);
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    if (devices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No devices found in CSV file'
      });
    }

    const savedDevices = await Device.insertMany(devices);
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { devices: { $each: savedDevices.map(d => d._id) } } }
    );

    res.json({
      success: true,
      message: `Successfully imported ${devices.length} devices`,
      deviceCount: devices.length
    });
  } catch (err) {
    console.error('CSV import error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: err.message || 'Error importing devices'
    });
  }
});

// Get single device
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new device
router.post('/add', ensureAuthenticated, async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body for debugging
    const newDevice = new Device({
      name: req.body.name,
      ipAddress: req.body.ipAddress,
      operatingSystem: req.body.operatingSystem,
      hostname: req.body.hostname,
      network: req.body.network,
      systemRole: req.body.systemRole,
      hypervisorInstalledOn: req.body.hypervisorInstalledOn,
      domainUserSignedIn: req.body.domainUserSignedIn,
      zscalerUserSignedIn: req.body.zscalerUserSignedIn,
      zscalerAppSegment: req.body.zscalerAppSegment,
      notes: req.body.notes,
      user: req.user.id
    });

    const device = await newDevice.save();
    // Update user's devices array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { devices: device._id } },
      { new: true }
    );

    req.flash('success_msg', 'Device added successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error adding device:', err); // Log the error for debugging
    req.flash('error_msg', 'Error adding device');
    res.redirect('/dashboard');
  }
});

// Update device
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Validate that updates are allowed fields
    const allowedUpdates = [
      'name', 'ipAddress', 'operatingSystem', 'hostname',
      'network', 'systemRole', 'hypervisorInstalledOn',
      'domainUserSignedIn', 'zscalerUserSignedIn',
      'zscalerAppSegment', 'notes'
    ];

    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(updatedDevice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update device - support both PUT and POST for edit operations
router.post('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });
    
    if (!device) {
      req.flash('error_msg', 'Device not found');
      return res.redirect('/dashboard');
    }

    const allowedUpdates = [
      'name', 'ipAddress', 'operatingSystem', 'hostname',
      'network', 'systemRole', 'hypervisorInstalledOn',
      'domainUserSignedIn', 'zscalerUserSignedIn',
      'zscalerAppSegment', 'notes'
    ];

    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    await Device.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    req.flash('success_msg', 'Device updated successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error updating device:', err);
    req.flash('error_msg', 'Error updating device');
    res.redirect('/dashboard');
  }
});

// Delete device
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.id 
    });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Remove device reference from user
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { devices: req.params.id } }
    );

    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
