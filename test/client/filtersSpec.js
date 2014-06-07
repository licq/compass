describe('filters', function () {
  beforeEach(module('compass'));

  describe('state', function () {
    it('should return correctly', inject(function (stateFilter) {
      expect(stateFilter()).to.equal('正常');
      expect(stateFilter('connect failed')).to.equal('服务器无法连接');
      expect(stateFilter('login failed')).to.equal('用户名或密码不正确');
    }));
  });

  describe('deletedState', function () {
    it('should return correctly', inject(function (deletedStateFilter) {
      expect(deletedStateFilter(false)).to.equal('正常');
      expect(deletedStateFilter(true)).to.equal('已删除');
    }));
  });

  describe('yearAndMonth', function () {
    it('should return correctly', inject(function (yearAndMonthFilter) {
      expect(yearAndMonthFilter(new Date(2011, 9, 20))).to.equal('2011年10月');
    }));
    it('should return 至今 when year is 9999', inject(function (yearAndMonthFilter) {
      expect(yearAndMonthFilter(new Date(9999, 9, 20))).to.equal('至今');
    }));
  });

  describe('shortDate', function () {
    it('should return correctly', inject(function (shortDateFilter) {
      expect(shortDateFilter(new Date(2011, 9, 20))).to.equal('2011年10月20日');
    }));
  });

  describe('longDate', function () {
    it('should return correctly', inject(function (longDateFilter) {
      expect(longDateFilter(new Date(2011, 9, 20, 5, 25, 5))).to.equal('2011年10月20日 05:25:05');
    }));
  });

  describe('yearsOfExperience', function () {
    it('should return correctly', inject(function (yearsOfExperienceFilter) {
      expect(yearsOfExperienceFilter(2)).to.equal('2年');
      expect(yearsOfExperienceFilter(0)).to.equal('应届毕业生');
      expect(yearsOfExperienceFilter(-1)).to.equal('学生');
    }));
  });

  describe('gender', function () {
    it('should return correctly', inject(function (genderFilter) {
      expect(genderFilter('male')).to.equal('男');
      expect(genderFilter('female')).to.equal('女');
    }));
  });

  describe('politicalStatus', function () {
    it('should return correctly', inject(function (politicalStatusFilter) {
      expect(politicalStatusFilter('party member')).to.equal('党员');
      expect(politicalStatusFilter('league member')).to.equal('团员');
      expect(politicalStatusFilter('democratic part')).to.equal('民主党派');
      expect(politicalStatusFilter('no party')).to.equal('无党派');
      expect(politicalStatusFilter('citizen')).to.equal('群众');
    }));
  });

  describe('civilState', function () {
    it('should return correctly', inject(function (civilStateFilter) {
      expect(civilStateFilter('single')).to.equal('单身');
      expect(civilStateFilter('married')).to.equal('已婚');
      expect(civilStateFilter('divorced')).to.equal('离异');
      expect(civilStateFilter('confidential')).to.equal('隐私');
    }));
  });

  describe('typeOfEmployment', function () {
    it('should return correctly', inject(function (typeOfEmploymentFilter) {
      expect(typeOfEmploymentFilter('fulltime')).to.equal('全职');
      expect(typeOfEmploymentFilter('parttime')).to.equal('兼职');
      expect(typeOfEmploymentFilter('intern')).to.equal('实习');
    }));
  });

  describe('entryTime', function () {
    it('should return correctly', inject(function (entryTimeFilter) {
      expect(entryTimeFilter('immediately')).to.equal('立即');
      expect(entryTimeFilter('within 1 week')).to.equal('一周以内');
      expect(entryTimeFilter('within 1 month')).to.equal('一个月以内');
      expect(entryTimeFilter('1 to 3 months')).to.equal('一到三个月');
      expect(entryTimeFilter('after 3 months')).to.equal('三个月以上');
      expect(entryTimeFilter('to be determined')).to.equal('待定');
    }));
  });

  describe('degree', function () {
    it('should return correctly', inject(function (degreeFilter) {
      expect(degreeFilter('junior high')).to.equal('初中');
      expect(degreeFilter('associate')).to.equal('大专');
      expect(degreeFilter('master')).to.equal('硕士');
    }));
  });

  describe('language', function () {
    it('should return correctly', inject(function (languageFilter) {
      expect(languageFilter('english')).to.equal('英语');
      expect(languageFilter('japanese')).to.equal('日语');
      expect(languageFilter('other')).to.equal('其他');
    }));
  });

  describe('languageSkillLevel', function () {
    it('should return correctly', inject(function (languageSkillLevelFilter) {
      expect(languageSkillLevelFilter('not sure')).to.equal('不限');
      expect(languageSkillLevelFilter('average')).to.equal('一般');
      expect(languageSkillLevelFilter('good')).to.equal('良好');
    }));
  });

  describe('englishCertificate', function () {
    it('should return correctly', inject(function (englishCertificateFilter) {
      expect(englishCertificateFilter('tem4')).to.equal('专业四级');
      expect(englishCertificateFilter('cet6')).to.equal('英语六级');
      expect(englishCertificateFilter('not participate')).to.equal('未参加');
    }));
  });

  describe('japaneseCertificate', function () {
    it('should return correctly', inject(function (japaneseCertificateFilter) {
      expect(japaneseCertificateFilter('none')).to.equal('未参加');
      expect(japaneseCertificateFilter('level1')).to.equal('一级');
      expect(japaneseCertificateFilter('level4')).to.equal('四级');
    }));
  });
  describe('itSkillLevel', function () {
    it('should return correctly', inject(function (itSkillLevelFilter) {
      expect(itSkillLevelFilter('none')).to.equal('无');
      expect(itSkillLevelFilter('expert')).to.equal('精通');
      expect(itSkillLevelFilter('advanced')).to.equal('熟练');
    }));
  });

  describe('targetSalary', function () {
    it('should return correctly', inject(function (targetSalaryFilter) {
      expect(targetSalaryFilter({from: 2001, to: 4000})).to.equal('2001--4000');
      expect(targetSalaryFilter({from: 0, to: 0})).to.equal('面议');
      expect(targetSalaryFilter({})).to.not.exist;
    }));
  });

  describe('ageRange', function () {
    it('should return age range', inject(function (ageRangeFilter) {
      expect(ageRangeFilter(20)).to.equal('20 -- 24');
      expect(ageRangeFilter(40)).to.equal('40 -- 44');
    }));
  });

  describe('showArchiveButtonFilter', function () {
    it('should return correctly', inject(function (showArchiveButtonFilter) {
      expect(showArchiveButtonFilter({
        status: 'new'
      })).to.be.true;
      expect(showArchiveButtonFilter({
        status: 'archived'
      })).to.be.false;
      expect(showArchiveButtonFilter({
        status: 'pursued'
      })).to.be.true;
      expect(showArchiveButtonFilter({
        status: 'undetermined'
      })).to.be.true;
      expect(showArchiveButtonFilter(undefined)).to.be.undefined;
    }));
  });

  describe('showPursueButtonFilter', function () {
    it('should return correctly', inject(function (showPursueButtonFilter) {
      expect(showPursueButtonFilter({
        status: 'new'
      })).to.be.true;
      expect(showPursueButtonFilter({
        status: 'archived'
      })).to.be.true;
      expect(showPursueButtonFilter({
        status: 'pursued'
      })).to.be.false;
      expect(showPursueButtonFilter({
        status: 'undetermined'
      })).to.be.true;
      expect(showPursueButtonFilter(undefined)).to.be.undefined;
    }));
  });

  describe('showUndetermineButtonFilter', function () {
    it('should return correctly', inject(function (showUndetermineButtonFilter) {
      expect(showUndetermineButtonFilter({
        status: 'new'
      })).to.be.true;
      expect(showUndetermineButtonFilter({
        status: 'archived'
      })).to.be.false;
      expect(showUndetermineButtonFilter({
        status: 'pursued'
      })).to.be.false;
      expect(showUndetermineButtonFilter({
        status: 'undetermined'
      })).to.be.false;
      expect(showUndetermineButtonFilter(undefined)).to.be.undefined;
    }));
  });
  describe('showInterviewButtonFilter', function () {
    it('should return correctly', inject(function (showInterviewButtonFilter) {
      expect(showInterviewButtonFilter({
        status: 'new'
      })).to.be.false;
      expect(showInterviewButtonFilter({
        status: 'archived'
      })).to.be.false;
      expect(showInterviewButtonFilter({
        status: 'pursued'
      })).to.be.true;
      expect(showInterviewButtonFilter({
        status: 'undetermined'
      })).to.be.false;
      expect(showInterviewButtonFilter(undefined)).to.be.undefined;
    }));
  });

  describe('interviewersFilter', function () {
    it('should return correctly', inject(function (interviewersFilter) {
      var interviewers = [
        {
          _id: '7788',
          name: '张三'
        },
        {
          _id: '8899',
          name: '李四'
        }
      ];
      expect(interviewersFilter(interviewers)).to.equal('张三, 李四');
    }));
  });

  describe('qualifiedFilter', function () {
    it('should return correctly', inject(function (qualifiedFilter) {
      expect(qualifiedFilter(true)).to.equal('通过');
      expect(qualifiedFilter(false)).to.equal('拒绝');
      expect(qualifiedFilter()).to.equal('');
    }));
  });

  describe('interviewStatusFilter', function () {
    it('should return correctly', inject(function (interviewStatusFilter) {
      expect(interviewStatusFilter({status: 'accepted'})).to.equal('面试通过');
      expect(interviewStatusFilter({status: 'rejected'})).to.equal('面试拒绝');
      expect(interviewStatusFilter({status: 'offer rejected', applierRejectReason: '工资太低'})).to.equal('应聘者拒绝,拒绝原因:工资太低');
      expect(interviewStatusFilter({status: 'offer accepted', onboardDate: new Date(2013, 1, 5)})).to.equal('应聘者接受,入职日期:2013年2月5日');
    }));
  });

  describe('zeroToLiteralFilter', function () {
    it('should return correctly', inject(function (zeroToLiteralFilter) {
      expect(zeroToLiteralFilter(0)).to.equal('没有');
      expect(zeroToLiteralFilter(3)).to.equal('有3个');
    }));
  });
  
  describe('eventTimeRangeFilter', function () {
    it('should return correctly', inject(function (eventTimeRangeFilter) {
      expect(eventTimeRangeFilter({startTime: '2014-06-06T12:05:00.000Z', duration: 90})).to.equal('20:05-21:35');
    }));
  });
  
  describe('resumeStatusFilter', function () {
    it('should return correctly', inject(function (resumeStatusFilter) {
      expect(resumeStatusFilter('archived')).to.equal('初审拒绝');
      expect(resumeStatusFilter('rejected')).to.equal('面试拒绝');
      expect(resumeStatusFilter('offer rejected')).to.equal('应聘者拒绝');
    }));
  });
});