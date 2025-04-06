const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Device = require('../models/Device');
const User = require('../models/User'); // Added User model

// Get all devices for a user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user.id });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    console.error(err);
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
