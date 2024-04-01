const { string } = require('i/lib/util');
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    department : {
        type:String
    },
    image: {
        type: String,
        required: true
    }
});

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;
