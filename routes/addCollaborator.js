const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const User = require('../models/user')
const fetchuser = require('../middleware/fetchuser')



router.post('/', async (req, res) => {
	try {
		try {
			const projectcolabs = await Project.find({ _id: req.body.id })
			let owner = projectcolabs[0].colaborator;
			owner.push(req.body.colab);
			let filter = { _id: req.body.id };
			let update = { colaborator: owner }
			let colabuser = await Project.findOneAndUpdate(filter, update, { new: true });
			res.status(201).json(colabuser)
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

router.get('/', fetchuser, async (req, res) => {
	const userid = req.user.id
	try {
		const projectlist = await Project.find().populate({ path: "tasks" })
		res.json(projectlist)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})
router.delete('/', fetchuser, async (req, res) => {

	try {
		let project = await Project.find({ _id: req.body.id })
		let owner = project[0].colaborator;
		console.log(owner)
		owner.pop(req.body.colab);
		let filter = { _id: req.body.id };
		let update = { colaborator: owner }
		project = await Project.findOneAndUpdate(filter, update, { new: true });
		res.json(project)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}

})

module.exports = router
