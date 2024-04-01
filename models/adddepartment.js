
const mongoose = require('mongoose');

const Departmentschema = new mongoose.Schema({
    department: { type: String, required: true, unique: true }
 });
 

const DepModel = mongoose.model('Department', Departmentschema);

module.exports = DepModel;
