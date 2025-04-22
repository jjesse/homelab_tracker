const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Device = require('../models/Device');
const User = require('../models/User');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

// Configure multer for CSV uploads
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Fix mimetype checking to handle different CSV mime types
    const validMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv', 'text/x-csv'];
    if (!validMimeTypes.includes(file.mimetype)) {
      return cb(null, false);
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
router.post('/import', [ensureAuthenticated, upload.single('csvFile')], async (req, res) => {
  try {
    // Add error handling for missing file
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Please upload a valid CSV file'
      });
    }

    const devices = [];
    // Parse CSV with strict column validation
    await new Promise((resolve, reject) => {
      csv.parseFile(req.file.path, { 
        headers: true,
        strictColumnHandling: true,
        trim: true,
        skipRows: 0,
        validateHeader: true,
        headers: [
          'Device Name', 'IP Address', 'Operating System', 'Hostname',
          'Network', 'System Role', 'Hypervisor', 'Domain User',
          'Zscaler User', 'Zscaler Segment', 'Notes'
        ]
      })
        .on('data', (data) => {
          devices.push({
            name: data['Device Name'],
            ipAddress: data['IP Address'],
            operatingSystem: data['Operating System'],
            hostname: data['Hostname'],
            network: data['Network'],
            systemRole: data['System Role'],
            hypervisorInstalledOn: data['Hypervisor'],
            domainUserSignedIn: data['Domain User'],
            zscalerUserSignedIn: data['Zscaler User'],
            zscalerAppSegment: data['Zscaler Segment'],
            notes: data['Notes'],
            user: req.user.id
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insert devices and get their IDs
    const savedDevices = await Device.insertMany(devices);
    
    // Update user's devices array with new device IDs
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { devices: { $each: savedDevices.map(d => d._id) } } },
      { new: true }
    );

    // Set flag to reload charts
    req.session.reloadCharts = true;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    // Send JSON response instead of redirect
    res.json({ 
      success: true, 
      message: `Successfully imported ${devices.length} devices`
    });
  } catch (err) {
    console.error('CSV import error:', err);
    
    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      success: false, 
      message: err.message || 'Error importing CSV file. Please check the format and try again.'
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
