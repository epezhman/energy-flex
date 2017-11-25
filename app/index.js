const request = require('request');
const uuidv1 = require('uuid/v1');

var d = new Date();


request.post(
    'http://localhost:3000/api/EnergyProduction',
    {
        json: {
            "$class": "org.acme.biznet.EnergyProduction",
            "energyProductionId": uuidv1().toString(),
            "currentCap": 400,
            "createdHourMinute": d.getHours().toString() + d.getMinutes().toString(),
            "areadId": 80377,
            "owner": "org.acme.biznet.Plant#1000"
        }
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {

            console.log(body)

            request.post(
                'http://localhost:3000/api/EnergyReported',
                {
                    json: {
                        "$class": "org.acme.biznet.EnergyReported",
                        "energyProduct": body['energyProductionId']
                    }
                },
                function (error2, response2, body2) {
                    console.log(body2)
                    if (!error2 && response2.statusCode == 200) {
                        console.log(body2)


                    }
                }
            );
        }
    }
);