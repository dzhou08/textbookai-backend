'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const Chapter = require('../models/Chapter');

// search
router.get('/', (request, response) => {
    console.log(request.query.search);
    if (request.query.search) {
        Chapter.find({$text: {$search: request.query.search}}, (err, res) => {
            if (err) {
                console.error(err);
                return response.sendStatus(500);
            }
            response.send(res);
        });
    }
    else {
        Chapter.find({}, (err, res) => {
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

    Chapter.findOne({ _id: id }, (err, res) => {
        if (err) {
            console.error(err);
            return response.sendStatus(500);
        }
        response.send(res);
    });
});

router.post('/', (request, response) => {

    const {chapterNumber, chapterTitle, chapterImage, chapterImageDescription, chapterIntroduction} = request.body;

    if (!chapterNumber || !chapterTitle || !chapterImage || !chapterImageDescription || !chapterIntroduction) return response.sendStatus(400);

    const chapter = new Chapter({chapterNumber, chapterTitle, chapterImage, chapterImageDescription, chapterIntroduction});
    chapter.save()
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.put('/:id', async (request, response) => {

    const { id } = request.params;
    const {chapterNumber, chapterTitle, chapterImage, chapterImageDescription, chapterIntroduction} = request.body;

    if (!chapterNumber && !chapterTitle && !chapterImage && !chapterImageDescription && !chapterIntroduction) return response.sendStatus(400);

    Chapter.findOneAndUpdate({ _id: id }, 
        {chapterNumber, chapterTitle, chapterImage, chapterImageDescription, chapterIntroduction})
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.delete('/:id', async (request, response) => {

    const { id } = request.params;

    Chapter.deleteOne({ _id: id })
        .then(() => response.sendStatus(200))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

module.exports = router;