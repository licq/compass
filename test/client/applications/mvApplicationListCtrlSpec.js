describe('mvApplicationListCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvApplicationListCtrl,
    $scope,
    result,
    fakeModal,
    modalOpenStub;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $modal) {
    result = {
      took: 40,
      timed_out: false,
      _shards: {
        total: 5,
        successful: 5,
        failed: 0
      },
      hits: {
        total: 20,
        max_score: 0.39723808,
        hits: [
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '534be3927839a79790bc9125',
            _score: 0.39723808,
            _source: {
              applyDate: '2014-04-14T10:53:15.352Z',
              applyPosition: 'Java软件工程师-上海',
              birthday: '1988-06-01T12:33:06.071Z',
              careerObjective: {
                entryTime: 'within 1 month',
                selfAssessment: '有SS+Mybatis、ssh项目经验，良好的编程习惯，熟悉MyEclipse开发环境，Tomcat服务器，MySQL、Sql server数据库，对HTML、CSS、JavaScript、jQuery等前台技术熟练，能熟练使用photoshop、corelDraw，本人诚恳朴实、时间观念强；有良好的团队合作精神和沟通组织能力；对待工作有责任心，积极乐观；遇到问题，能够积极、耐心的寻找解决方法。大学期间与周围所有的人都相处融洽，亲和力强。希望能有机会锻炼自己，积累经验。',
                targetSalary: {
                  from: 0,
                  to: 0
                }
              },
              certifications: [],
              channel: '智联招聘',
              civilState: 'single',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-14T13:33:06.117Z',
              highestDegree: 'bachelor',
              educationHistory: [
                {
                  _id: '534be3927839a79790bc9127',
                  degree: 'bachelor',
                  from: '2011-09-01T13:33:06.084Z',
                  major: ' 计算机科学与技术 ',
                  school: '河南理工大学 ',
                  to: '2013-07-01T13:33:06.084Z'
                },
                {
                  _id: '534be3927839a79790bc9126',
                  degree: 'associate',
                  from: '2009-09-01T13:33:06.084Z',
                  major: ' 通信工程 ',
                  school: '河南理工大学 ',
                  to: '2011-06-01T13:33:06.084Z'
                }
              ],
              email: 'gao_yanke@163.com',
              gender: 'female',
              hukou: '河南漯河',
              inSchoolPractices: [],
              itSkills: [],
              languageCertificates: {},
              languageSkills: [],
              mail: '534be3917839a79790bc9121',
              mobile: '13524189425',
              name: '高艳克',
              politicalStatus: 'citizen',
              projectExperience: [],
              residency: '上海-宝山区',
              updated_at: '2014-04-28T10:18:00.131Z',
              workExperience: [
                {
                  _id: '534be3927839a79790bc9129',
                  company: '铂溢（上海）物联网有限公司',
                  department: '网络科技部',
                  from: '2013-06-01T13:33:06.080Z',
                  industry: '基金/证券/期货/投资',
                  jobDescription: '主要负责金融产品的研发，目前主要负责公司金融产品平台以及产品流程的制作，主要运用Flex、ActionScript等完成前台页面的制作，实现与后台java的交互',
                  jobTitle: '研发工程师',
                  to: '9999-04-14T13:33:06.080Z'
                },
                {
                  _id: '534be3927839a79790bc9128',
                  company: '北京宜美家园建筑装饰有限公司焦作分公司',
                  department: '网络',
                  from: '2013-01-01T13:33:06.080Z',
                  industry: '家居/室内设计/装饰装潢',
                  jobDescription: '主要负责公司业务的设计，根据客户需求制作满足要求的室内设计，使用PHOTOSHOP和CAD等，收到了良好的效果',
                  jobTitle: '网络部',
                  to: '2013-03-01T13:33:06.081Z'
                }
              ],
              yearsOfExperience: 1
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '533cda84217c260000b1acc5',
            _score: 0.3693177,
            _source: {
              applyDate: '2014-04-03T03:47:55.142Z',
              careerObjective: {
                entryTime: 'within 1 month',
                selfAssessment: '30岁之前从事过多项不同类型工作，知识涉猎面广泛，计算机和英语能力均较为突出。自评自身最大的特点在于善于学习和适应能力强。能很快融入每一个担任过的角色，并能出色地胜任，得到领导和同事们的广泛认同。近年来作为团队领导，加强财务会计知识的同时，也锻炼了自身的领导和判断能力。目前在读上海华东理工的ＭＢＡ硕士研究生，相信会给自己在整体的管理能力上有不小的提升。',
                targetSalary: {
                  from: 10001,
                  to: 15000
                }
              },
              certifications: [
                {
                  _id: '533cda84217c260000b1accb',
                  date: '2003-07-01T03:50:28.594Z',
                  score: '',
                  subject: '3Dmax初级'
                },
                {
                  _id: '533cda84217c260000b1acca',
                  date: '2003-08-01T03:50:28.594Z',
                  score: '',
                  subject: 'AutoCAD中级证书'
                },
                {
                  _id: '533cda84217c260000b1acc9',
                  date: '2005-06-01T03:50:28.594Z',
                  score: '415',
                  subject: '大学英语六级'
                },
                {
                  _id: '533cda84217c260000b1acc8',
                  date: '2002-06-01T03:50:28.594Z',
                  score: '',
                  subject: '大学英语四级'
                }
              ],
              channel: '智联招聘',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-03T03:50:28.611Z',
              highestDegree: 'mba',
              educationHistory: [
                {
                  _id: '533cda84217c260000b1acce',
                  degree: 'mba',
                  from: '2013-03-01T03:50:28.000Z',
                  major: ' 工商管理 ',
                  school: '上海华东理工大学 ',
                  to: '9999-04-03T03:50:28.000Z'
                },
                {
                  _id: '533cda84217c260000b1accd',
                  degree: 'bachelor',
                  from: '2007-01-01T03:50:28.000Z',
                  major: ' 英语 ',
                  school: '上海海事大学 ',
                  to: '2010-02-01T03:50:28.000Z'
                },
                {
                  _id: '533cda84217c260000b1accc',
                  degree: 'associate',
                  from: '2001-09-01T03:50:28.000Z',
                  major: ' 国际贸易-电子商务 ',
                  school: '上海杉达大学 ',
                  to: '2005-07-01T03:50:28.000Z'
                }
              ],
              email: 'robin_fan_house@sina.com',
              gender: 'male',
              hukou: '上海',
              inSchoolPractices: [],
              itSkills: [
                {
                  _id: '533cda84217c260000b1acc7',
                  experience: 96,
                  level: 'advanced',
                  skill: 'C1'
                }
              ],
              languageCertificates: {},
              languageSkills: [
                {
                  _id: '533cda84217c260000b1acc6',
                  language: 'english',
                  listeningAndSpeaking: 'average',
                  readingAndWriting: 'very good'
                }
              ],
              mobile: '18616527197',
              name: '范志斌',
              politicalStatus: 'league member',
              projectExperience: [],
              residency: '上海-浦东新区',
              updated_at: '2014-04-28T10:17:59.424Z',
              workExperience: [
                {
                  _id: '533cda84217c260000b1acd0',
                  company: '中国中外运长航上海华泰海运分公司',
                  department: '信息运营中心',
                  from: '2008-08-01T03:50:28.587Z',
                  industry: '交通/运输',
                  jobDescription: '1.牵头组建维护公司网站,根据公司需要开发新的功能模块;2.商务运营，招商外联；3.带领团队对公司web服务器、exchange邮件服务器及远程交互系统的数据进行搭建维护;4.公司软硬件采购维护、更新费用测算等方面的工作;5.负责公司经济责任制考核有关指标的测算和落实;6.负责公司相关合同管理;7.承接对外接待工作等。',
                  jobTitle: '信息化建设经理',
                  to: '9999-04-03T03:50:28.587Z'
                },
                {
                  _id: '533cda84217c260000b1accf',
                  company: '上海磁悬浮列车龙阳路站',
                  department: '工作部',
                  from: '2005-05-01T03:50:28.588Z',
                  industry: '政府/公共事业/非盈利机构',
                  jobDescription: '维护组建公司网络，更新公司网站。并处理一切与公司电脑有关的事宜.',
                  jobTitle: '网络管理员',
                  to: '2006-01-01T03:50:28.588Z'
                }
              ],
              yearsOfExperience: 9
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '535e11272c1b1d95031ffdb5',
            _score: 0.31088054,
            _source: {
              applyDate: '2014-04-28T07:58:42.925Z',
              applyPosition: '大数据分析师-上海',
              birthday: '1982-01-01T08:28:23.170Z',
              careerObjective: {
                entryTime: 'within 1 month',
                selfAssessment: '30岁之前从事过多项不同类型工作，知识涉猎面广泛，计算机和英语能力均较为突出。自评自身最大的特点在于善于学习和适应能力强。能很快融入每一个担任过的角色，并能出色地胜任，得到领导和同事们的广泛认同。近年来作为团队领导，加强财务会计知识的同时，也锻炼了自身的领导和判断能力。目前在读上海华东理工的ＭＢＡ硕士研究生，相信会给自己在整体的管理能力上有不小的提升。',
                targetSalary: {
                  from: 10001,
                  to: 15000
                }
              },
              certifications: [
                {
                  _id: '535e11272c1b1d95031ffdbd',
                  date: '2003-07-01T08:28:23.182Z',
                  score: '',
                  subject: '3Dmax初级'
                },
                {
                  _id: '535e11272c1b1d95031ffdbc',
                  date: '2003-08-01T08:28:23.182Z',
                  score: '',
                  subject: 'AutoCAD中级证书'
                },
                {
                  _id: '535e11272c1b1d95031ffdbb',
                  date: '2005-06-01T08:28:23.182Z',
                  score: '415',
                  subject: '大学英语六级'
                },
                {
                  _id: '535e11272c1b1d95031ffdba',
                  date: '2002-06-01T08:28:23.182Z',
                  score: '',
                  subject: '大学英语四级'
                }
              ],
              channel: '智联招聘',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-28T08:28:23.212Z',
              highestDegree: 'mba',
              educationHistory: [
                {
                  _id: '535e11272c1b1d95031ffdc0',
                  degree: 'mba',
                  from: '2013-03-01T08:28:23.179Z',
                  major: ' 工商管理 ',
                  school: '上海华东理工大学 ',
                  to: '9999-04-28T08:28:23.179Z'
                },
                {
                  _id: '535e11272c1b1d95031ffdbf',
                  degree: 'bachelor',
                  from: '2007-01-01T08:28:23.179Z',
                  major: ' 英语 ',
                  school: '上海海事大学 ',
                  to: '2010-02-01T08:28:23.179Z'
                },
                {
                  _id: '535e11272c1b1d95031ffdbe',
                  degree: 'associate',
                  from: '2001-09-01T08:28:23.179Z',
                  major: ' 国际贸易-电子商务 ',
                  school: '上海杉达大学 ',
                  to: '2005-07-01T08:28:23.179Z'
                }
              ],
              email: 'robin_fan_house@sina.com',
              gender: 'male',
              hukou: '上海',
              inSchoolPractices: [],
              itSkills: [
                {
                  _id: '535e11272c1b1d95031ffdb9',
                  experience: 96,
                  level: 'advanced',
                  skill: 'C1'
                }
              ],
              languageCertificates: {},
              languageSkills: [
                {
                  _id: '535e11272c1b1d95031ffdb8',
                  language: 'english'
                }
              ],
              mail: '533bfcc78d8b2b0000df45f9',
              mobile: '18616527197',
              name: '范志斌',
              politicalStatus: 'citizen',
              projectExperience: [],
              residency: '上海-浦东新区',
              updated_at: '2014-04-28T10:18:00.247Z',
              workExperience: [
                {
                  _id: '535e11272c1b1d95031ffdc2',
                  company: '中国中外运长航上海华泰海运分公司',
                  department: '信息运营中心',
                  from: '2008-08-01T08:28:23.176Z',
                  industry: '交通/运输',
                  jobDescription: '1.牵头组建维护公司网站,根据公司需要开发新的功能模块;2.商务运营，招商外联；3.带领团队对公司web服务器、exchange邮件服务器及远程交互系统的数据进行搭建维护;4.公司软硬件采购维护、更新费用测算等方面的工作;5.负责公司经济责任制考核有关指标的测算和落实;6.负责公司相关合同管理;7.承接对外接待工作等。',
                  jobTitle: '信息化建设经理',
                  to: '9999-04-28T08:28:23.176Z'
                },
                {
                  _id: '535e11272c1b1d95031ffdc1',
                  company: '上海磁悬浮列车龙阳路站',
                  department: '工作部',
                  from: '2005-05-01T08:28:23.176Z',
                  industry: '政府/公共事业/非盈利机构',
                  jobDescription: '维护组建公司网络，更新公司网站。并处理一切与公司电脑有关的事宜.',
                  jobTitle: '网络管理员',
                  to: '2006-01-01T08:28:23.176Z'
                }
              ],
              yearsOfExperience: 9
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '534b9404149ac3132a4eaa04',
            _score: 0.25544813,
            _source: {
              applyDate: '2014-04-14T04:48:06.203Z',
              applyPosition: 'Java软件工程师-上海',
              birthday: '1991-03-01T07:53:40.015Z',
              careerObjective: {
                entryTime: 'immediately',
                selfAssessment: '有一年开发实习经验，学习能力强。熟悉掌握java，JSP，js，html等变成语言，自主学习并掌握SSH企业框架搭建。熟悉oracle 主流数据语言。',
                targetSalary: {
                  from: 4001,
                  to: 6000
                }
              },
              certifications: [],
              channel: '智联招聘',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-14T07:53:40.049Z',
              highestDegree: 'bachelor',
              educationHistory: [
                {
                  _id: '534b9404149ac3132a4eaa08',
                  degree: 'bachelor',
                  from: '2009-09-01T07:53:40.021Z',
                  major: ' 计算机科学与技术 ',
                  school: '安徽理工大学 ',
                  to: '2012-12-01T07:53:40.021Z'
                }
              ],
              email: 'springflowerxu@163.com',
              gender: 'male',
              hukou: '安徽阜阳',
              inSchoolPractices: [],
              itSkills: [],
              languageCertificates: {},
              languageSkills: [
                {
                  _id: '534b9404149ac3132a4eaa07',
                  language: 'english',
                  listeningAndSpeaking: 'average',
                  readingAndWriting: 'good'
                }
              ],
              mail: '534b9403149ac3132a4eaa00',
              mobile: '15601703711',
              name: '徐春伟',
              politicalStatus: 'citizen',
              projectExperience: [
                {
                  _id: '534b9404149ac3132a4eaa06',
                  description: '此项属于毕业设计作业。针对现在越来越多的小区物业管理问题，做个模拟。减少居民与物业的之间的摩擦。尽我所知的，设计功能模块。包含用户管理，资费审核。意见投递，及其兴趣好友等。',
                  developmentTools: 'Eclipse，Dreamweaver，Oracle,Tomcat.',
                  from: '2013-05-01T07:53:40.037Z',
                  name: '小区物业管理',
                  responsibility: '独立完成，模仿其他管理系统模块，结合实际小区物业情况，简单完成逻辑及其功能划分。完全需求分析，代码开发，及其后续测试。',
                  to: '2013-06-01T07:53:40.038Z'
                },
                {
                  _id: '534b9404149ac3132a4eaa05',
                  description: '就是简单的模仿现在网上流行的网店模式，设置的服务有主界面，货物饿查询及查询后的分页显示，还有就是对单一货物的的介绍，购物车的功能，会员与非会员的登陆注册等。',
                  developmentTools: 'Eclipse，Dreamweaver，Oracle,Tomcat.',
                  from: '2012-11-01T07:53:40.038Z',
                  name: '快乐购物网站',
                  responsibility: '我在其中担任的是首页的设计布局及实现。设计布局要保证吸引顾客的眼球，还要保证顾客需要实用的满足，在实现上也要尽量简单，功能齐全，易于同其他模块融合。',
                  to: '2012-12-01T07:53:40.038Z'
                }
              ],
              residency: '上海-虹口区',
              updated_at: '2014-04-28T10:18:00.123Z',
              workExperience: [],
              yearsOfExperience: 1
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '53473d6c59c0af82035e8b8e',
            _score: 0.15644404,
            _source: {
              applyDate: '2014-04-11T00:55:04.196Z',
              applyPosition: 'Java软件工程师-上海',
              birthday: '1988-12-01T00:55:08.691Z',
              careerObjective: {
                entryTime: 'within 1 month',
                selfAssessment: '本人对编程具有浓烈的兴趣，能较快的接受新的事物，适应能力较强 ，做事认真踏实，具有较强的团队合作精神，责任心很强，且学习能力很强，具有一定的研究和创新能力。',
                targetSalary: {
                  from: 0,
                  to: 0
                }
              },
              certifications: [
                {
                  _id: '53473d6c59c0af82035e8b96',
                  date: '2011-06-01T00:55:08.706Z',
                  score: '在昆山实训期间，独立完成\'VSTS虚拟股票交易系统\'，我们小组一起完成\'\'ECTS 网上购物\',在3个半月的实训我为我的实训交上了完美的答卷',
                  subject: '昆山安博实训合格证书'
                }
              ],
              channel: '智联招聘',
              civilState: 'single',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-11T00:55:08.729Z',
              highestDegree: 'associate',
              educationHistory: [
                {
                  _id: '53473d6c59c0af82035e8b97',
                  degree: 'associate',
                  from: '2009-09-01T00:55:08.704Z',
                  major: ' 计算机科学与技术 ',
                  school: '河南理工大学 ',
                  to: '2010-07-01T00:55:08.704Z'
                }
              ],
              email: '375049016@qq.com',
              gender: 'male',
              hukou: '河南濮阳',
              inSchoolPractices: [
                {
                  _id: '53473d6c59c0af82035e8b8f',
                  content: '昆山安博java方向 | 通过在昆山安博三个多月的实训，不仅我的专业水平有了很大的提高，而且在做项目的过程中深刻的理解到团队合作的重要性',
                  from: '2011-03-01T00:55:08.720Z',
                  to: '2011-06-01T00:55:08.720Z'
                }
              ],
              itSkills: [
                {
                  _id: '53473d6c59c0af82035e8b95',
                  experience: 48,
                  level: 'expert',
                  skill: 'sql'
                },
                {
                  _id: '53473d6c59c0af82035e8b94',
                  experience: 48,
                  level: 'advanced',
                  skill: 'java'
                }
              ],
              languageCertificates: {},
              languageSkills: [
                {
                  _id: '53473d6c59c0af82035e8b93',
                  language: 'english',
                  listeningAndSpeaking: 'good',
                  readingAndWriting: 'good'
                }
              ],
              mail: '53473d6c59c0af82035e8b8a',
              mobile: '15147297691',
              name: '鲁宁',
              politicalStatus: 'league member',
              projectExperience: [
                {
                  _id: '53473d6c59c0af82035e8b92',
                  description: '新旧系统的替换，数据结构的转变，衍生了数据迁移工作，使用sql脚本存储过程将旧数据库中的数据迁移至新的数据库，并保证业务数据的正确性及完整性，使旧数据库中的数据在新系统中可以进行正常的业务办理',
                  developmentTools: 'UE',
                  from: '2013-04-01T00:55:08.717Z',
                  hardwareEnvironment: '一般性服务器配置',
                  name: '数据迁移',
                  responsibility: '负责新旧系统的业务、字段对比，编写并修正迁移规则文档，并将老数据库中的数据抽取至新的数据库，并保证数据的完整性以及正确性以及迁移之后的后期维护',
                  softwareEnvironment: 'windows+oracle+文本编辑器',
                  to: '9999-04-11T00:55:08.717Z'
                },
                {
                  _id: '53473d6c59c0af82035e8b91',
                  description: '项目作为地区房地商品房买卖及网上签约主要包括：1、用户管理平台：添加，修改，删除登录用户及销售人员；2、企业资质：对开发商企业用户的管理；3、商品房备案系统：买卖一手房，合同的签订，备案管理。',
                  developmentTools: 'eclipse',
                  from: '2013-04-01T00:55:08.717Z',
                  hardwareEnvironment: '一般性服务器配置',
                  name: '商品房备案系统',
                  responsibility: '商品房信息的日常维护及根据客户需求的开发',
                  softwareEnvironment: 'windows+oracle+weblogic8.1+jdk1.4',
                  to: '9999-04-11T00:55:08.717Z'
                },
                {
                  _id: '53473d6c59c0af82035e8b90',
                  description: '房屋登记系统作为地方房屋买卖变更等最核心的项目主要包括以下模块：1、受理：受理案件，收费、配图、档案扫描；2、审核：初审，复审、终审；3、缮证，发证，问题案件，派件；4、查询：楼盘查询、流程查询、登记查询、权利人查询、日志查询、权属查询等；5、资料管理：档案移交、档案借阅、归档回退、楼盘维护等；6、统计报表：工作量统计、收费清单、受理清单、归档清单、扫描统计权属统计等；7、特殊业务：楼盘标注、限制案件处理、异议案件处理、案件回退、楼盘合并等；8、系统管理：员工管理、用户管理、字典表、系统初始化、菜单管理等；9、业务数据：登记类别、流程管理、派件规则、收费标准、意见模板等；10、系统监控：在线用户；项目主要使用java+servlet+jsp技术实现。',
                  developmentTools: 'eclipse',
                  from: '2012-12-01T00:55:08.717Z',
                  hardwareEnvironment: '一般性服务器配置',
                  name: '登记系统',
                  responsibility: '1、针对房屋产权，抵押，租赁、限制、异议、预售等各个权属及系统各模块的维护2、根据客户要求进行功能模块的开发',
                  softwareEnvironment: 'windows+oracle+jdk1.4+weblogic8.1',
                  to: '9999-04-11T00:55:08.717Z'
                }
              ],
              residency: '上海-浦东新区',
              updated_at: '2014-04-28T10:17:59.496Z',
              workExperience: [
                {
                  _id: '53473d6c59c0af82035e8b99',
                  company: '上海南康科技有限公司',
                  department: '房地产应用集成事业部',
                  from: '2012-11-01T00:55:08.700Z',
                  industry: '计算机软件',
                  jobDescription: '负责地方房地系统的需求开发及维护，根据客户要求开发功能模块及日常维护1、数据迁移使用存储过程针对新旧系统的替换，数据库的更改进行数据抽取处理迁移，以保证数据的完整性及正确性2、房地登记系统使用底层的jsp+java+servlet技术针对：产权、抵押、租赁、限制、异议、备案等房屋权属进行功能的开发3、商品房备案系统使用南康框架技术针对网上买卖商品房及备案信息进行功能性开发及维护',
                  jobTitle: '软件工程师',
                  to: '9999-04-11T00:55:08.700Z'
                },
                {
                  _id: '53473d6c59c0af82035e8b98',
                  company: '河南威驰科技有限公司',
                  department: '运维部',
                  from: '2011-08-01T00:55:08.700Z',
                  industry: '计算机软件',
                  jobDescription: '与许昌联通公司合作，负责市区网络及相应软件正常运营',
                  jobTitle: '软件工程师',
                  to: '2012-10-01T00:55:08.700Z'
                }
              ],
              yearsOfExperience: 3
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '5356277e6fb4a1a33ecc5471',
            _score: 0.15460895,
            _source: {
              applyDate: '2014-04-22T08:25:34.319Z',
              applyPosition: 'Java开发实习生（上海）',
              birthday: '1989-09-19T08:25:34.097Z',
              careerObjective: {
                selfAssessment: '1、本人热爱软件事业，对IT领域的软件开发和设计工作有浓厚的兴趣，能承受较大的工作压力；\n2、性格成熟稳重，良好的沟通表达能力和团队合作精神，工作认真负责，完美主义者；\n3、自学能力强，喜欢钻研新技术，善于自己解决问题；\n4、爱好骑行、足球、文学。该语音控制步进电机系统，不需要经过声音训练，任何人都可以使用，在工厂中，大大的简化了工人必须动手的限制，提高生产效率。在此次项目中，软硬件的设计均由我一人负责。\"车辆跟踪定位系统\"采用C/S结构，分为客户端、服务器两部分，客户端由STM32采集GPS信号经过GPRS模块发送的Internet，服务端采用java语言编程，通过socket接收采集的信号，解析，调用googlemap api实时显示，通过JDBC驱动MySQL实时存储数据信息，客户端服务器采用TCP/IP协议通讯项目独立自主完成传感器贴服于振摆上，陀螺仪加速度计采集信号，经过卡尔曼滤波修正，判断振幅是否在合格的范围内。整个系统的数据采集，后续滤波处理工作均由我一人承担。主要研究javaweb方向 \n主修课程：微机原理 汇编语言 C语言基础  JAVA 嵌入式系统 数据库原理  电路原理 模拟电子技术 数字电子技术仪器测试软件的开发维护，通过软件代码协助硬件工程师分析仪器bug主要负责学生党会的召开，转正，开展党内活动等主要协助老师负责学生的就业工作，开展校园就业技能选讲会，鼓励有能力同学自主创业等',
                targetSalary: {}
              },
              certifications: [
                {
                  _id: '5356277e6fb4a1a33ecc5477',
                  date: '2014-03-01T08:25:34.248Z',
                  score: 'NaN',
                  subject: '优秀团干部证书'
                },
                {
                  _id: '5356277e6fb4a1a33ecc5476',
                  date: '2012-09-01T08:25:34.248Z',
                  score: 'NaN',
                  subject: '光电杯比赛证书'
                }
              ],
              channel: '前程无忧',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-22T08:25:34.328Z',
              highestDegree: 'master',
              educationHistory: [
                {
                  _id: '5356277e6fb4a1a33ecc5478',
                  degree: 'master',
                  from: '2012-09-01T08:25:34.209Z',
                  major: '通信工程',
                  school: '上海理工大学',
                  to: '2015-06-01T08:25:34.209Z'
                }
              ],
              email: 'duxidong1989@126.com',
              gender: 'male',
              inSchoolPractices: [
                {
                  _id: '5356277e6fb4a1a33ecc5472',
                  content: '美迪希工程部实习生仪器测试软件的开发维护，通过软件代码协助硬件工程师分析仪器bug',
                  from: '2013-07-01T08:25:34.298Z',
                  to: '2013-12-01T08:25:34.298Z'
                }
              ],
              itSkills: [
                {
                  _id: '5356277e6fb4a1a33ecc5475',
                  experience: 12,
                  level: 'advanced',
                  skill: 'HTML'
                },
                {
                  _id: '5356277e6fb4a1a33ecc5474',
                  experience: 12,
                  level: 'advanced',
                  skill: 'XML'
                },
                {
                  _id: '5356277e6fb4a1a33ecc5473',
                  experience: 12,
                  level: 'advanced',
                  skill: 'SQL'
                }
              ],
              languageCertificates: {
                english: 'cet6'
              },
              languageSkills: [],
              mail: '5356277d6fb4a1a33ecc546d',
              mobile: '18817840053',
              name: '杜希栋',
              politicalStatus: 'citizen',
              projectExperience: [
                {
                  _id: '5356277e6fb4a1a33ecc547b',
                  description: '该语音控制步进电机系统，不需要经过声音训练，任何人都可以使用，在工厂中，大大的简化了工人必须动手的限制，提高生产效率。',
                  developmentTools: 'Keil',
                  from: '2013-06-01T08:25:34.198Z',
                  hardwareEnvironment: '单片机',
                  name: '语音控制步进电机',
                  responsibility: '在此次项目中，软硬件的设计均由我一人负责。',
                  softwareEnvironment: 'Windows7',
                  to: '2013-07-01T08:25:34.198Z'
                },
                {
                  _id: '5356277e6fb4a1a33ecc547a',
                  description: '\"车辆跟踪定位系统\"采用C/S结构，分为客户端、服务器两部分，客户端由STM32采集GPS信号经过GPRS模块发送的Internet，服务端采用java语言编程，通过socket接收采集的信号，解析，调用googlemap api实时显示，通过JDBC驱动MySQL实时存储数据信息，客户端服务器采用TCP/IP协议通讯',
                  developmentTools: 'Eclipse keil',
                  from: '2013-06-01T08:25:34.198Z',
                  hardwareEnvironment: 'stm32',
                  name: '车辆跟踪定位系统',
                  responsibility: '项目独立自主完成',
                  softwareEnvironment: 'c java js mysql',
                  to: '9999-04-22T08:25:34.198Z'
                },
                {
                  _id: '5356277e6fb4a1a33ecc5479',
                  description: '传感器贴服于振摆上，陀螺仪加速度计采集信号，经过卡尔曼滤波修正，判断振幅是否在合格的范围内。',
                  developmentTools: 'Keil',
                  from: '2013-03-01T08:25:34.198Z',
                  hardwareEnvironment: 'STM32',
                  name: '大幅度振摆测试',
                  responsibility: '整个系统的数据采集，后续滤波处理工作均由我一人承担。',
                  softwareEnvironment: 'Windows7',
                  to: '2013-05-01T08:25:34.198Z'
                }
              ],
              residency: '上海-杨浦区',
              updated_at: '2014-04-28T10:18:00.197Z',
              workExperience: [],
              yearsOfExperience: -1
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '534bbb25462ea5768de17fc0',
            _score: 0.11149567,
            _source: {
              applyDate: '2014-04-14T10:40:34.314Z',
              applyPosition: 'Java软件工程师-上海',
              birthday: '1991-09-01T09:40:37.682Z',
              careerObjective: {
                entryTime: 'immediately',
                selfAssessment: '1.具有很强的团队精神，有良好的组织和协调能力，有强烈的集体荣誉感。 2.自学能力强，喜欢钻研新技术，敢于面对和克服困难。 3.为人诚恳，待人真诚，做事有耐心，有责任心，学习勤奋刻苦，脚踏实地，服从安排 4.具备较强的执行能力，工作效率较高，善于发现并解决问题 5.对java有着浓厚的兴趣，有较强的自学能力对于新技术能很快的上手',
                targetSalary: {
                  from: 0,
                  to: 0
                }
              },
              certifications: [],
              channel: '智联招聘',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-14T10:40:37.765Z',
              highestDegree: 'bachelor',
              educationHistory: [
                {
                  _id: '534bbb25462ea5768de17fc6',
                  degree: 'bachelor',
                  from: '2009-09-01T10:40:37.714Z',
                  major: ' 软件工程 ',
                  school: '重庆理工大学 ',
                  to: '2013-06-01T10:40:37.714Z'
                }
              ],
              email: 'zhuruijava@163.com',
              gender: 'male',
              hukou: '重庆',
              inSchoolPractices: [],
              itSkills: [
                {
                  _id: '534bbb25462ea5768de17fc5',
                  experience: 18,
                  level: 'advanced',
                  skill: 'sql server'
                },
                {
                  _id: '534bbb25462ea5768de17fc4',
                  experience: 15,
                  level: 'advanced',
                  skill: 'java'
                }
              ],
              languageCertificates: {},
              languageSkills: [
                {
                  _id: '534bbb25462ea5768de17fc3',
                  language: 'english',
                  listeningAndSpeaking: 'average',
                  readingAndWriting: 'average'
                }
              ],
              mail: '534bbb25462ea5768de17fbc',
              mobile: '15922722924',
              name: '朱锐',
              politicalStatus: 'league member',
              projectExperience: [
                {
                  _id: '534bbb25462ea5768de17fc2',
                  description: '该系统是为博鑫汽车贸易有限公司开发的OA系统，其主要功能设计到：个人事务管理、信息发布、信息交流、公文流转、协同办公、办公用品管理、固定资产管理、财务管理、人力资源和权限系统管理九个模块。系统采用SSH三大框架进行架构和开发，jsp充当表示层，struts2中的Action充当业务控制层，hibernate充当数据持久层，spring采用作为表示层和业务层的媒介，它是客户端和型，将表示层和业务层耦合性降低。通过这一基于的开放源代码的持久化中间件，做了轻量级封装，不仅提供ORM映射服务，还提供了数据缓存功能以及通过检索策略实现数据查询，以便方便的通过来操纵数据库。另外，考虑到用户操作时的方便，本系统在一些添加操作中可以通过读取Jxl读取Excel进行批量添加。在统计报表这一块，本系统使用了JFreechart进行图形处理。',
                  developmentTools: 'eclipse,powerdesigner',
                  from: '2013-10-01T10:40:37.739Z',
                  hardwareEnvironment: 'pc server',
                  name: '博鑫汽车贸易有限公司OA系统',
                  responsibility: '项目经理的左右手，辅助经理设计项目的架构、模块。个人负责的模块有：1、个人事务管理2、信息发布3、信息交流4、程序维护以及bug修复',
                  softwareEnvironment: 'mySql,tomcat,windows',
                  to: '2014-04-01T10:40:37.739Z'
                },
                {
                  _id: '534bbb25462ea5768de17fc1',
                  description: '该项目是为重庆市寸滩保税区管理局开发的日常办公系统，基本实现企业内部日常办公中间过程的无纸化，提高办公效率和办公质量，提高企业的知识管理水平，增强企业文化的建设。项目主要包括：1、辅助个人办公2、公文消息传递3、工作流系统4、信息交流5、会议管理系统6、组织人事7、系统管理等主模块。本系统主要采用MVC三层模式和SSH框架设计而制作，其中采用Struts2、Spring、Hibernate等框架开发，所有的控制由Struts2完成，提交到Struts2的用户请求交由Spring管理，Spring统一管理业务层的所有事务。对数据的操作交由Hibernate完成。展示层用JSP页面充当。',
                  developmentTools: 'eclipse,powerdesigner',
                  from: '2013-06-01T10:40:37.739Z',
                  hardwareEnvironment: 'pc server',
                  name: '重庆寸滩保税区办公自动化系统',
                  responsibility: '1.参与项目的需求分析，负责项目的架构设计、模块设计和开发。2.负责解决项目中的技术难点和技术把关。3.协助项目经理做好项目管理。个人做的模块有：1、公告栏2、用户角色及权限管理3、报表4、bug修改、添加子功能、项目维护',
                  softwareEnvironment: 'mySql,tomcat,windows',
                  to: '2013-10-01T10:40:37.739Z'
                }
              ],
              residency: '上海-黄浦区',
              updated_at: '2014-04-28T10:18:00.128Z',
              workExperience: [
                {
                  _id: '534bbb25462ea5768de17fc7',
                  company: '重庆爱奥尼科技有限公司',
                  department: '开发部',
                  from: '2013-06-01T10:40:37.707Z',
                  industry: '互联网/电子商务',
                  jobDescription: '1.负责产品在服务端的设计、开发、调试、维护 2.全程参与产品设计讨论与技术论证 3.参与团队技术交流和分享活动，促进团队共同进步 4.负责研发公司应用软件的模块设计、开发和交付',
                  jobTitle: '软件研发工程师',
                  to: '2014-04-01T10:40:37.707Z'
                }
              ],
              yearsOfExperience: 1
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '5355c14ab5f85ce10e5aa732',
            _score: 0.10780269,
            _source: {
              applyDate: '2014-04-22T01:09:20.191Z',
              applyPosition: 'IOS开发工程师-上海',
              birthday: '1989-01-01T01:09:30.569Z',
              careerObjective: {
                entryTime: 'immediately',
                selfAssessment: '熟练掌握Object-c语法及IOS开发工具XCode，能够运用SDK独立完成IOS应用的设计，编写，了解IOS生命周期，多线程机制，能够熟练运用KVC，KVO编程思想，了解Http协议及socket编程。能够熟练使用SVN，GIT工具。 熟悉C++，精通Qt应用程序开发。有5年的编程经验，3年的工作经验。在职期间工作认真，积极负责，注重团队配合，学习能力强。精通PHP，html，javascript,Jquery。对网站开发有一定基础。',
                targetSalary: {
                  from: 10001,
                  to: 15000
                }
              },
              certifications: [
                {
                  _id: '5355c14ab5f85ce10e5aa73f',
                  date: '2010-07-01T01:09:30.607Z',
                  score: '',
                  subject: '大学英语四级'
                }
              ],
              channel: '智联招聘',
              civilState: 'single',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-22T01:09:30.675Z',
              highestDegree: 'bachelor',
              educationHistory: [
                {
                  _id: '5355c14ab5f85ce10e5aa740',
                  degree: 'bachelor',
                  from: '2007-06-01T01:09:30.598Z',
                  major: ' 计算机网络工程 ',
                  school: '哈尔滨理工大学 ',
                  to: '2011-06-01T01:09:30.598Z'
                }
              ],
              email: '593410699@qq.com',
              gender: 'male',
              hukou: '吉林四平',
              inSchoolPractices: [],
              itSkills: [
                {
                  _id: '5355c14ab5f85ce10e5aa73e',
                  experience: 16,
                  level: 'expert',
                  skill: 'Object-c'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa73d',
                  experience: 16,
                  level: 'advanced',
                  skill: 'HTML'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa73c',
                  experience: 16,
                  level: 'advanced',
                  skill: 'js'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa73b',
                  experience: 12,
                  level: 'advanced',
                  skill: 'PHP'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa73a',
                  experience: 16,
                  level: 'expert',
                  skill: 'Qt'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa739',
                  experience: 36,
                  level: 'advanced',
                  skill: 'C++'
                }
              ],
              languageCertificates: {},
              languageSkills: [
                {
                  _id: '5355c14ab5f85ce10e5aa738',
                  language: 'english',
                  listeningAndSpeaking: 'good',
                  readingAndWriting: 'good'
                }
              ],
              mail: '5355c14ab5f85ce10e5aa72e',
              mobile: '18654637062',
              name: '李卓',
              politicalStatus: 'league member',
              projectExperience: [
                {
                  _id: '5355c14ab5f85ce10e5aa737',
                  description: '皇家德州扑克是一款apple移动平台扑克游戏，定位是国内市场。项目服务端框架是Pomelo，网络层主要采用WebSocket，前端是oc编写。itunes下载地址：https://itunes.apple.com/US/app/id738956664',
                  developmentTools: 'XCode',
                  from: '2013-03-01T01:09:30.629Z',
                  hardwareEnvironment: 'Mac',
                  name: '皇家德州扑克',
                  responsibility: '本人负责上层功能的实现，界面的实现。例如社交系统，成就系统，房间过滤等功能实现，新闻公告，游戏的邮件系统等等。并参与了所有这些相关的数据结构设计与实现。语音实现是采用voiceRecorder的录音和播放功能实现的，采用类似于微信的语音接入功能，将录制的语音上传到云服务器，然后通过后台发送下载通知到客户端进行语音信息的下载然后进行播放，而后台是通过广播的形式发送到不同的客户端上。语音的上传和下载都是通过异步的线程处理的，不能占用主线程的资源否则会导致网络不好的情况下游戏卡死。第三方分享及接入都是采用的umeng的框架进行的，利用umeng的sdk进行接入，分享，sso认证等。还有短信分享功能。成就系统通过uitableview实现，后期修改为连续的同类型奖励显示在同一cell内，通过进度更新显示。好友系统实现每日赠送回赠筹码，添加好友，推荐附近好友列表，搜索好友等功能。每个列表中的好友都可点击查看详细信息。并且进行牌局跟踪等功能，准确定位到该玩家所在的房间。一起玩游戏。邮件系统用来展示各种系统和用户消息。牌桌列表可以根据不同的过滤条件进行过滤处理。',
                  softwareEnvironment: 'Object-c',
                  to: '2014-02-01T01:09:30.629Z'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa736',
                  description: '基于apple的游戏分享社区。',
                  developmentTools: 'wamp/Lamp??CodelobsterPHPEdition 等',
                  from: '2012-09-01T01:09:30.629Z',
                  hardwareEnvironment: 'windows',
                  name: 'www.aungame.com',
                  responsibility: '服务端PHP功能代码时机编写，前端JS，HTML代码的设计编写，样式调整',
                  softwareEnvironment: 'PHP mySQL js Apache',
                  to: '2013-02-01T01:09:30.629Z'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa735',
                  description: '完全用QtCreater开发的工程，具有跨平台特性，移植到mac上只需简单修改，采用全新的qml技术完成界面，界面特效丰富，目前还没有发布。',
                  developmentTools: 'Qtcreater',
                  from: '2012-01-01T01:09:30.629Z',
                  hardwareEnvironment: 'pc',
                  name: 'Aunsoft VidPie',
                  responsibility: '负责对底层功能进行接口封装，封装成插件提供给qml制作界面使用，进行一些简单的qml界面编写，也负责沟通qml界面开发人员和底层人员的工作。',
                  softwareEnvironment: 'windows',
                  to: '9999-04-22T01:09:30.629Z'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa734',
                  description: '视频处理的一系列软件，appleappstore和官网具有销售。',
                  developmentTools: 'vs2008 Qtcreater',
                  from: '2011-09-01T01:09:30.629Z',
                  name: 'convert系列',
                  responsibility: 'appstore产品开发，项目维护及优化，新功能添加，用户体验优化。',
                  softwareEnvironment: 'windows 或者 mac操作系统',
                  to: '2011-12-01T01:09:30.629Z'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa733',
                  description: '音视频转换成mkv，以及字幕导出软件',
                  developmentTools: 'VS2008+Qt',
                  from: '2011-03-01T01:09:30.629Z',
                  hardwareEnvironment: 'pc',
                  name: 'ByteCopy',
                  responsibility: '主要负责维护，新功能添加。实现程序的多语言版本，完成DVD、BD，iSOIFO本地文件以及文件夹中的视频文件的字幕输出。自动化构建任务。',
                  softwareEnvironment: 'windows或者mac',
                  to: '2011-09-01T01:09:30.629Z'
                }
              ],
              residency: '江苏昆山',
              updated_at: '2014-04-28T10:18:00.178Z',
              workExperience: [
                {
                  _id: '5355c14ab5f85ce10e5aa742',
                  company: '樊姜国际商务有限公司',
                  department: '产品部',
                  from: '2013-03-01T01:09:30.589Z',
                  industry: '其他',
                  jobDescription: '配合底层开发人员，完成APP上层框架，功能设计，界面逻辑设计，代码编写。系统环境：MAC开发工具：XCode开发语言：OC产品是一款德州扑克，itunes下载地址：https://itunes.apple.com/US/app/id738956664。产品服务端框架是Pomelo，网络层主要是WebSocket。',
                  jobTitle: 'IOS开发工程师',
                  to: '2014-02-01T01:09:30.589Z'
                },
                {
                  _id: '5355c14ab5f85ce10e5aa741',
                  company: '漠野软件',
                  department: '产品部',
                  from: '2011-03-01T01:09:30.590Z',
                  industry: '计算机软件',
                  jobDescription: '公司产品主要类型是：视频格式转换、BD/DVD支持、DVD制作、视频movie制作。产品主要通过网络营销的方式卖给国外用户（美、欧、日）为主，也兼顾appstore应用商店的相应版本的开发销售。软件环境： QT4.x VS2008硬件环境：PC开发工具：VS2008+QT参与的项目有：ByteCopy，convert系列产品共100余款，vidPie工作前期主要负责各项目(盈利产品)的维护工作，修改项目的bug以及新功能的添加任务，对面向对象有一定了解，曾独立制作apple&nbsp;&nbsp;appstore产品TransMXF，并成功提交，对apple审核机制有一定了解。',
                  jobTitle: '研发工程师',
                  to: '2012-12-01T01:09:30.590Z'
                }
              ],
              yearsOfExperience: 3
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '534b4344cc247b9a02ea3c29',
            _score: 0.09291307,
            _source: {
              applyDate: '2014-04-14T02:09:05.086Z',
              applyPosition: 'Java软件工程师-上海',
              birthday: '1991-11-01T02:09:08.400Z',
              careerObjective: {
                entryTime: 'immediately',
                selfAssessment: '1、为人诚恳，待人真诚，做事有耐心，有责任心，学习勤奋刻苦，脚踏实地，服从安排。2、能够与团队同事融洽相处，有较强的团队合作与沟通意识。3、对Java有浓厚的兴趣,有较强的理解与自学能力，对于新技术与新知识能够较快上手。4、具备较强的执行能力，有良好的编码习惯，善于发现并解决问题。',
                targetSalary: {
                  from: 4001,
                  to: 6000
                }
              },
              certifications: [],
              channel: '智联招聘',
              civilState: 'single',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-14T02:09:08.437Z',
              highestDegree: 'bachelor',
              educationHistory: [
                {
                  _id: '534b4344cc247b9a02ea3c35',
                  degree: 'bachelor',
                  from: '2009-09-01T02:09:08.407Z',
                  major: ' 计算机科学与技术 ',
                  school: '重庆理工大学 ',
                  to: '2013-06-01T02:09:08.407Z'
                }
              ],
              email: 'lijunlinjava@163.com',
              gender: 'male',
              hukou: '四川南充',
              inSchoolPractices: [],
              itSkills: [
                {
                  _id: '534b4344cc247b9a02ea3c34',
                  experience: 14,
                  level: 'advanced',
                  skill: 'MySQL'
                },
                {
                  _id: '534b4344cc247b9a02ea3c33',
                  experience: 3,
                  level: 'advanced',
                  skill: 'spring mvc'
                },
                {
                  _id: '534b4344cc247b9a02ea3c32',
                  experience: 14,
                  level: 'advanced',
                  skill: 'Oracle'
                },
                {
                  _id: '534b4344cc247b9a02ea3c31',
                  experience: 18,
                  level: 'advanced',
                  skill: 'SQL server'
                },
                {
                  _id: '534b4344cc247b9a02ea3c30',
                  experience: 14,
                  level: 'advanced',
                  skill: 'jquery'
                },
                {
                  _id: '534b4344cc247b9a02ea3c2f',
                  experience: 16,
                  level: 'advanced',
                  skill: 'javascript'
                },
                {
                  _id: '534b4344cc247b9a02ea3c2e',
                  experience: 14,
                  level: 'advanced',
                  skill: 'ssh三大框架'
                },
                {
                  _id: '534b4344cc247b9a02ea3c2d',
                  experience: 18,
                  level: 'advanced',
                  skill: 'java'
                }
              ],
              languageCertificates: {},
              languageSkills: [
                {
                  _id: '534b4344cc247b9a02ea3c2c',
                  language: 'english',
                  listeningAndSpeaking: 'average',
                  readingAndWriting: 'average'
                }
              ],
              mail: '534b4344cc247b9a02ea3c25',
              mobile: '18523698821',
              name: '李俊霖',
              politicalStatus: 'citizen',
              projectExperience: [
                {
                  _id: '534b4344cc247b9a02ea3c2b',
                  description: '随着我国经济的发展，物流已经是经济中很重要的一部分，为了满足市场信息化的需要，为企业带来更方便的管理，从而开发物流信息管理系统，主要功能包括：财务、员工、机构、客户、订单、系统、仓库、运输管理和前台管理。系统采用SSH三大框架进行架构和开发，Jsp充当表示层，Struts中的Action充当业务控制层，客户端和服务器Hibernate充当数据持久层，采用Struts作为表示层和业务层的媒介，它是客端传递信息的重要组件，通过使用Struts组件模型，将表示层和业务层耦合性降低。通过使用了Hibernate这一基于Java的开放源代码的持久化中间件，将JDBC做了轻量级封装，不仅提供ORM映射服务，还提供了数据缓存功能以及通过检索策略实现数据查询，以便方便的通过HibernateAPI来操纵数据库。客户管理模块中客户注册使用Dwr，模糊搜索使用了Ajax,客户反馈报表是用jFreeChar来实现，系统菜单用Ext给用户更友好更方便的用户体验。',
                  developmentTools: 'Myeclipse、SQL Server2005、Tomcat、Dreamweaver',
                  from: '2013-12-01T02:09:08.418Z',
                  name: '物流信息管理系统',
                  responsibility: '根据物流信息管理中[客户管理]需求分析进行这模块的详细设计，根据需求完成数据库部分设计、创建，负责项目客户管理模块中客户信息、客户服务、客户流失、客户记录管理业务逻辑分析和部分功能实现，做了相应的单元测试。',
                  to: '2014-03-01T02:09:08.418Z'
                },
                {
                  _id: '534b4344cc247b9a02ea3c2a',
                  description: '该系统是为成都博瑞房地产开发有限责任公司开发的，设计到楼盘的开发、销售、客户、物业管理等综合管理系统，其主要功能分为如下几个模块：房产资料、销售管理、财务管理、客户管理、统计报表、物业管理、系统管理、权限管理。系统采用sshjspstrutshibernatestruts服务器端传递信息的重要组件，通过使用组件模strutshibernatespring三大框架进行架构和开发，jsp充当表示层，struts中的Action充当业务控制层，hibernate充当数据持久层，采用jsp作为表示层和业务层的媒介，将表示层和业务层耦合性降低。通过这一基于hibernate的开放源代码的持久化中间件，将jdbc做了轻量级封装，不仅提供ORM映射服务，还提供了数据缓存功能以及通过检索策略实现数据查询，以便方便的通过来操纵数据库。另外，考虑到用户操作时的方便，本系统在一些添加操作中可以通过读取Jxl读取Excel进行批量添加。',
                  from: '2013-07-01T02:09:08.418Z',
                  name: '成都博瑞房产楼盘管理系统',
                  responsibility: '在该系统中本人主要负责如下模块：房产资料：项目概况、户型资料、房间资料、房屋定价、价格调整销售管理：接待记录、预约登记、销售登记、退房登记、换房登记。',
                  to: '2013-11-01T02:09:08.418Z'
                }
              ],
              residency: '上海-闸北区',
              updated_at: '2014-04-28T10:17:59.548Z',
              workExperience: [
                {
                  _id: '534b4344cc247b9a02ea3c36',
                  company: '重庆道米科技有限公司',
                  department: '软件研发部',
                  from: '2013-07-01T02:09:08.405Z',
                  industry: '计算机软件',
                  jobDescription: '参与客户需求分析，根据需求文档及概要设计进行详细设计，根据需求负责模块代码的编写，测试，，按照设计文档进行功能实现。',
                  jobTitle: '软件工程师',
                  to: '9999-04-14T02:09:08.405Z'
                }
              ],
              yearsOfExperience: 1
            }
          },
          {
            _index: 'compass-dev',
            _type: 'resume',
            _id: '5355c145b5f85ce10e5aa596',
            _score: 0.09291307,
            _source: {
              applyDate: '2014-04-22T01:09:20.191Z',
              applyPosition: 'Java软件工程师-上海',
              birthday: '1988-09-01T00:09:25.906Z',
              careerObjective: {
                entryTime: 'immediately',
                selfAssessment: '对技术充满激情，对工作认真负责 有较强的组织协调能力 有较强的团队精神，良好的人际沟通能力 社会实践能力强，对新事物接受能力快 乐观向上，爱好广泛 “器必试而先知其利钝，马必骑而后知其良驽”，我深信，只要给我一片土壤，我会用年轻的生命去耕耘。您不仅能看到我的成功，而且能够收获整个秋天，它就是我的自信和能力的承诺',
                targetSalary: {
                  from: 0,
                  to: 0
                }
              },
              certifications: [],
              channel: '智联招聘',
              civilState: 'married',
              company: '532fc0eab889c118246c6d59',
              created_at: '2014-04-22T01:09:25.997Z',
              highestDegree: 'associate',
              educationHistory: [
                {
                  _id: '5355c145b5f85ce10e5aa5ab',
                  degree: 'associate',
                  from: '2008-09-01T01:09:25.923Z',
                  major: ' 计算机科学与技术 ',
                  school: '西安理工大学 ',
                  to: '2011-07-01T01:09:25.923Z'
                }
              ],
              email: '245761925@qq.com',
              gender: 'male',
              hukou: '陕西咸阳',
              inSchoolPractices: [],
              itSkills: [
                {
                  _id: '5355c145b5f85ce10e5aa5aa',
                  experience: 24,
                  level: 'advanced',
                  skill: 'PowerDesigner'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a9',
                  experience: 24,
                  level: 'advanced',
                  skill: 'Struts2'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a8',
                  experience: 36,
                  level: 'advanced',
                  skill: 'jsp'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a7',
                  experience: 36,
                  level: 'expert',
                  skill: 'html'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a6',
                  experience: 36,
                  level: 'advanced',
                  skill: 'J2EE'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a5',
                  experience: 36,
                  level: 'advanced',
                  skill: 'CSS'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a4',
                  experience: 36,
                  level: 'advanced',
                  skill: 'JavaScript'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a3',
                  experience: 36,
                  level: 'expert',
                  skill: 'Java'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a2',
                  experience: 12,
                  level: 'advanced',
                  skill: 'spring'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a1',
                  experience: 12,
                  level: 'advanced',
                  skill: 'hibernate'
                },
                {
                  _id: '5355c145b5f85ce10e5aa5a0',
                  experience: 36,
                  level: 'advanced',
                  skill: 'pl/sql'
                },
                {
                  _id: '5355c145b5f85ce10e5aa59f',
                  experience: 36,
                  level: 'advanced',
                  skill: 'Linux'
                }
              ],
              languageCertificates: {},
              languageSkills: [
                {
                  _id: '5355c145b5f85ce10e5aa59e',
                  language: 'english',
                  listeningAndSpeaking: 'average',
                  readingAndWriting: 'average'
                }
              ],
              mail: '5355c145b5f85ce10e5aa592',
              mobile: '18301973020',
              name: '刘珂',
              politicalStatus: 'league member',
              projectExperience: [
                {
                  _id: '5355c145b5f85ce10e5aa59d',
                  description: '主要是针对学校学生的安全所采用的解决方案，学生用我们公司生产的射频卡，进出校门，读卡器都会读到射频卡的信息，进而会给家长通知，确保家长了解学生的动态',
                  developmentTools: 'Myeclipse+mysql+tomcat6.0+jdk1.6',
                  from: '2013-11-01T01:09:25.951Z',
                  hardwareEnvironment: 'windows server 2003',
                  name: '平安校园',
                  responsibility: '负责全部功能的开发，平安校园包括一下几方面功能：1．数据的导入，包括（家长信息，班级信息，学生信息的导入）2．对家长信息，班级信息，学生信息进行管理，可以批量导入液可以单个添加3．出入校明细信息管理4．出入学校异常信息管理5．时间管理6．请假管理',
                  softwareEnvironment: 'jdk1.6+ tomcat6.0+mysql5.0',
                  to: '2014-04-01T01:09:25.951Z'
                },
                {
                  _id: '5355c145b5f85ce10e5aa59c',
                  description: '对视频进行预览，并对视频的某一时间点的帧图像进行截取保存，对图像的截取是通过服务的触发来完成的',
                  from: '2013-09-01T01:09:25.951Z',
                  name: '拍照客户端（基于海康威视SDK二次开发',
                  responsibility: '所有功能的实现，包括预览，截取图片',
                  to: '2013-10-01T01:09:25.951Z'
                },
                {
                  _id: '5355c145b5f85ce10e5aa59b',
                  description: '主要通过程序对串口接收到的射频卡的数据（不同厂商）按照相应的算法进行解析，解析完成之后，通过JavaSwing,显示',
                  from: '2013-08-01T01:09:25.952Z',
                  name: 'RFID扫卡客户端',
                  responsibility: 'RFID扫卡客户端的所有功能，了解了数据如何从串口接收，以及按什么样的方式接收，由于javaSwing用的越来越少，所以以前从未接触过，所以这次通过扫卡程序的开发，对javaSwing有了一定的了解',
                  to: '2013-09-01T01:09:25.952Z'
                },
                {
                  _id: '5355c145b5f85ce10e5aa59a',
                  description: '无纸化受理平台后主要针对的是电信，移动，大客户的档案管理解决方案，系统主要包括包括受理单管理，柜台营销管理，电子寄送管理，备份管理，系统管理',
                  developmentTools: 'Myeclipse+oracle/mysql+tomcat6.0',
                  from: '2013-01-01T01:09:25.952Z',
                  hardwareEnvironment: 'readhat5.0',
                  name: '无纸化管理平台',
                  responsibility: '柜台营销管理，电子登记单稽核，柜台营销管理包括（营销节目管理，营销节目单管理，营销节目单发布管理），电子登记单稽核包括（一级稽核，二级稽核，稽核统计（营业员）稽核统计（营业厅））签章管理包括（印模管理，印模审批）',
                  softwareEnvironment: 'jdk1.6+ tomcat6.0+mysql5.0',
                  to: '2013-07-01T01:09:25.952Z'
                },
                {
                  _id: '5355c145b5f85ce10e5aa599',
                  description: '通过AIE系统&lt;=&gt;[本系统]&lt;=&gt;RTU&lt;=...=&gt;RTU&lt;=....=&gt;SmartNode机制，提供一个基础的自动化环境交互网络，设备管理系统需要完成对RTU等所属节点的可用性管理；以及对应用提供需要的接口和服务，实现应用和设备的相互发现，状态追踪，配置管理，以及实时消息转发',
                  developmentTools: 'Myeclipse+oracle+tomcat6.0+jdk1.6',
                  from: '2012-07-01T01:09:25.952Z',
                  hardwareEnvironment: 'readhat5.0',
                  name: '设备管理系统',
                  responsibility: '设备的管理（添加，修改，删除，启动，停止，重启，复位），设备的启动，停止，等操作',
                  softwareEnvironment: 'jdk1.6+ tomcat6.0+mysql5.0',
                  to: '2012-12-01T01:09:25.952Z'
                },
                {
                  _id: '5355c145b5f85ce10e5aa598',
                  description: '之前谈到AIE系统有两个基础的应用，一个是系统管理，一个是人力资源管理，系统管理来管理应用的使用权限，人力资源管理管理人员相关信息，在人力资源管理应用中添加信息后，同步服务会把添加的信息同步到其它应用中，这样节省人力和时间、不易出错',
                  from: '2012-05-01T01:09:25.952Z',
                  name: '同步服务',
                  responsibility: '我主要做的就是AIE的同步接收服务,收到人力资源同步服务添加删除更新账户的消息，同时同步到其他应用中，过程使用XNM消息进行，发送和接收',
                  to: '2012-06-01T01:09:25.952Z'
                },
                {
                  _id: '5355c145b5f85ce10e5aa597',
                  description: 'AIE系统采用SSO单点登录的方式进行访问，属于一个应用集群的平台，主要包括系统管理，人力资源管理，这两个基础系统是必须存在的，再加上应用系统,这就是AIE主要的组成部分，应用系统可以是一个，也可以扩展为多个，其实AIE主要的功能就是对多个应用进行统一管理',
                  developmentTools: 'Myeclipse+mysql/oracle+tomcat6.0+jdk1.6',
                  from: '2011-05-01T01:09:25.952Z',
                  hardwareEnvironment: 'readhat5.0',
                  name: 'AIE系统',
                  responsibility: '系统管理,人力资源管理两个应用的部分页面设计，与后台的交互，以及数据库的操作，并且学会编写数据字典，接口文档，和功能性文档',
                  softwareEnvironment: 'jdk1.6+ tomcat6.0+mysql5.0/oracle10g',
                  to: '2012-05-01T01:09:25.952Z'
                }
              ],
              residency: '上海-闵行区',
              updated_at: '2014-04-28T10:18:00.159Z',
              workExperience: [
                {
                  _id: '5355c145b5f85ce10e5aa5ac',
                  company: '陕西昌大科技有限公司',
                  department: '研发部',
                  from: '2011-04-01T01:09:25.918Z',
                  industry: '计算机软件',
                  jobDescription: '主要负责JAVA WEB的开发,根据项目需求编写相应的文档,以及数据库的设计以及存储过程的编写.还有软件在Linux服务器进行部署等工作。',
                  jobTitle: '软件工程师',
                  to: '2014-04-01T01:09:25.918Z'
                }
              ],
              yearsOfExperience: 3
            }
          }
        ]
      },
      facets: {
        applyPosition: {
          _type: 'terms',
          missing: 1,
          total: 9,
          other: 0,
          terms: [
            {
              term: 'Java软件工程师-上海',
              count: 6
            },
            {
              term: '大数据分析师-上海',
              count: 1
            },
            {
              term: 'Java开发实习生（上海）',
              count: 1
            },
            {
              term: 'IOS开发工程师-上海',
              count: 1
            }
          ]
        },
        highestDegree: {
          _type: 'terms',
          missing: 0,
          total: 10,
          other: 0,
          terms: [
            {
              term: 'bachelor',
              count: 5
            },
            {
              term: 'mba',
              count: 2
            },
            {
              term: 'associate',
              count: 2
            },
            {
              term: 'master',
              count: 1
            }
          ]
        },
        age: {
          _type: 'histogram',
          entries: [
            {
              key: 20,
              count: 3,
              min: 1,
              max: 1,
              total: 3,
              total_count: 3,
              mean: 1
            },
            {
              key: 25,
              count: 5,
              min: 1,
              max: 1,
              total: 5,
              total_count: 5,
              mean: 1
            },
            {
              key: 30,
              count: 1,
              min: 1,
              max: 1,
              total: 1,
              total_count: 1,
              mean: 1
            },
            {
              key: 40,
              count: 1,
              min: 1,
              max: 1,
              total: 1,
              total_count: 1,
              mean: 1
            }
          ]
        }
      }
    };
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    fakeModal = {
      result: {
        then: function (confirmCallback, cancelCallback) {
          this.confirmCallback = confirmCallback;
          this.cancelCallback = cancelCallback;
        }
      },
      close: function (item) {
        this.result.confirmCallback(item);
      },
      dismiss: function (item) {
        this.result.cancelCallback(item);
      }
    };

    modalOpenStub = sinon.stub($modal, 'open');
    modalOpenStub.returns(fakeModal);
  }));

  ['new', 'undertimined', 'pursued'].forEach(function (status) {
    describe('/applications/' + status, function () {
      beforeEach(inject(function ($controller) {
        $httpBackend.expectGET('/api/applications?page=1&pageSize=50&status=' + status).respond(result);
        mvApplicationListCtrl = $controller('mvApplicationListCtrl', {
          $scope: $scope,
          $routeParams: {
            status: status
          }
        });
        $httpBackend.flush();
      }));

      it('should invoke the /api/applications', inject(function () {
        $scope.states.searchOptions = {
          q: 'hello',
          age: 20,
          applyPosition: 'cio',
          highestDegree: 'master'
        };

        $httpBackend.expectGET('/api/applications?age=20&applyPosition=cio&highestDegree=master&page=1&pageSize=50&q=hello&status=' + status).respond(result);
        $scope.getApplications();
        $httpBackend.flush();
        expect($scope.applications).to.have.length(10);
        expect($scope.totalApplicationCount).to.equal(20);
      }));

      it('should get the application list', function () {
        expect($scope.applications).to.have.length(10);
        expect($scope.totalApplicationCount).to.equal(20);
        expect($scope.facets.age.entries).to.have.length(4);
        expect($scope.facets.applyPosition.terms).to.have.length(4);
        expect($scope.facets.highestDegree.terms).to.have.length(4);
      });

      describe('setAge', function () {
        it('should set the query age parameter', function () {
          var spy = sinon.spy($scope, 'getApplications');
          $scope.setAge(20);

          expect($scope.states.searchOptions).to.have.property('age', 20);
          expect(spy.called).to.be.true;
        });

        it('should clear the query age parameter', function () {
          var spy = sinon.spy($scope, 'getApplications');
          $scope.setAge();
          expect($scope.states.searchOptions.age).to.not.exist;
          expect(spy.called).to.be.true;
        });
      });

      describe('setApplyPosition', function () {
        it('should set the query applyposition parameter', function () {
          var spy = sinon.spy($scope, 'getApplications');
          $scope.setApplyPosition('cio');
          expect($scope.states.searchOptions).to.have.property('applyPosition', 'cio');
          expect(spy.called).to.be.true;
        });

        it('should clear the query applyposition parameter', function () {
          var spy = sinon.spy($scope, 'getApplications');
          $scope.setApplyPosition();
          expect($scope.states.searchOptions.applyPosition).to.not.exist;
          expect(spy.called).to.be.true;
        });
      });

      describe('setHighestDegree', function () {
        it('should set the query highestDegree parameter', function () {
          var spy = sinon.spy($scope, 'getApplications');
          $scope.setHighestDegree('master');

          expect($scope.states.searchOptions).to.have.property('highestDegree', 'master');
          expect(spy.called).to.be.true;
        });

        it('should clear the query highestdegree parameter', function () {
          var spy = sinon.spy($scope, 'getApplications');
          $scope.setHighestDegree();
          expect($scope.states.searchOptions.highestDegree).to.not.exist;
          expect(spy.called).to.be.true;
        });
      });

      describe('showPagination', function () {
        it('should show pagination bar when totalCount bigger than pageSize', function () {
          $scope.states.pagingOptions.pageSize = 50;
          $scope.totalApplicationCount = 51;
          expect($scope.showPagination()).to.be.true;
        });

        it('should show pagination bar when totalCount smaller than or equal to pageSize', function () {
          $scope.states.pagingOptions.pageSize = 50;
          $scope.totalApplicationCount = 49;
          expect($scope.showPagination()).to.be.false;
        });
      });

      describe('archive', function () {
        var confirmStub;
        beforeEach(inject(function ($window) {
          $httpBackend.expectPUT('/api/applications/5355c145b5f85ce10e5aa596?status=archived').respond(200);
          confirmStub = sinon.stub($window, 'confirm');
          confirmStub.returns(true);
        }));

        afterEach(function () {
          confirmStub.restore();
        });

        it('should put /api/applicatioins/:id and delete from client', function () {
          $scope.archive('5355c145b5f85ce10e5aa596');
          $httpBackend.flush();
          $scope.applications.forEach(function (application) {
            expect(application._id).to.not.equal('5355c145b5f85ce10e5aa596');
          });
          expect($scope.applications).to.have.length(9);
        });
        it('should get back one application', function () {
          $httpBackend.expectGET('/api/applications?page=50&pageSize=1&status=' + status).respond({
            hits: {
              hits: [
                {
                  _id: '7788'
                }
              ]
            }
          });
          $scope.totalApplicationCount = 60;
          $scope.archive('5355c145b5f85ce10e5aa596');
          $httpBackend.flush();
          expect($scope.applications).to.have.length(10);
        });
      });

      describe('pursued', function () {
        var confirmStub;
        beforeEach(inject(function ($window) {
          $httpBackend.expectPUT('/api/applications/5355c145b5f85ce10e5aa596?status=pursued').respond(200);
          confirmStub = sinon.stub($window, 'confirm');
          confirmStub.returns(true);
        }));

        afterEach(function () {
          confirmStub.restore();
        });

        it('should put /api/applicatioins/:id and delete from client', function () {
          $scope.pursue('5355c145b5f85ce10e5aa596');
          $httpBackend.flush();
          $scope.applications.forEach(function (application) {
            expect(application._id).to.not.equal('5355c145b5f85ce10e5aa596');
          });
          expect($scope.applications).to.have.length(9);
        });
        it('should get back one application', function () {
          $httpBackend.expectGET('/api/applications?page=50&pageSize=1&status=' + status).respond({
            hits: {
              hits: [
                {
                  _id: '7788'
                }
              ]
            }
          });
          $scope.totalApplicationCount = 60;
          $scope.pursue('5355c145b5f85ce10e5aa596');
          $httpBackend.flush();
          expect($scope.applications).to.have.length(10);
        });
      });

      describe('undetermined', function () {
        var confirmStub;
        beforeEach(inject(function ($window) {
          $httpBackend.expectPUT('/api/applications/5355c145b5f85ce10e5aa596?status=undetermined').respond(200);
          confirmStub = sinon.stub($window, 'confirm');
          confirmStub.returns(true);
        }));

        afterEach(function () {
          confirmStub.restore();
        });

        it('should put /api/applications/:id and delete from client', function () {
          $scope.undetermine('5355c145b5f85ce10e5aa596');
          $httpBackend.flush();
          $scope.applications.forEach(function (application) {
            expect(application._id).to.not.equal('5355c145b5f85ce10e5aa596');
          });
          expect($scope.applications).to.have.length(9);
        });
        it('should get back one application', function () {
          $httpBackend.expectGET('/api/applications?page=50&pageSize=1&status=' + status).respond({
            hits: {
              hits: [
                {
                  _id: '7788'
                }
              ]
            }
          });
          $scope.totalApplicationCount = 60;
          $scope.undetermine('5355c145b5f85ce10e5aa596');
          $httpBackend.flush();
          expect($scope.applications).to.have.length(10);
          expect($scope.totalApplicationCount).to.equal(59);
        });
      });

      describe('view', function () {
        it('should go to the correct url', inject(function ($location) {
          var spy = sinon.spy($location, 'path');
          $scope.states.pagingOptions = {
            pageSize: 5,
            currentPage: 20
          };
          $scope.view(2);
          expect(spy).to.have.been.calledWith('/applications/' + status + '/98');
        }));
      });

      describe('newEvent', function () {
        it('should open the modal', function () {
          $scope.newEvent('7788');
          expect(modalOpenStub).to.be.called;
        });

        it('should remove the application from the applications list when modal close', function () {
          $scope.newEvent('5355c145b5f85ce10e5aa596');
          fakeModal.close({
            name: 'aabb',
            application: '5355c145b5f85ce10e5aa596'
          });
          angular.forEach($scope.applications,function(app){
            expect(app._id).to.not.equal('5355c145b5f85ce10e5aa596');
          });
        });
      });
    });
  });
});