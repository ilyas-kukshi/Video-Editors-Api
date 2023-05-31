const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

const educationSchema = new mongoose.Schema({
    collegeName: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
});

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // expertiseLevel: {
    //     type: String,
    //     required: true,
    // },
});

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    personalInfo: personalInfoSchema,
    education: [educationSchema],
    skills: [skillSchema],
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
