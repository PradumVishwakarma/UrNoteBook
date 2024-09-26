const express = require('express');
const router = express.Router();
const fetchUser = require('../Middleware/fetchUser');
const notes = require('../models/Note');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');

router.get('/fetchall', fetchUser, async (req, res) => {
    try {
        const Note = await notes.find({ user: req.user.id });
        if (!Note) {
            return res.status(404).send("No notes found");
        }
        res.json(Note);

    } catch (error) {
        console.log(error);
        res.status(500).send("Some Error Happen");
    }
})

router.post('/addnote', fetchUser, [
    body('title', "Enter Valid Name").isLength({ min: 3 }),
    body('description', "Enter must be Valid description (5 chr)").isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ result: result.array() });
        }

        const note = new notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();

        res.json(saveNote)

    } catch (error) {
        console.log(error);
        res.status(401).send("Some Error Happen");
    }
})


router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        const newNotes = {};
        if (title) { newNotes.title = title };
        if (description) { newNotes.description = description };
        if (tag) { newNotes.tag = tag };

        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("No notes found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNotes }, { new: true })

        res.json({ note });

    } catch (error) {
        console.log(error);
        res.status(401).send("Some Error Happen");
    }

})

router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    try {
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("No notes found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)

        res.json({ "Successfully": "Note has been Deleted", note: note });

    } catch (error) {
        console.log(error);
        res.status(401).send("Some Error Happen");
    }
})


module.exports = router