const mongoose = require('mongoose')
const feedbackSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	linkedin:{
		type:String,
		required:true
	},
	feedback:{
		type:String,
		required:true
	},
	created:{
		type:Date,
		required:true,
		default: Date.now
	},

})
module.exports = mongoose.model('Feedback',feedbackSchema)
