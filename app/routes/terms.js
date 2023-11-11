'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const Term = require('../models/Term');

// search
router.get('/', (request, response) => {
    if (request.query.search) {
        Term
        .find({$text: {$search: request.query.search}}, (err, res) => {
            if (err) {
                console.error(err);
                return response.sendStatus(500);
            }
            response.send(res);
        })
        .sort({ chapterNumber: 1, title:1})
    }
    else {
        Term.find({}, (err, res) => {
            if (err) {
                console.error(err);
                return response.sendStatus(500);
            }
            response.send(res);
        })
        .sort({ chapterNumber: 1, title:1});
    }
});

// search
router.get('/getPinTerms', (request, response) => {
    Term.find({pinTerm:true}, (err, res) => {
        if (err) {
            console.error(err);
            return response.sendStatus(500);
        }
        response.send(res);
    })
    .sort({ chapterNumber: 1, title:1});
});

router.get('/:id', (request, response) => {

    const { id } = request.params;

    Term.findOne({ _id: id }, (err, res) => {
        if (err) {
            console.error(err);
            return response.sendStatus(500);
        }
        response.send(res);
    });
});

router.post('/', (request, response) => {

    const {chapterNumber, title, description} = request.body;

    if (!chapterNumber || !title || !description) return response.sendStatus(400);

    const term = new Term({chapterNumber, title, description});
    term.save()
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.put('/:id', async (request, response) => {

    const { id } = request.params;
    const {chapterNumber, title, description, pinTerm} = request.body;

    if (!chapterNumber && !title && !description) return response.sendStatus(400);

    Term.findOneAndUpdate({ _id: id }, 
        {chapterNumber, title, description, pinTerm})
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.delete('/:id', async (request, response) => {

    const { id } = request.params;

    Term.deleteOne({ _id: id })
        .then(() => response.sendStatus(200))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

module.exports = router;