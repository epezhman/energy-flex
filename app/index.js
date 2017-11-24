const request = require('request');
const uuidv1 = require('uuid/v1');

var d = new Date();

var temp = {
    "$class": "org.acme.biznet.EnergyProduction",
    "energyProductionId": uuidv1().toString(),
    "currentCap": 400,
    "createdHourMinute": d.getHours().toString() + d.getMinutes().toString(),
    "areadId": 80377,
    "owner": "org.acme.biznet.Plant#1000"
}

request.post(
    'http://localhost:3000/api/EnergyProduction',
    {
        json: temp
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)

            request({url:'http://localhost:3000/api/EnergyReported', qs:{
                "energyProduct": "org.acme.biznet.EnergyProduction#" + body['energyProductionId']
            }}, function (error2, response2, body2) {
                console.log(response2.statusCode)
                console.log(body2)
            });

        
        }
    }
);