'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const Chapter = new Schema({
    id: { type: Number, unique: true, sparse: true },
    chapterNumber: { type: String, required: true, max: 2 },
    chapterTitle: { type: String, required: true, max: 255 },
    chapterImage: { type: String, required: true, max: 255 },
    chapterImageDescription: { type: String, required: true},
    chapterIntroduction: { type: String, required: true},
});
Chapter.index({'$**': 'text'});

module.exports = mongoose.model('Chapter', Chapter);
