var cheerio = require('cheerio'),
    _ = require('lodash');

exports.parse = function (html) {
    var resume = {};

    var $ = cheerio.load(html);
    resume.name = $('td tr:nth-child(1) tr:nth-child(2) span').text();
    var contactInfos = $('td tr:nth-child(1) table:nth-child(1) td:nth-child(2)').text().split('\n');
    var firstLine = contactInfos[0].split('|');
    resume.gender = firstLine[0].trim() === '男' ? 'male' : 'female';
    resume.married = firstLine[1].trim() !== '未婚';
    var match = firstLine[2].match(/\d+/g);
    resume.birthYear = match[0];
    resume.birthMonth = match[1];
    resume.residence = firstLine[3].split('：')[1].trim();
    resume.ghetto = firstLine[4].substr(5).trim();
    resume.educationLevel = firstLine[5].trim();
    var secondLine = _.filter(contactInfos[1].split(' '), function (item) {
        return item.length !== 0;
    });
    resume.politics = secondLine[0];
    resume.university = secondLine[1];
    resume.zipcode = secondLine[2].substr(0, 6);
    resume.mobile = secondLine[2].substr(6, 11);
    resume.email = contactInfos[2].split(': ')[1];

    resume.selfDescription = $('.resume_p:nth-child(1)').text().trim();
    resume.desiredPositions = $('td td td td tr:nth-child(2) td:nth-child(2)').text().split('，');
    resume.desiredSalary = $('td td td td tr:nth-child(3) td:nth-child(2)').text();
    resume.currentStatus = $('tr:nth-child(4) td:nth-child(2)').text();

    resume.workExperiences = [];
    $('td td tr:nth-child(2) table:nth-child(4) tr').slice(0, 1).each(function (i, elem) {
        var work = {};
        work.dateRange = $(elem).children().first().text().trim();
        work.work = $(elem).children().last().text().trim();
        resume.workExperiences.push(work);
    });

    resume.practices =
        $('tr:nth-child(6) table:nth-child(4) tr').map(function (index, elem) {
            return {dateRange: $(elem).children().first().text().trim(),
                content: $(elem).children().last().text().trim()};
        });

    resume.studyStatus = $('tr:nth-child(5) table:nth-child(4) td').text().trim();
    resume.educationHistory = $('tr:nth-child(4) table:nth-child(4) td').text();
    resume.projects = $('tr:nth-child(3) table:nth-child(4) td').html();

    resume.professionalSkills = $('tr:nth-child(9) table:nth-child(4) td').text();
    resume.papers = $('td table:nth-child(3) td').text();
    resume.intrests = $('table:nth-child(7) td').text();
    return resume;
};