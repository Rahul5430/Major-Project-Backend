const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
	lean: true,
	limit: 10,
};

module.exports = {
	paginate: mongoosePaginate,
};
