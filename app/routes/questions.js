'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const Question = require('../models/Question');

// search
router.get('/', (request, response) => {
    console.log(request.query.search);
    if (request.query.search) {
        Question.find({$text: {$search: request.query.search}}, (err, res) => {
            if (err) {
                console.error(err);
                return response.sendStatus(500);
            }
            response.send(res);
        });
    }
    else {
        Question.find({}, (err, res) => {
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

    Question.findOne({ _id: id }, (err, res) => {
        if (err) {
            console.error(err);
            return response.sendStatus(500);
        }
        response.send(res);
    });
});

router.post('/', (request, response) => {

    const {chapterNumber, text} = request.body;

    if (!chapterNumber || !text) return response.sendStatus(400);

    const question = new Question({chapterNumber, text});
    question.save()
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.put('/:id', async (request, response) => {

    const { id } = request.params;
    const {chapterNumber, text} = request.body;

    if (!chapterNumber && !text) return response.sendStatus(400);

    Question.findOneAndUpdate({ _id: id }, 
        {chapterNumber, text})
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.delete('/:id', async (request, response) => {

    const { id } = request.params;

    Question.deleteOne({ _id: id })
        .then(() => response.sendStatus(200))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

module.exports = router;