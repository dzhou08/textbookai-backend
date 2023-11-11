'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const Section = require('../models/Section');

// search
router.get('/', (request, response) => {
    if (request.query.search) {
        Section.find({$text: {$search: request.query.search}}, (err, res) => {
            if (err) {
                console.error(err);
                return response.sendStatus(500);
            }
            response.send(res);
        });
    }
    else {
        Section.find({}, (err, res) => {
            if (err) {
                console.error(err);
                return response.sendStatus(500);
            }
            response.send(res);
        });
    }
});

router.get('/:id', (request, response) => {

    const { id } = request.params;

    Section.findOne({ _id: id }, (err, res) => {
        if (err) {
            console.error(err);
            return response.sendStatus(500);
        }
        response.send(res);
    });
});

router.post('/', (request, response) => {

    const {chapterNumber, sectionNumber, sectionTitle, sectionImage, sectionImageDescription, sectionText, sectionSummary} = request.body;

    if (!chapterNumber || !sectionNumber || !sectionTitle || !sectionImage || !sectionImageDescription || !sectionText || !sectionSummary) return response.sendStatus(400);

    const section = new Section({chapterNumber, sectionNumber, sectionTitle, sectionImage, sectionImageDescription, sectionText, sectionSummary});
    section.save()
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.put('/:id', async (request, response) => {

    const { id } = request.params;
    const {chapterNumber, sectionNumber, sectionTitle, sectionImage, sectionImageDescription, sectionText, sectionSummary} = request.body;

    if (!chapterNumber && !sectionNumber && !sectionTitle && !sectionImage && !sectionImageDescription && !sectionText && !sectionSummary) return response.sendStatus(400);

    Section.findOneAndUpdate({ _id: id }, 
        {chapterNumber, sectionNumber, sectionTitle, sectionImage, sectionImageDescription, sectionText, sectionSummary})
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.delete('/:id', async (request, response) => {

    const { id } = request.params;

    Section.deleteOne({ _id: id })
        .then(() => response.sendStatus(200))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

module.exports = router;