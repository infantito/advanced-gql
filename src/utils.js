import dfnsFormat from 'date-fns/format'

const formatDate = (stamp, format) => dfnsFormat(stamp, format)

export default { formatDate }
