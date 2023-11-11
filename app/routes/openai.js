'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const Section = require('../models/Section');

const OpenAI = require("openai");

const openai = new OpenAI({
    API_KEY: process.env.OPENAI_API_KEY,
});

router.post('/generateNote',  async (request, response) => {

    console.log("in openai generateNotes. ");
    const { section_id } = request.body;
    
    var sectionText = "";

    await Section.findOne({ _id: section_id }, (err, res) => {
        if (err) {
            console.error(err);
            return response.sendStatus(500);
        }
        sectionText = res.sectionText;
    });
    // OpenAI model can only take 4097 tokens on one call, trim the string is necessary
    if (sectionText.length > 4096)
    {
        sectionText = sectionText.slice(0, 4096);
    }

    // use OpenAI to generate Cornell-style two column note
    const chatCompletion = await openai.chat.completions.create({
        messages: 
        [
            {
                "role": "system", 
                "content": "You are experienced High School AP US History Teacher, and very skilled at taking notes from textbook."
            },
            {
                "role": "user", 
                "content": 
                "Based on the textbook content```" + sectionText + 
                "```, please take note with the Cornell notes format and distill all important concepts. \
                Provide format output well as an HTML Table element, with a Term column and Definition column. \
                Use light green as the background color for Table header row; Bold the text inside Term column. \
                Use table boarder on all sides and between rows.\
                The term should be a distinct identifier for the definition. \
                Please make sure that you distill the true meaning of the terms into the definition \
                and DO NOT just repeat the sentence after the term. " 
            },
        ],
        model: "gpt-3.5-turbo",
    });
    if (chatCompletion['choices'])
    {
        response.send(chatCompletion['choices'][0]['message']['content'])
    }
    else
    {
        response.send("No feedback from OpenAI.")
    }
}),

router.post('/generateAnswer', async (request, response) => {
    console.log("in openai generateAnswer post /. ")

    const {question_id, chapter_number, question_text, answer_input} = request.body;

    if (!question_id || !chapter_number || !question_text || !answer_input) return response.sendStatus(400);

    // get section text 
    const searchString = "Chapter " + chapter_number + " " + question_text;
    var allSectionText = "";
    await Section.find({$text: {$search: searchString}}, function (err, sections) { 
        if (err){ 
            console.log(err); 
        } 
        else{ 
            // concatenate section text
            let i = 0;
            while (i < sections.length) {
                allSectionText = allSectionText.concat(" ", sections[i].sectionText);
                i++;
            }
        } 
    });
    // OpenAI model can only take 4097 tokens on one call, trim the string is necessary
    if (allSectionText.length > 4096)
    {
        allSectionText = allSectionText.slice(0, 4096);
    }
    const chatCompletion = await openai.chat.completions.create({
        messages: 
        [
            {
                "role": "system", 
                "content": "You are experienced High School AP US History Teacher. \
                Speak as if you are giving feedback directly to the student, i.e. use second-person pronouns, such as 'you' or 'your'."
            },
            {
                "role": "user", 
                "content": 
                "Here is the question: " + question_text + " and here is the student submitted answer: " + answer_input + 
                ". Give your suggestion based on the related textbook content: ```" + allSectionText + "``` \
                and identify relevant sentences or paragraphs to be included in the feedback for the student to review. \
                You should not give direct answer, but rather just provide brief, to-the-point feedback with no elaboration. \
                Give feedback on separate lines for the following rubric criteria: \
                1. Claim: Does the student directly answers the question; \
                2. Evidence: Provides specific vocab; \
                3. Reason: Explains why the historic event is significant.\
                Provide output in HTML format, do not repeat the student asnwers. \
                The output should start with a 'Comment' section list feedback for each rubric criteria, \
                and a 'Summary' section feedback element for general comment. \
                When the answer is good enough, just say 'Good Job!' in the 'Summary' element. " 
            },
        ],
        model: "gpt-3.5-turbo",
    });
    if (chatCompletion['choices'])
    {
        response.send(chatCompletion['choices'][0]['message']['content'])
    }
    else
    {
        response.send("No feedback from OpenAI.")
    }
});


module.exports = router;