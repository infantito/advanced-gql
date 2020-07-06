const dfnsFormat = require('date-fns/format')

exports.formatDate = (stamp, format) => dfnsFormat(stamp, format)
