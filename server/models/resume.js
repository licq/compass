var mongoose = require('mongoose');

var resumeSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    applyPosition:String,
    applyDate: {
        type: Date,
        default: Date.now()
    },
    matchRate: Number,
    currentState: {
        type: String,
        enum: ['','']
    },

    birthDay: {
        year: Number,
        month: Number,
        date: Number
    },

    ghetto: String,
    job51Id: String,
    selfDescription: String,
    entryTime: String,
    desiredIndustris: String,
    desiredCities: String,
    desiredSalary: String,
    targetResponsibility: String,

    workExperiences: [{
        from: String,
        to: String,
        company: String,
        industry: String,
        department: String,
        job: String,
        jobResponsibility: String
    }],

    projects: [{
        name: String,
        softwareEnviroment: String,
        hardwareEnviroment: String,
        developmentTools: String,
        description: String,
        responsibility: String
    }],

    educationHistory: [{
        from: String,
        to: String,
        university: String,
        major: String,
        educationLevel: String
    }],

    trainingHistory: [{
        from: String,
        to: String,
        organization: String,
        subject: String
        status: String
        description: String
    }],

    certificates: [{
        date: String,
        subject: String,
        score: String
    }],

    languageSkills: [{
        subject: String,
        skill: String
    }],

    professionalSkills: [{
        subject: String,
        level: String,
        howlong: String
    }]

});
