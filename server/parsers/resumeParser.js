'use strict';

var _ = require('lodash'),
    logger = require('../config/winston').logger();

var parsers = [
    require('./job51Parser'),
    require('./zhaopinParser'),
    require('./liepinParser'),
    require('./dongfangParser'),
    require('./hr61Parser'),
    require('./ganjiParser')
];

exports.parse = function (data) {
    var parser = _.find(parsers, function (parser) {
        return parser.test(data);
    });

    if (parser) {
        return parser.parse(data);
    }
    else {
        throw new Error('not suitable parser for email from ' + data.fromAddress);
    }
};

var d1 = {
    "name": "曹彦",
    "gender": "male",
    "birthday": "1975/04/02",
    "currentSalary": "15万人民币",
    "selfAssessment": "多年四,五星级酒店工作经验,并在国外接受过正规酒店管理教育,并有较强的综合管理能力. 有较广的销售渠道,由于工作关系,和个大旅行社以及上海市的多家著名外资企业有良好关系. 适应在压力下工作.",
    "mobile": "13801601821",
    "phone": "086-021-63611698",
    "email": "joshuacao@vip.163.com",
    "address": "浙江中路188弄10号702室",
    "residency": "上海市",
    "zipCode": "200001",
    "hukou": "上海",
    "careerObjective": {
        "industries": ["酒店/餐饮"],
        "locations": ["上海市"],
        "targetSalary": {},
        "typeOfEmployment": "fulltime"
    },
    "additionalInformation": "兴趣爱好 上网,看书\n特长 由于多年来的学习,培训,与工作,我对于宾馆业和餐饮业有较深理解和认识,并能将国际管理惯例融和到中国的实际情况.在管理方面也有相当的经历和能力.",
    "skills": [{"name": "其它", "level": "basic"}],
    "languageSkills": [],
    "workExperience": [{
        "dateRange": {"from": "2007/03"},
        "company": "上海虹桥美爵酒店",
        "jobTitle": "市场销售总监",
        "jobDescription": "上海虹桥美爵酒店是法国雅高集团旗下的一个五星级品牌酒店，担酒店开业销售总监，负责开业前期的所有市场销售计划，媒体策划，酒店定位，价格定位，价格体系的制定，以及销售团队的建立。",
        "department": "市场销售部",
        "industry": "酒店业",
        "from": "2007/03"
    }, {
        "dateRange": {"from": "2005/02", "to": "2007/02"},
        "company": "上海海湾大厦",
        "jobTitle": "市场销售总监",
        "jobDescription": "上海海湾大厦是一家由法国雅高酒店管理集团管理的准四星级酒店,作为市场销售总监,我主要负责市场分析,定位,推广,销售.",
        "department": "市场销售部",
        "industry": "酒店业",
        "from": "2005/02",
        "to": "2007/02"
    }, {
        "dateRange": {"from": "2001/02", "to": "2005/01"},
        "company": "海仑宾馆",
        "jobTitle": "高级客户关系经理",
        "jobDescription": "管理下属的客户关系经理和客户关系主任.",
        "department": "客户关系部",
        "industry": "酒店业",
        "from": "2001/02",
        "to": "2005/01"
    }, {
        "dateRange": {"from": "1999/01", "to": "1999/08"},
        "company": "阿马索丝大酒店",
        "jobTitle": "客户经理(亚洲市场)",
        "jobDescription": "主要负责对亚洲市场的开发,特别是日本和东南亚市场.",
        "department": "销售部",
        "industry": "酒店业",
        "from": "1999/01",
        "to": "1999/08"
    }, {
        "dateRange": {"from": "1996/01", "to": "1997/01"},
        "company": "豪都广场",
        "jobTitle": "餐饮经理",
        "jobDescription": "主要实施对下属中餐厅,酒吧,娱乐中心的管理",
        "department": "餐饮部",
        "industry": "酒店/餐饮",
        "from": "1996/01",
        "to": "1997/01"
    }, {
        "dateRange": {"from": "1994/02", "to": "1998/01"},
        "company": "华亭宾馆",
        "jobTitle": "出纳",
        "jobDescription": "在餐饮部属下各个餐厅任出纳,每星期换一个餐厅.",
        "department": "财务部",
        "industry": "酒店业",
        "from": "1994/02",
        "to": "1998/01"
    }],
    "projectExperience": [],
    "educationHistory": [{
        "dateRange": {"from": "1998/01", "to": "2001/07"},
        "school": "美国印的安纳波利斯大学",
        "major": "工商管理类",
        "degree": "bachelor",
        "from": "1998/01",
        "to": "2001/07"
    }, {
        "dateRange": {"from": "1995/09", "to": "1997/09"},
        "school": "华东师范大学",
        "major": "工商管理",
        "degree": "associate",
        "description": "涉外事务管理专业",
        "from": "1995/09",
        "to": "1997/09"
    }, {
        "dateRange": {"from": "1992/01", "to": "1993/01"},
        "school": "上海旅游职业学校",
        "major": "宾馆管理",
        "degree": "vocational",
        "from": "1992/01",
        "to": "1993/01"
    }],
    "trainingHistory": [{
        "dateRange": {"from": "2003/05", "to": "2003/05"},
        "institution": "雅高酒店集团",
        "course": "部门经理培训",
        "description": "培训目的在于提高部门经理的管理能力，提高自身素质和交流能力等等",
        "from": "2003/05",
        "to": "2003/05"
    }, {
        "dateRange": {"from": "2002/08", "to": "2002/08"},
        "institution": "雅高酒店集团",
        "course": "培训师培训",
        "description": "通过培训使自己成为一个培训师，从而在日常工作中为自己部门的员工作培训。",
        "from": "2002/08",
        "to": "2002/08"
    }],
    "inSchoolPractice": [],
    "company": "532fc0eab889c118246c6d59",
    "mail": "55c5b0d6720fec45e9e1c40d"
};

var d2 = {
    "name": "吴琳",
    "gender": "Female",
    "birthday": "1980/09/01",
    "civilState": null,
    "politicalStatus": null,
    "yearsOfExperience": 0,
    "currentSalary": null,
    "selfAssessment": "因为热爱西点，毅然放弃13年的工作经验，投入到西点学习中。已在专业西点技能培训学校学习制作西点6个月，并具有初级西点师职业资格证书。现已\n1.完成初级、中级西点师、蛋糕裱花、翻糖制作以及流行品种制作课程，能够独立完成面包、饼干和蛋糕的制作全过程，具备一定的西点制作基本功\n2.对成为西点师有热情，也有决心，能够吃苦耐劳\n3.个人性格开朗，好学，具有良好的团队精神",
    "mobile": "086-1818693511",
    "phone": null,
    "email": "lily_wulin8097@sina.com",
    "address": null,
    "residency": "上海市浦东新区",
    "zipCode": null,
    "hukou": "江苏",
    "applyCompany": null,
    "height": null,
    "weight": null,
    "careerObjective": {
        "currentStatus": "目前已离职",
        "entryTime": null,
        "industries": ["国际四星级酒店 国内四星级酒店 餐饮娱乐企业"],
        "locations": ["上海市"],
        "jobCategories": ["西式/韩日/东南亚厨师 食品卫生员 其它"],
        "targetSalary": {"from": 0, "to": 0},
        "typeOfEmployment": "Fulltime"
    },
    "additionalInformation": "",
    "certifications": [{
        "date": {
            "year": 2015,
            "month": "JANUARY",
            "chronology": {"id": "ISO", "calendarType": "iso8601"},
            "dayOfMonth": 1,
            "dayOfWeek": "THURSDAY",
            "era": "CE",
            "dayOfYear": 1,
            "leapYear": false,
            "monthValue": 1
        }, "subject": "初级西点师职业资格证书", "content": null
    }],
    "educations": [{
        "dateRange": {"from": "2002/07", "to": null},
        "school": "上海师范大学",
        "major": "商品检验",
        "degree": "Associate",
        "description": ""
    }],
    "inSchoolPractices": [],
    "inSchoolStudy": "",
    "skills": [],
    "projects": [],
    "trainings": [{
        "dateRange": {"from": "2014/01", "to": null},
        "institution": "上海凯达职业技能培训学校（原上海浦东国际培训中心）",
        "course": "西点师",
        "certification": "初级西点师职业资格证书",
        "description": "1.完成初级、中级和高级西点师培训课程\n2.完成蛋糕裱花和翻糖制作课程\n3.完成流行品种制作课程"
    }],
    "works": [{
        "dateRange": {"from": "2014/09", "to": null},
        "company": "SGS通用标准技术服务有限公司",
        "jobTitle": "检测工程师",
        "jobDescription": "负责样品的微生物检测",
        "department": "农产食品部",
        "industry": "其它",
        "boss": null,
        "employeeNumber": null,
        "achievement": "",
        "companyLocation": null,
        "companyIntroduction": "",
        "leaveReason": ""
    }, {
        "dateRange": {"from": "2013/04", "to": null},
        "company": "上海味之素食品研发中心有限公司",
        "jobTitle": "检验员",
        "jobDescription": "负责样品的微生物检验以及微生物室的日常管理",
        "department": "分析部",
        "industry": "其它",
        "boss": null,
        "employeeNumber": null,
        "achievement": "",
        "companyLocation": null,
        "companyIntroduction": "",
        "leaveReason": ""
    }],
    "languageCertificationEnglish": null,
    "languageCertificationJapanese": null,
    "languageSkills": [{
        "language": "英语",
        "level": "Limited",
        "readingAndWritingLevel": null,
        "listeningAndSpeakingLevel": null
    }, {"language": "日语", "level": "Limited", "readingAndWritingLevel": null, "listeningAndSpeakingLevel": null}],
    "company": "532fc0eab889c118246c6d59",
    "parseErrors": null
};

var d3 = {
    "name": "黄芳芳",
    "gender": null,
    "birthday": "1983/03/13",
    "civilState": null,
    "politicalStatus": null,
    "yearsOfExperience": null,
    "currentSalary": null,
    "selfAssessment": "",
    "mobile": "086-138-0169-0803",
    "phone": null,
    "email": "75066087@qq.com",
    "address": "上海市长宁区仙霞路415弄11号202室",
    "residency": null,
    "zipCode": "200336",
    "hukou": null,
    "applyCompany": null,
    "height": null,
    "weight": null,
    "careerObjective": {
        "currentStatus": null,
        "entryTime": null,
        "industries": [],
        "locations": [],
        "jobCategories": [],
        "targetSalary": null,
        "typeOfEmployment": null
    },
    "additionalInformation": " 英文口译和笔译熟练，为领导做过多次大型重要会议口译。\n 熟练运用Office的Word、Excel和PowerPoint。\n自我发展  通过了CFA level 1考试，现在是CFA Level2 candidate。\n 通过了证券行业从业资格证书的基础知识和证券投资分析两门的考试。",
    "certifications": [],
    "educations": [{
        "dateRange": null,
        "school": "上海对外经贸大学",
        "major": null,
        "degree": null,
        "description": ""
    }, {
        "dateRange": {"from": "2005/09", "to": "2008/06"},
        "school": "上海财经大学",
        "major": null,
        "degree": null,
        "description": "经济学学士（2000年9月-2004年6月）"
    }],
    "inSchoolPractices": [],
    "inSchoolStudy": "",
    "skills": [],
    "projects": [],
    "trainings": [],
    "works": [],
    "languageCertificationEnglish": null,
    "languageCertificationJapanese": null,
    "languageSkills": [],
    "company": "532fc0eab889c118246c6d59",
    "parseErrors": null
};

var d4 = {
    "name": "方倩倩",
    "gender": "Female",
    "birthday": "0026/08/01",
    "civilState": "Single",
    "politicalStatus": "PartyMember",
    "yearsOfExperience": 2,
    "currentSalary": null,
    "selfAssessment": "技术能力 掌握JAVA面向对象语言及开发技巧；\n熟悉Linux/Unix操作系统及其编程环境；\n熟悉Oracle数据库，且熟练使用sql、plsql语句；\n熟悉JDBC、Hibernate技术；\n熟悉HTML、CSS、jsp页面编写技术，以及xml文档\n熟悉javascript、Ajax、jQuery技术；\n掌握Servlet、structs2技术；\n了解MVC架构模式。\n本人有积极、自信、乐观的生活态度，熟悉软件行业的开发流程和团队工作模式，有四个月的JAVA培训经历，具备",
    "mobile": "15000598956",
    "phone": null,
    "email": "746151326@qq.com",
    "address": null,
    "residency": "现居住于上海",
    "zipCode": null,
    "hukou": "河南郑州",
    "applyCompany": null,
    "applyPosition": "Java软件工程师-上海",
    "height": null,
    "weight": null,
    "careerObjective": {
        "currentStatus": "我目前处于离职状态，可立即上岗",
        "entryTime": null,
        "industries": [],
        "locations": [],
        "jobCategories": ["软件工程师", "WEB前端开发", "用户界面（UI）设计"],
        "targetSalary": {"from": 4001, "to": 6000},
        "typeOfEmployment": null
    },
    "additionalInformation": "",
    "certifications": [],
    "educations": [{
        "dateRange": {"from": "2010/09", "to": "2012/06"},
        "school": "安阳工学院",
        "major": "电子信息科学与技术",
        "degree": "Bachelor",
        "description": ""
    }],
    "inSchoolPractices": [],
    "inSchoolStudy": "",
    "skills": [],
    "projects": [],
    "trainings": [],
    "works": [{
        "dateRange": {"from": "2012/09", "to": "2013/01"},
        "company": "郑州云飞扬信息技术股份有限公司",
        "jobTitle": "软件工程师",
        "jobDescription": "2001-4000元/月\n工作开发平台\nVS2010\n数据库 sqlserver\n1、用VC++编写加油站所用的读卡器的底层接口代码；\n2、用.net实现加油站制卡系统开发。",
        "department": "软件开发部",
        "industry": "计算机软件",
        "boss": null,
        "employeeNumber": null,
        "achievement": "",
        "companyLocation": null,
        "companyIntroduction": "",
        "leaveReason": ""
    }],
    "languageCertificationEnglish": null,
    "languageCertificationJapanese": null,
    "languageSkills": [{
        "language": "英语",
        "level": null,
        "readingAndWritingLevel": "Limited",
        "listeningAndSpeakingLevel": "Basic"
    }],
    "company": "532fc0eab889c118246c6d59",
    "channel": "智联招聘",
    "parseErrors": null
};


