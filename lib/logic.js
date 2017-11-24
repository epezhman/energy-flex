/**
 * Power plant express current energy production
 * @param {org.acme.biznet.ReportProduction} reportProduction - the current production
 * @transaction
 */
function reportProduction(reportProduction) {

    reportProduction.energyProductOld.currentCap = reportProduction.energyProductNew.currentCap

    return getAssetRegistry('org.acme.biznet.EnergyProduction')
        .then(function (assetRegistry) {

            // emit a notification that a new Energy is reported
            var reportProductionNotification = getFactory().newEvent('org.acme.biznet', 'ReportProductionNotification');
            reportProductionNotification.energyProduction = reportProduction.energyProductNew;
            emit(reportProductionNotification);

            // persist the state of the commodity
            return assetRegistry.update(reportProduction.energyProductOld);
        });
}