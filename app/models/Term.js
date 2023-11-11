'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const Term = new Schema({
    id: { type: Number, unique: true, sparse: true },
    chapterNumber: { type: String, required: true, max: 2 },
    title: { type: String, required: true, max: 255 },
    description: { type: String, required: true},
    pinTerm: { type: Boolean, default:false}
});
Term.index({'$**': 'text'});

module.exports = mongoose.model('Term', Term);