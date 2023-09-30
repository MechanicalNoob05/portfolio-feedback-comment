const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	details:{
		type:String,
		required:false
	},
	start_date:{
		type:Date,
		required:true,
		default: Date.now
	},
	end_date:{
		type:Date,
		required:true
	},
	priorty:{
		type:Boolean,
		default:false
	},
	status:{
		type:Boolean,
		default:false
	},
	created:{
		type:Date,
		required:true,
		default: Date.now
	},
}
)
module.exports = mongoose.model('task',taskSchema)
