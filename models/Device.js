const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  operatingSystem: {
    type: String,
    required: true
  },
  hostname: {
    type: String,
    required: true
  },
  network: {
    type: String,
    required: true
  },
  systemRole: {
    type: String,
    required: true
  },
  hypervisorInstalledOn: {
    type: String,
    required: true
  },
  domainUserSignedIn: {
    type: String,
    required: true
  },
  zscalerUserSignedIn: {
    type: String,
    default: 'None'  // Change from required to optional with default
  },
  zscalerAppSegment: {
    type: String,
    default: 'None'  // Change from required to optional with default
  },
  notes: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;
