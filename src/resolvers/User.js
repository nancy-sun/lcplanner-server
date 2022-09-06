const User = {
    id: ({ _id, id }) => _id || id, // id as _id in mongoDB
};

module.exports = User;