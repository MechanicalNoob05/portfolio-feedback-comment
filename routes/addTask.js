const express = require('express')
const router = express.Router()
const Task = require('../models/tasks')
const Project = require('../models/project')
const fetchuser = require('../middleware/fetchuser')

router.get('/', fetchuser, async (req, res) => {
	try {
		const tasks = await Task.find()
		res.json(tasks)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.delete('/', fetchuser, async (req, res) => {
	try {
		const tasks = await Task.findByIdAndDelete(req.body.id)
		try {
			let project = await Project.find({ _id: req.body.projectid })
			let owner = project[0].tasks;
			console.log(owner)
			owner.pop(tasks._id);
			let filter = { _id: req.body.projectid };
			let update = { tasks: owner }
			project = await Project.findOneAndUpdate(filter, update, { new: true });
		} catch (error) {
			const newTask = await tasks.save()
			res.status(400).json({ message: error.message })
		}
		res.json(tasks)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.post('/', fetchuser, async (req, res) => {
	try {
		const task = new Task({
			title: req.body.title,
			details: req.body.details,
			start_date: req.body.start_date,
			end_date: req.body.end_date,
			priorty: req.body.priorty,
			status: req.body.status
		})
		const newTask = await task.save()
		try {
			let project = await Project.find({ _id: req.body.id })
			console.log(project)
			let owner = project[0].tasks;
			console.log(owner)
			owner.push(newTask._id);
			let filter = { _id: req.body.id };
			let update = { tasks: owner }
			project = await Project.findOneAndUpdate(filter, update, { new: true });
		} catch (error) {
			let taskwala = await Task.findByIdAndDelete(newTask._id)
			res.status(400).json({ message: error.message })
		}
		res.status(201).json(newTask)
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

module.exports = router
