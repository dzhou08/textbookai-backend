'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { port, mongoUrl } = require('./app/config');
const cors = require("cors");



const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));
//app.use(require('./app/routes'));

// routes
const chaptersRoute = require('./app/routes/chapters')
app.use("/chapters", chaptersRoute);

const sectionsRoute = require('./app/routes/sections')
app.use("/sections", sectionsRoute);

const termsRoute = require('./app/routes/terms')
app.use("/terms", termsRoute);

const questionsRoute = require('./app/routes/questions')
app.use("/questions", questionsRoute);

const openaiRoute = require('./app/routes/openai')
app.use("/openai", openaiRoute);

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => app.listen(port, () => console.log(`Listening on port: ${port}`)));
