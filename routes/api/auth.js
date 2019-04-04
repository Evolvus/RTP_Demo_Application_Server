var authAttributtes=['emailId','userPassword'];
const _ = require("lodash");
const auth=require('../../service/auth');
const logName='auth:api';

module.exports=(router)=>{
    router.route('/auth')
    .post((req,res,next)=>{
        var resp={
            "status":200,
            "description":""            
        }               
        let body = _.pick(req.body, authAttributtes);
        var object = _.omitBy(body, function (value, key) {
          return value.startsWith("undefined") ||value.startsWith("null")|| value.length == 0;
        });
        try{           
            var emailId=object.emailId;
            var password=object.userPassword;                       
            auth.authenticate(emailId,password).then((response)=>{                
                res.send(response);
            }).catch((err)=>{
                resp.status="400";
                resp.description=err;
                res.status(400).send(err);
            })        
            }catch(err){
                resp.status="400";
                resp.description=err;
                res.status(400).send(err);                       
}   
    });
}