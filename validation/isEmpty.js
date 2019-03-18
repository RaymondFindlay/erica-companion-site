const isEmpty = (v) => 
    v === undefined || 
    v === null ||
    (typeof v === 'object' && Object.keys(v).length === 0) ||
    (typeof v === 'string' && v.trim().length === 0);

module.exports = isEmpty;