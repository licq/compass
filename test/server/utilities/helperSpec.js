var expect = require('chai').expect,
    helper = require('../../../server/utilities/helper'),
    cheerio = require('cheerio');

describe('helper', function () {
    describe('#onlyNumber', function () {
        it('should only return the number string', function () {
            expect(helper.onlyNumber('bejing123435tianjin')).to.equal('123435');
        });
    });

    describe('#parseGender', function () {
        it('should return male or female', function () {
            expect(helper.parseGender('男')).to.equal('male');
            expect(helper.parseGender('女')).to.equal('female');
        });
    });

    describe('#parseDate', function () {
        it('should parse correctly', function () {
            var date = helper.parseDate('2014-03-31');
            expect(date.getFullYear()).to.equal(2014);
            expect(date.getMonth()).to.equal(2);
            expect(date.getDate()).to.equal(31);
        });

        it('should parse chinese date correctly', function () {
            var date = helper.parseDate('1989年8月30日');
            expect(date.getFullYear()).to.equal(1989);
            expect(date.getMonth()).to.equal(7);
            expect(date.getDate()).to.equal(30);
        });

        it('should parse only year and month with default date 1', function () {
            var date = helper.parseDate('2013 /7');
            expect(date.getFullYear()).to.equal(2013);
            expect(date.getMonth()).to.equal(6);
            expect(date.getDate()).to.equal(1);
        });

        it('should parse 至今 correctly', function () {
            var date = helper.parseDate('至今');
            expect(date.getFullYear()).to.equal(9999);
        });
    });

    describe('#parseMatchRate', function () {
        it('should parse correctly', function () {
            expect(helper.parseMatchRate('91%')).to.equal(91);
        });
    });

    describe('#parseYearsOfExperience', function () {
        it('should return correctly', function () {
            expect(helper.parseYearsOfExperience('应届毕业生')).to.equal('graduating student');
        });
    });

    describe('#parseEntryTime', function () {
        it('should parse correctly', function () {
            expect(helper.parseEntryTime('待定')).to.equal('to be determined');
        });
    });

    describe('#parseTypeOfEmployment', function () {
        it('should parse correctly', function () {
            expect(helper.parseTypeOfEmployment('全职')).to.equal('fulltime');
        });
    });

    describe('#splitByCommas', function () {
        it('should split correctly', function () {
            expect(helper.splitByCommas('互联网/电子商务，计算机软件')).to.deep.equal([
                '互联网/电子商务',
                '计算机软件'
            ]);

            expect(helper.splitByCommas('北京，上海，杭州，深圳，天津')).to.deep.equal([
                '北京',
                '上海',
                '杭州',
                '深圳',
                '天津'
            ]);
        });
    });

    describe('#parseTargetSalary', function () {
        it('should parse correctly', function () {
            expect(helper.parseTargetSalary('面议/月')).to.deep.equal({
                from: 0,
                to: 0
            });
        });
    });

    describe.skip('#replaceNewLineAndSpace', function () {
        it('should return correctly', function () {

        });
    });

    describe('#parseTable', function () {
        it('should parse correctly', function () {
            var html = '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%"> <tbody> <tr> <td colspan="2" style="padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"> <span lang="EN-US" style="font-size:9.0pt;line-height:150%">2013 /7--</span><span style="font-size:9.0pt;line-height:150%">至今：中国平安保险（<span lang="EN-US">10000</span>人以上）<span lang="EN-US"> [ 4</span>个月<span lang="EN-US">] <u></u><u></u></span></span></p> </td> </tr> <tr> <td width="22%" style="width:22.0%;padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"> <span style="font-size:9.0pt;line-height:150%">所属行业：<span lang="EN-US"><u></u><u></u></span></span></p> </td> <td width="78%" style="width:78.0%;padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"> <span style="font-size:9.0pt;line-height:150%">保险<span lang="EN-US"><u></u><u></u></span></span></p></td> </tr> <tr> <td style="padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"><b><span style="font-size:9.0pt;line-height:150%">销售</span></b><span style="font-size:9.0pt;line-height:150%"> <span lang="EN-US"><u></u><u></u></span></span></p> </td> <td style="padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"><b><span style="font-size:9.0pt;line-height:150%">电话销售</span></b><span style="font-size:9.0pt;line-height:150%"> <span lang="EN-US"><u></u><u></u></span></span></p> </td> </tr> <tr> <td colspan="2" valign="top" style="padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"><span style="font-size:9.0pt;line-height:150%">从<span lang="EN-US">7</span>月中旬培训一个月左右，每天打电话跟客户交流，培养了我的信心，但是最后发现自己不太适合做销售，想换一份压力相对较小一点的工作。<span lang="EN-US"><u></u><u></u></span></span></p> </td> </tr> </tbody> </table>';
            var $ = cheerio.load(html);
            var table = $('table');
            var data = helper.parseTable(table, $);
            expect(data[0][0]).to.equal('2013/7--至今：中国平安保险（10000人以上）[4个月]');
            expect(data[1][0]).to.equal('所属行业：');
            expect(data[1][1]).to.equal('保险');
            expect(data[2][0]).to.equal('销售');
            expect(data[2][1]).to.equal('电话销售');
            expect(data[3][0]).to.equal('从7月中旬培训一个月左右，每天打电话跟客户交流，培养了我的信心，但是最后发现自己不太适合做销售，想换一份压力相对较小一点的工作。');
        });
    });

    describe('#isEnglishCertificate', function () {
        it('should return correctly', function () {
            expect(helper.isEnglishCertificate('英语（良好）')).to.be.false;
            expect(helper.isEnglishCertificate('英语等级：')).to.be.true;
        });
    });

    describe('#parseEnglishCertificate', function () {
        it('should parse correctly', function () {
            expect(helper.parseEnglishCertificate('英语四级')).to.equal('cet4');
        });
    });

    describe('#parseLanguageSkill', function () {
        it('should parse correctly', function () {
            expect(helper.parseLanguageSkill('英语（良好）', '听说（良好），读写（良好）')).to.deep.equal({
                language: 'english',
                level: 'good',
                readingAndWriting: 'good',
                listeningAndSpeaking: 'good'
            });
        });
    });

    describe('#parseItSkillLevel', function () {
        it('should parse correctly', function () {
            expect(helper.parseItSkillLevel('熟练')).to.equal('basic');
            expect(helper.parseItSkillLevel('精通')).to.equal('advanced');
        });
    });
});