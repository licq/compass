'use strict';

var expect = require('chai').expect,
  helper = require('../../../server/utilities/helper'),
  cheerio = require('cheerio'),
  moment = require('moment');

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
      var date = helper.parseDate('2013/9');
      expect(date.getFullYear()).to.equal(2013);
      expect(date.getMonth()).to.equal(8);
      expect(date.getDate()).to.equal(1);
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

  describe('#calculateBirthday', function () {
    it('should calculateBirthday correctly', function () {
      var birthday = helper.calculateBirthday('30岁', moment('2014 09 20', 'YYYY MM DD'));
      expect(birthday.getFullYear()).to.equal(1984);
      expect(birthday.getMonth()).to.equal(8);
      expect(birthday.getDate()).to.equal(20);
    });
  });

  describe('#parseMatchRate', function () {
    it('should parse correctly', function () {
      expect(helper.parseMatchRate('91%')).to.equal(91);
    });
  });

  describe('#parsePoliticalStatus', function () {
    it('should parse correctly', function () {
      expect(helper.parsePoliticalStatus('团员')).to.equal('league member');
    });
  });

  describe('#parseYearsOfExperience', function () {
    it('should return correctly', function () {
      expect(helper.parseYearsOfExperience('应届毕业生')).to.equal(0);
      expect(helper.parseYearsOfExperience('2年工作经验')).to.equal(2);
      expect(helper.parseYearsOfExperience('一年以上工作经验')).to.equal(1);
      expect(helper.parseYearsOfExperience('10年')).to.equal(10);
    });
  });

  describe('#parseEntryTime', function () {
    it('should parse correctly', function () {
      expect(helper.parseEntryTime('待定')).to.equal('to be determined');
      expect(helper.parseEntryTime('我目前在职，正考虑换个新环境（如有合适的工作机会，到岗时间一个月左右）')).to.equal('within 1 month');
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

  describe('#parseTable', function () {
    it('should parse correctly', function () {
      var html = '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%"> <tbody> <tr> <td colspan="2" style="padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"> <span lang="EN-US" style="font-size:9.0pt;line-height:150%">2013 /7--</span><span style="font-size:9.0pt;line-height:150%">至今：中国平安保险（<span lang="EN-US">10000</span>人以上）<span lang="EN-US"> [ 4</span>个月<span lang="EN-US">] <u></u><u></u></span></span></p> </td> </tr> <tr> <td width="22%" style="width:22.0%;padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"> <span style="font-size:9.0pt;line-height:150%">所属行业：<span lang="EN-US"><u></u><u></u></span></span></p> </td> <td width="78%" style="width:78.0%;padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"> <span style="font-size:9.0pt;line-height:150%">保险<span lang="EN-US"><u></u><u></u></span></span></p></td> </tr> <tr> <td style="padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"><b><span style="font-size:9.0pt;line-height:150%">销售</span></b><span style="font-size:9.0pt;line-height:150%"> <span lang="EN-US"><u></u><u></u></span></span></p> </td> <td style="padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"><b><span style="font-size:9.0pt;line-height:150%">电话销售</span></b><span style="font-size:9.0pt;line-height:150%"> <span lang="EN-US"><u></u><u></u></span></span></p> </td> </tr> <tr> <td colspan="2" valign="top" style="padding:0cm 0cm 0cm 0cm"><p class="MsoNormal" style="line-height:150%"><span style="font-size:9.0pt;line-height:150%">从<span lang="EN-US">7</span>月中旬培训一个月左右，每天打电话跟客户交流，培养了我的信心，但是最后发现自己不太适合做销售，想换一份压力相对较小一点的工作。<span lang="EN-US"><u></u><u></u></span></span></p> </td> </tr> </tbody> </table>';
      var $ = cheerio.load(html);
      var table = $('table');
      var data = helper.parseTable(table, $);
      expect(data[0][0]).to.equal('2013 /7--至今：中国平安保险（10000人以上） [ 4个月]');
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
      expect(helper.parseItSkillLevel('熟练')).to.equal('advanced');
      expect(helper.parseItSkillLevel('精通')).to.equal('expert');
    });
  });

  describe('#isProjectHeader', function () {
    it('should return correctly', function () {
      expect(helper.isProjectHeader('2013/9--2014/1：客户关系管理系统')).to.be.true;
      expect(helper.isProjectHeader('软件环境')).to.be.false;
    });
  });

  describe('#isSoftwareEnvironment', function () {
    it('should return correctly', function () {
      expect(helper.isSoftwareEnvironment('硬件环境：')).to.be.false;
      expect(helper.isSoftwareEnvironment('软件环境：')).to.be.true;
    });
  });

  describe('#isHardwareEnvironment', function () {
    it('should return correctly', function () {
      expect(helper.isHardwareEnvironment('硬件环境：')).to.be.true;
      expect(helper.isHardwareEnvironment('软件环境')).to.be.false;
    });
  });

  describe('#isDevelopmentTools', function () {
    it('should return correctly', function () {
      expect(helper.isDevelopmentTools('开发工具：')).to.be.true;
      expect(helper.isDevelopmentTools('软件环境')).to.be.false;
    });
  });

  describe('#isDescription', function () {
    it('should return correctly', function () {
      expect(helper.isDescription('项目描述：')).to.be.true;
      expect(helper.isDescription('软件环境')).to.be.false;
    });
  });

  describe('#isResponsibility', function () {
    it('should return correctly', function () {
      expect(helper.isResponsibility('责任描述：')).to.be.true;
      expect(helper.isResponsibility('软件环境')).to.be.false;
    });
  });

  describe('#parseCivilState', function () {
    it('should return correctly', function () {
      expect(helper.parseCivilState('未婚')).to.equal('single');
      expect(helper.parseCivilState('已婚')).to.equal('married');
      expect(helper.parseCivilState('离异')).to.equal('divorced');
      expect(helper.parseCivilState('保密')).to.equal('confidential');
    });
  });

  describe('#parseDateRange', function () {
    it('should return correctly', function () {
      var dateRange = helper.parseDateRange('2012/08--至今：');
      expect(dateRange.from.getFullYear()).to.equal(2012);
      expect(dateRange.from.getMonth()).to.equal(7);
      expect(dateRange.to.getFullYear()).to.equal(9999);
    });
    it('should return correctly 2', function () {
      var dateRange = helper.parseDateRange('2008/08 -- 至今：');
      expect(dateRange.from.getFullYear()).to.equal(2008);
      expect(dateRange.from.getMonth()).to.equal(7);
      expect(dateRange.to.getFullYear()).to.equal(9999);
    });


  });

  describe('#parseLanguageLevel', function () {
    it('should return correctly', function () {
      expect(helper.parseLanguageLevel('熟练')).to.equal('very good');
      expect(helper.parseLanguageLevel('读写能力熟练')).to.equal('very good');
      expect(helper.parseLanguageLevel('听说能力良好')).to.equal('good');
    });
  });

  describe('#isGender', function () {
    it('should return correctly', function () {
      expect(helper.isGender('男')).to.be.true;
      expect(helper.isGender('女')).to.be.true;
      expect(helper.isGender('男女')).to.be.false;
    });
  });

  describe('#isCivilState', function () {
    it('should return correctly', function () {
      expect(helper.isCivilState('已婚')).to.be.true;
      expect(helper.isCivilState('未婚')).to.be.true;
      expect(helper.isCivilState('1980年12月8日')).to.be.false;
    });
  });

  describe('#isBirthday', function () {
    it('should return correctly', function () {
      expect(helper.isBirthday('2011年12月8日')).to.be.true;
      expect(helper.isBirthday('2011年12月')).to.be.true;
      expect(helper.isBirthday('20年12月')).to.be.false;
    });
  });

  describe('#isHukou', function () {
    it('should return correctly', function () {
      expect(helper.isHukou('户口:上海')).to.be.true;
      expect(helper.isHukou('上海')).to.be.false;
    });
  });

  describe('#isMobile', function () {
    it('should return correctly', function () {
      expect(helper.isMobile('15721128797(手机')).to.be.true;
      expect(helper.isMobile('2年工作经验 | 团员 安徽省安庆市 246003')).to.be.false;
    });
  });

  describe('#isPoliticalStatus', function () {
    it('should return correctly', function () {
      expect(helper.isPoliticalStatus('团员')).to.be.true;
      expect(helper.isPoliticalStatus('党员')).to.be.true;
      expect(helper.isPoliticalStatus('群众')).to.be.true;
      expect(helper.isPoliticalStatus('上海')).to.be.false;
    });
  });
  describe('#isEmail', function () {
    it('should return correctly', function () {
      expect(helper.isEmail('Email: aa@bb.com')).to.be.true;
      expect(helper.isEmail('aa@bb.com')).to.be.false;
    });
  });

  describe('#parseEmail', function () {
    it('should return correctly', function () {
      expect(helper.parseEmail('Email: aa@bb.com')).to.equal('aa@bb.com');
    });
  });

  describe('#isYearsOfExperience', function () {
    it('should return correctly', function () {
      expect(helper.isYearsOfExperience('2年工作经验')).to.be.true;
      expect(helper.isHukou('上海')).to.be.false;
    });
  });

  describe('#isResidency', function () {
    it('should return correctly', function () {
      expect(helper.isResidency('现居住于上海-浦东新区')).to.be.true;
      expect(helper.isResidency('20年12月')).to.be.false;
    });
  });

  describe('#parseZhaopinApplyPosition', function () {
    it('should return correctly', function () {
      expect(helper.parseZhaopinApplyPosition('(Zhaopin.com) 应聘 预付储值卡销售-上海-张毅')).to.equal('预付储值卡销售-上海');
    });
  });

  describe('#chunkByEmptyArray', function () {
    it('should return correctly', function () {
      expect(helper.chunkByEmptyArray([
        [1, 2, 3]
      ])).to.deep.equal([
          [
            [1, 2, 3]
          ]
        ]);
      expect(helper.chunkByEmptyArray([
        [1, 2, 3],
        [''],
        [4, 5]
      ])).to.deep.equal([
          [
            [1, 2, 3]
          ],
          [
            [4, 5]
          ]
        ]);

      expect(helper.chunkByEmptyArray([
        [1, 2, 3],
        [2, 7, 8],
        [''],
        [4, 5],
        [''],
        [6]
      ])).to.deep.equal([
          [
            [1, 2, 3],
            [2, 7, 8]
          ],
          [
            [4, 5]
          ],
          [
            [6]
          ]
        ]);
    });
  });

  describe('#isProjectDescription', function () {
    it('should return correctly', function () {
      expect(helper.isProjectDescription('责任描述：数据清理和模型设计')).to.be.false;
      expect(helper.isProjectDescription('项目描述：本次项目，选用国美电器某门店的进销存系统数据作为分析对象。')).to.be.true;
    });
  });

  describe('#isProjectResponsibility', function () {
    it('should return correctly', function () {
      expect(helper.isProjectResponsibility('责任描述：数据清理和模型设计')).to.be.true;
      expect(helper.isProjectResponsibility('项目描述：本次项目，选用国美电器某门店的进销存系统数据作为分析对象。')).to.be.false;
    });
  });

  describe('#removeTags', function () {
    it('should remove all tags', function () {
      expect(helper.removeTags('<br>beijing</html>tianjin<div id="awsome">shanghai&nbsp;&nbsp;')).to.equal('beijingtianjinshanghai');
    });
  });

  describe('#splitByColon', function () {
    it('should return correctly', function () {
      expect(helper.splitByColon('北京:天津')).to.deep.equal(['北京', '天津']);
      expect(helper.splitByColon('北京：天津')).to.deep.equal(['北京', '天津']);
    });
  });

  describe('#isTrainingCourse', function () {
    it('should return correctly', function () {
      expect(helper.isTrainingCourse('培训课程：问卷设计、SPSS实战培训')).to.be.true;
      expect(helper.isTrainingCourse('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });
  describe('#isTrainingLocation', function () {
    it('should return correctly', function () {
      expect(helper.isTrainingLocation('培训课程：问卷设计、SPSS实战培训')).to.be.false;
      expect(helper.isTrainingLocation('培训地点：北京化工大学主教学楼')).to.be.true;
    });
  });

  describe('#isTrainingCertification', function () {
    it('should return correctly', function () {
      expect(helper.isTrainingCertification('所获证书：无')).to.be.true;
      expect(helper.isTrainingCertification('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });
  describe('#isTrainingDescription', function () {
    it('should return correctly', function () {
      expect(helper.isTrainingDescription('培训描述：培训过程中，首先，主要是对问卷设计中的注意事项，问卷处理中的问题进行培训；其次，主要对SPSS功能和使用的培训；最后，将SPSS与EXCEL融合进行培训，将SPSS与EXCEL的使用互补。')).to.be.true;
      expect(helper.isTrainingDescription('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });

  describe('#isEntryTime', function () {
    it('should return correctly', function () {
      expect(helper.isEntryTime('到岗时间： 一周以内')).to.be.true;
      expect(helper.isEntryTime('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });

  describe('#isTypeOfEmployment', function () {
    it('should return correctly', function () {
      expect(helper.isTypeOfEmployment('工作性质： 实习')).to.be.true;
      expect(helper.isTypeOfEmployment('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });

  describe('#isIndustry', function () {
    it('should return correctly', function () {
      expect(helper.isIndustry('希望行业： 实习')).to.be.true;
      expect(helper.isIndustry('期望从事行业：')).to.be.true;
      expect(helper.isIndustry('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });

  describe('#isLocations', function () {
    it('should return correctly', function () {
      expect(helper.isLocations('目标地点： 北京')).to.be.true;
      expect(helper.isLocations('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });

  describe('#isTargetSalary', function () {
    it('should return correctly', function () {
      expect(helper.isTargetSalary('期望月薪： 面议/月')).to.be.true;
      expect(helper.isTargetSalary('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });

  describe('#isJobCategory', function () {
    it('should return correctly', function () {
      expect(helper.isJobCategory('目标职能： 工程师')).to.be.true;
      expect(helper.isJobCategory('培训地点：北京化工大学主教学楼')).to.be.false;
    });
  });

  describe('#replaceEmpty', function () {
    it('should return correctly', function () {
      expect(helper.replaceEmpty('\t深水餐饮管理系统')).to.equal('深水餐饮管理系统');
      expect(helper.replaceEmpty(' 软件环境：\t windows XP windows 7')).to.equal('软件环境： windows XP windows 7');
    });
  });

  describe('#render', function () {
    it('should replace name', function () {
      expect(helper.render('hello,{{姓名}}', {name: 'beijing'})).to.equal('hello,beijing');
      expect(helper.render('hello,{{姓名}},{{姓名}}', {name: 'beijing'})).to.equal('hello,beijing,beijing');
      expect(helper.render('hello,{{姓名}},{{应聘职位}}--{{开始时间}}:{{结束时间}}', {
        name: 'beijing',
        applyPosition: '销售经理',
        startTime: moment([2014, 5, 5, 8, 0, 0, 0]),
        endTime: moment([2014, 5, 5, 9, 0, 0, 0])}))
        .to.equal('hello,beijing,销售经理--2014年6月5日8:00:2014年6月5日9:00');
    });
  });

  describe('#parseTargetAnnualSalary', function () {
    it('should parse targetSalary correctly', function () {
      expect(helper.parseTargetAnnualSalary('21.60万（18000元/月 * 12个月）')).to.deep.equal({
        from: 18000,
        to: 18000,
        months: 12
      });
    });
  });

  describe('#splitBySemiolon', function () {
    it('should return correctly', function () {
      expect(helper.splitBySemiolon('产品经理/主管;信息技术经理/主管;项目经理/主管')).to.deep.equal([
          '产品经理/主管','信息技术经理/主管','项目经理/主管'
      ]);
    });
  });
});

