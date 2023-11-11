'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const Question = new Schema({
    id: { type: Number, unique: true, sparse: true },
    chapterNumber: { type: String, required: true, max: 2 },
    text: { type: String, required: true },
});
Question.index({'$**': 'text'});

module.exports = mongoose.model('Question', Question);