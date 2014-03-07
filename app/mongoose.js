var mongoose = require('mongoose');

mongoose.Error.messages.general.default = "`{PATH}`验证失败，值为`{VALUE}`";
mongoose.Error.messages.general.required = "请输入`{PATH}`";

mongoose.Error.messages.Number.min = "`{PATH}`小于最小值({MIN}).";
mongoose.Error.messages.Number.max = "`{PATH}`大于最大值({MAX}).";

mongoose.Error.messages.String.enum = "`{VALUE}`不是一个可选项`{PATH}`.";
mongoose.Error.messages.String.match = "`{PATH}`输入无效.";

module.exports = mongoose;