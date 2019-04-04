const mongoose = require("mongoose");
const modelSchema = require('./userSchema');
var userModel = mongoose.model('User', modelSchema);

module.exports.save = (object) => {
    return new Promise((resolve, reject) => {
        console.log("inside user");

        model = new userModel(object);
        model.save().then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });

    });
}

module.exports.get = (filter) => {
    return new Promise((resolve, reject) => {
        userModel.find(filter).then((response) => {
            console.log(response, "response");
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
}

module.exports.update = (id, updateObject) => {
    return new Promise((resolve, reject) => {
        userModel.update(id, updateObject).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};