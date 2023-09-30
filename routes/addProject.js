const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const User = require('../models/user')
const fetchuser = require('../middleware/fetchuser')



router.post('/', fetchuser, async (req, res) => {
	const userid = req.user.id
	const project = new Project({
		name: req.body.name,
		desc: req.body.desc,
	})
	try {
		const newProject = await project.save()
		try {
			let user = await User.find({_id : userid})
			console.log(user)
			let owner = user[0].projectlist;
			console.log(owner)
			owner.push(newProject._id);
			let filter = { _id: userid };
			let update = {projectlist:owner}
			user = await User.findOneAndUpdate(filter, update, { new: true });
			res.status(201).json(newProject)
		} catch (error) {
			let projectwala = await Project.findByIdAndDelete(newProject._id)
			
		res.status(400).json({ message: error.message })
		}
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})
router.delete('/', fetchuser, async (req, res) => {
	const userid = req.user.id
	try {
		const projects = await Project.findByIdAndDelete(req.body.id)
		try {
			let user = await User.find({ _id: userid })
			let owner = user[0].projectlist;
			console.log(owner)
			owner.pop(projects._id);
			let filter = { _id: userid };
			let update = { projectlist: owner }
			user = await User.findOneAndUpdate(filter, update, { new: true });
		} catch (error) {
			const newTask = await projects.save()
			res.status(400).json({ message: error.message })
		}
		res.json(projects)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})
router.get('/', fetchuser,async (req, res) => {
	const userid = req.user.id
	try {
		const projectlist = await Project.find().populate({path:"tasks"})
		res.json(projectlist)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

module.exports = router
