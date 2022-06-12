const config = require('config');
const jwt = require('jsonwebtoken');

function customerAuthoriztion(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send("Unanthorized request");
    }
    const token = req.header.authorization.split(' ')[1];
    if(!token){
        res.status(401).json({msg: "No token, authorization denied"});
    }
    try{
        const verifiedToken = jwt.verify(token, config, config.get('jwtSecret1'));
        req.customer = verifiedToken;
        next();
    }catch(e){
        res.status(400).json({msg: "Token is not valid"});
    }
}

function sellerAuthoriztion(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send("Unanthorized request");
    }
    const token = req.header.authorization.split(' ')[1];
    if(!token){
        res.status(401).json({msg: "No token, authorization denied"});
    }
    try{
        const verifiedToken = jwt.verify(token, config, config.get('jwtSecret2'));
        req.seller = verifiedToken;
        next();
    }catch(e){
        res.status(400).json({msg: "Token is not valid"});
    }
}
module.exports = customerAuthoriztion, sellerAuthoriztion;