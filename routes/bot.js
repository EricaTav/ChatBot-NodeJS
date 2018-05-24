var express = require('express');
var router = express.Router();

/* POST bot listing. */
router.post('/', function(req, res, next) {
    if(req.body !== undefined && req.body.usermsg !== undefined) {
        let usermsg = req.body.usermsg;
        req.logger.info(usermsg);

        //search by keywords
        let computing = ["laptop", "desktop", "keyboard", "mouse", "computing"];
        let drones = ["drone"];
        let gaming = ["gaming", "games", "play", "consoles", "psx", "xbox"];
        let phones = ["mobile", "phone", "tablet"];
        let smartHome = ["house", "smarthouse", "smart-house"];
        let wearables = ["watch", "wearables", "acessories"];

        let answer;

        for (let i=0;i<computing.length; i++) {
            if(usermsg.toLowerCase().includes(computing[i])) {
                answer = JSON.stringify(returnByCategory("computing"));
                req.logger.info(answer);
                res.send(answer);
                return;
            }
        }
        for (let i=0;i<drones.length; i++) {
            if(usermsg.toLowerCase().includes(drones[i])) {
                answer = JSON.stringify(returnByCategory("drones"));
                req.logger.info(answer);
                res.send(answer);
                return;
            }
        }
        for (let i=0;i<gaming.length; i++) {
            if(usermsg.toLowerCase().includes(gaming[i])) {
                answer = JSON.stringify(returnByCategory("gaming & vr"));
                req.logger.info(answer);
                res.send(answer);
                return;
            }
        }
        for (let i=0;i<phones.length; i++) {
            if(usermsg.toLowerCase().includes(phones[i])) {
                answer = JSON.stringify(returnByCategory("phones & tablets"));
                req.logger.info(answer);
                res.send(answer);
                return;
            }
        }
        for (let i=0;i<smartHome.length; i++) {
            if(usermsg.toLowerCase().includes(smartHome[i])) {
                answer = JSON.stringify(returnByCategory("smart home"));
                req.logger.info(answer);
                res.send(answer);
                return;
            }
        }
        for (let i=0;i<wearables.length; i++) {
            if(usermsg.toLowerCase().includes(wearables[i])) {
                answer = JSON.stringify(returnByCategory("wearables"));
                req.logger.info(answer);
                res.send(answer);
                return;
            }
        }

        let result= [];

        let splittedUserMsg = usermsg.trim().split(/\s+/);
        splittedUserMsg.shift();
        let term = Array.prototype.join.call(splittedUserMsg, " ");

        if(usermsg.toLowerCase().search("categ") > -1) {
            Object.keys(req.products['ProductID']).forEach(function(element) {
                if(req.products['ProductID'][element]['Category'].toLowerCase() === term.toLowerCase()){
                    result.push(req.products['ProductID'][element]);
                }
            });
            answer = JSON.stringify(result);
            req.logger.info(answer);
            res.send(answer);
        }else if(usermsg.toLowerCase().search("brand") > -1) {
            Object.keys(req.products['ProductID']).forEach(function(element) {
                if(req.products['ProductID'][element]['Brand'].toLowerCase() === term.toLowerCase()){
                    result.push(req.products['ProductID'][element]);
                }
            });
            answer = JSON.stringify(result);
            req.logger.info(answer);
            res.send(answer);
        }else{
            Object.keys(req.products['ProductID']).forEach(function(element) {
                if(req.products['ProductID'][element]['ProductName'].toLowerCase() === usermsg.toLowerCase()){
                    result.push(req.products['ProductID'][element]);
                }
            });
            answer = JSON.stringify(result);
            req.logger.info(answer);
            res.send(answer);
        }

        function returnByCategory(category) {
            let result= [];

            Object.keys(req.products['ProductID']).forEach(function(element) {
                if(req.products['ProductID'][element]['Category'].toLowerCase() === category){
                    result.push(req.products['ProductID'][element]);
                }
            });
            return result;
        }
    }
});

module.exports = router;
