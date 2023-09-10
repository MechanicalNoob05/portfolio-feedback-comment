const express = require('express')
const router = express.Router()
const Feedback = require('../models/feedback')

router.get('/', async (req,res)=>{
	try{
		const feedback = await Feedback.find()
		res.json(feedback)
	}catch(err){
		res.status(500).json({message:err.message})
	}
})

router.post('/',async(req,res)=>{
	const feedback = new Feedback({
		name: req.body.name,
		linkedin :req.body.linkedin,
		feedback :req.body.feedback,
	})
	try {
		const newFeedback = await feedback.save()
		res.status(201).json(newFeedback)
	} catch (err) {
		res.status(400).json({message:err.message})
	}
})

module.exports = router
