const _ = require('lodash');
const session = require('../../service/session');
const sessionAttributes = ['authorization'];


module.exports = (router) => {
    router.route('/session')
        .get((req, res, next) => {
            var response = {
                "status": "200",
                "description": ""
            }
            let body = _.pick(req.body, sessionAttributes);
            var object = _.omitBy(body, function (value, key) {
                return value.startsWith("undefined") || value.startsWith("null") || value.length == 0;
            });
            try {
                if (_.isEqual((_.keys(_.pick(req.headers, sessionAttributes))).sort(), sessionAttributes.sort())) {
                    console.log(req.headers.authorization, "author");
                    session.verify(req.headers.authorization).then((mResponse) => {
                        res.status(200).send({
                            status: '200',
                            description: mResponse.description,
                            token: mResponse.token
                        });
                    }).catch((error) => {
                        res.status(401).send({
                            status: '401',
                            description: error.description
                        });
                    });
                } else {
                    res.status(400).send({
                        status: "400",
                        description: "Bad Request - Required Field Missing"
                    });
                }
            } catch (error) {
                res.status(400).send({
                    status: "400",
                    description: "Something went wrong"
                });
                console.log(error, "error from api");
            }
        });
}