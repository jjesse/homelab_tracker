import { Router } from 'express';
import { ensureAuthenticated } from '../config/auth.js';
import Device from '../models/Device.js';
import User from '../models/User.js';
import multer from 'multer';
import csv from 'fast-csv';
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	}
});

const upload = multer({
	dest: 'uploads/',
	fileFilter: function(req, file, cb) {
		if (!file.originalname.match(/\.(csv)$/)) {
			return cb(new Error('Only CSV files are allowed'));
		}
		cb(null, true);
	}
});

router.get('/', ensureAuthenticated, async (req, res) => {
	try {
		const devices = await Device.find({ user: req.user.id });
		res.json(devices);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post('/import', ensureAuthenticated, upload.single('csvFile'), async (req, res) => {
	try {
		if (!req.file) {
			req.flash('error_msg', 'Please select a file to import');
			return res.redirect('/dashboard');
		}

		const devices = [];
		await new Promise((resolve, reject) => {
			csv.parseFile(req.file.path, { headers: true })
				.on('data', (data) => {
					devices.push({
						name: data.name || data['Device Name'],
						ipAddress: data.ipAddress || data['IP Address'],
						operatingSystem: data.operatingSystem || data['Operating System'],
						hostname: data.hostname || data['Hostname'],
						network: data.network || data['Network'] || 'Default',
						systemRole: data.systemRole || data['System Role'] || 'Standard',
						hypervisorInstalledOn: data.hypervisorInstalledOn || data['Hypervisor'] || 'None',
						domainUserSignedIn: data.domainUserSignedIn || data['Domain User'] || 'None',
						zscalerUserSignedIn: data.zscalerUserSignedIn || data['Zscaler User'] || 'None',
						zscalerAppSegment: data.zscalerAppSegment || data['Zscaler Segment'] || 'None',
						notes: data.notes || data['Notes'] || '',
						user: req.user.id
					});
				})
				.on('end', resolve)
				.on('error', reject);
		});

		fs.unlinkSync(req.file.path);

		if (devices.length === 0) {
			req.flash('error_msg', 'No devices found in CSV file');
			return res.redirect('/dashboard');
		}

		const savedDevices = await Device.insertMany(devices);
		await User.findByIdAndUpdate(
			req.user.id,
			{ $push: { devices: { $each: savedDevices.map(d => d._id) } } }
		);

		req.flash('success_msg', `Successfully imported ${devices.length} devices`);
		res.redirect('/dashboard');
	} catch (err) {
		console.error('Import error:', err);
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		req.flash('error_msg', 'Error importing devices: ' + err.message);
		res.redirect('/dashboard');
	}
});

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
		await User.findByIdAndUpdate(
			req.user.id,
			{ $push: { devices: device._id } },
			{ new: true }
		);

		req.flash('success_msg', 'Device added successfully');
		res.redirect('/dashboard');
	} catch (err) {
		req.flash('error_msg', 'Error adding device');
		res.redirect('/dashboard');
	}
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
	try {
		const device = await Device.findOne({ 
			_id: req.params.id,
			user: req.user.id 
		});
		if (!device) {
			return res.status(404).json({ message: 'Device not found' });
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
		req.flash('error_msg', 'Error updating device');
		res.redirect('/dashboard');
	}
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
	try {
		const device = await Device.findOneAndDelete({ 
			_id: req.params.id,
			user: req.user.id 
		});
		if (!device) {
			return res.status(404).json({ message: 'Device not found' });
		}
		await User.findByIdAndUpdate(
			req.user.id,
			{ $pull: { devices: req.params.id } }
		);
		res.json({ message: 'Device deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

export default router;
