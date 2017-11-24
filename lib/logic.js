/**
 * Power plant express current energy production
 * @param {org.acme.biznet.EnergyReported} energyReported - the current production
 * @transaction
 */
function energyReported(energyReported) {

    var requiredCapacitiy = 200;

    return getAssetRegistry('org.acme.biznet.EnergyProduction')
        .then(function (assetRegistry) {
            return query('selectAllPlantsInArea')
                .then(function (results) {

                    var currentProduction = 0;                    

                    for (var n = 0; n < results.length; n++) {
                        currentProduction += results[n].currentCap;
                    }
                    if (requiredCapacitiy < currentProduction) {
                        var requiredReduction = getFactory().newEvent('org.acme.biznet', 'RequiredReduction');
                        requiredReduction.requiredEnergyReduction = currentProduction - requiredCapacitiy;
                        emit(requiredReduction);
                    }
                });
        });
}