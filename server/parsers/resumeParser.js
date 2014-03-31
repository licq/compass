var cheerio = require('cheerio'),
    _ = require('lodash');

exports.parse = function (html) {
    var resume = {};

    var $ = cheerio.load(html);
    var topTableTrs = $('body > table').eq(1).find('table').first().children();
    var contactTr = topTableTrs.first().find('table').children().eq(1);
    resume.name = contactTr.children().first().find('span').text();
    var contactInfos = contactTr.children().eq(1).text().split('\n');
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


    var secondTable = $(topTableTrs).eq(1).find('td table tr td table:nth-child(4)');
    resume.selfDescription = secondTable.find('div.resume_p').text().trim();
    resume.desiredPositions = $(secondTable).find('table tr:nth-child(2)').text();
    console.log(secondTable);

    return resume;
};