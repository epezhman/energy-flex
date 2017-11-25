/**
 * Power plant express current energy production
 * @param {org.acme.biznet.EnergyReported} energyReported - the current production
 * @transaction
 */
function energyReported(energyReported) {
    return getAssetRegistry('org.acme.biznet.EnergyProduction')
        .then(function (assetRegistry) {
            return query('selectAllPlantsInArea', {
                createdHourMinute: energyReported.energyProduct.createdHourMinute,
                areadId: energyReported.energyProduct.areadId
            })
                .then(function (results) {

                    var currentProduction = 0;

                    for (var n = 0; n < results.length; n++) {
                        currentProduction += results[n].currentCap;
                    }
                    if (energyReported.requiredCapacitiy < currentProduction) {
                        var requiredReduction = getFactory().newEvent('org.acme.biznet', 'RequiredReduction');
                        requiredReduction.requiredEnergyReduction = currentProduction - energyReported.requiredCapacitiy;
                        requiredReduction.areadId = energyReported.energyProduct.areadId
                        emit(requiredReduction);
                    }
                });
        });
}


/**
 * Filter the productions
 * @param {org.acme.biznet.EnergyProductionProposalReported} energyProductionProposalReported - the current production
 * @transaction
 */
function energyProductionProposalReported(energyProductionProposalReported) {
    return getAssetRegistry('org.acme.biznet.EnergyReductionCompensation')
        .then(function (assetRegistry) {

            return query('selectAllPlantsInArea', {
                createdHourMinute: energyProductionProposalReported.compensationProposal.createdHourMinute,
                areadId: energyProductionProposalReported.compensationProposal.areadId
            })
                .then(function (results) {
                    var currentProduction = 0;
                    for (var n = 0; n < results.length; n++) {
                        currentProduction += results[n].currentCap;
                    }
                   
                    if (energyProductionProposalReported.requiredCapacitiy < currentProduction) {
                   
                        return query('selectAllProposalsInArea', {
                            createdHourMinute: energyProductionProposalReported.compensationProposal.createdHourMinute,
                            areadId: energyProductionProposalReported.compensationProposal.areadId
                        }).then(function (results2) {
                            var requirdReduction = currentProduction - energyProductionProposalReported.requiredCapacitiy;
                            for (var i = 0; i < results2.length; i++) {
                                requirdReduction -= results2[i].reductionAmount;
                                if (requirdReduction >= 0 && !results2[i].approvedByProvider) {
                                    var proposalApproved = getFactory().newEvent('org.acme.biznet', 'ProposalApproved');
                                    proposalApproved.proposalApproved = true;
                                    proposalApproved.powerPlant = results2[i].owner
                                    proposalApproved.proposalId = results2[i].compensationId
                                    emit(proposalApproved);
                                    results2[i].approvedByProvider = true;
                                    results2[i].paid = true;
                                    assetRegistry.update(results2[i])
                                }
                            }
                        });
                    }
                });
        });
}