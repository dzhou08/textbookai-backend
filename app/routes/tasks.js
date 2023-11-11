'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const Task = require('../models/task');

router.get('/', (request, response) => {

    Task.find({}, (err, res) => {
        if (err) {
            console.error(err);
            return response.sendStatus(500);
        }
        response.send(res);
    });
});

router.get('/:id', (request, response) => {

    const { id } = request.params;

    Task.findOne({ _id: id }, (err, res) => {
        if (err) {
            console.error(err);
            return response.sendStatus(500);
        }
        response.send(res);
    });
});

router.post('/', (request, response) => {

    const { name, desc } = request.body;

    if (!name || !desc) return response.sendStatus(400);

    const task = new Task({ name, desc });
    task.save()
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.put('/:id', async (request, response) => {

    const { id } = request.params;
    const { name, desc } = request.body;

    if (!name && !desc) return response.sendStatus(400);

    Task.findOneAndUpdate({ _id: id }, { name, desc })
        .then(res => response.send(res))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

router.delete('/:id', async (request, response) => {

    const { id } = request.params;

    Task.deleteOne({ _id: id })
        .then(() => response.sendStatus(200))
        .catch(e => {
            console.error(e);
            response.sendStatus(500);
        });
});

module.exports = router;