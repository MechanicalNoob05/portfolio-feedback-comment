const mongoose = require('mongoose')
const projectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	tasks: [
		{
			type: mongoose.Schema.Types.ObjectId, 
			required: false, 
			ref: "task"
		}
	],
	colaborator: [
		{
			type: mongoose.Schema.Types.ObjectId, 
			required: false, 
			ref: "user"
		}
	],
	created: {
		type: Date,
		required: true,
		default: Date.now
	},

})

module.exports = mongoose.model('project', projectSchema)
