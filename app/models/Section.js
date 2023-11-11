'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const Section = new Schema({
    id: { type: Number, unique: true, sparse: true },
    chapterNumber: { type: String, required: true, max: 2 },
    sectionNumber: { type: String, required: true, max: 2 },
    sectionTitle: { type: String, required: true, max: 255 },
    sectionImage: { type: String, required: true, max: 255 },
    sectionImageDescription: { type: String, required: true},
    sectionText: { type: String, required: true},
    sectionSummary: { type: String, required: true},
});
Section.index({'$**': 'text'});

module.exports = mongoose.model('Section', Section);