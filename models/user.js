const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	projectlist: [
		{
			type: mongoose.Schema.Types.ObjectId, 
			required: false, ref: "project"
		}
	],
	created:{
		type:Date,
		required:true,
		default: Date.now
	},

})

module.exports = mongoose.model('user',userSchema)
