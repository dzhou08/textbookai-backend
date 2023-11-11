'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const Task = new Schema({
    id: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true, max: 60 },
    desc: { type: String, required: true, max: 255 }
});

module.exports = mongoose.model('Task', Task);
