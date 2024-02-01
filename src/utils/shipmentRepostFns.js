const getStatusAnalysis = (shipments) => {
  const inTransitCount = shipments.filter(
    (shipment) => shipment.status === "In Transit"
  ).length;
  const delayedCount = shipments.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;
  const deliveredCount = shipments.filter(
    (shipment) => shipment.status === "Delivered"
  ).length;

  return {
    inTransit: inTransitCount,
    delayed: delayedCount,
    delivered: deliveredCount,
  };
};

const getDeliveryAnalysis = (shipments) => {
  const totalShipments = shipments.length;
  const totalDelayedShipments = shipments.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;

  const averageDeliveryTime = calculateAverageDeliveryTime(shipments);
  const delayedPercentage = (totalDelayedShipments / totalShipments) * 100;

  return {
    averageDeliveryTime: averageDeliveryTime,
    delayedPercentage: delayedPercentage,
  };
};

const calculateAverageDeliveryTime = (shipments) => {
  const totalDeliveryTime = shipments.reduce((sum, shipment) => {
    const deliveryTime = shipment.expectedDelivery - shipment.shipmentDate;
    return sum + deliveryTime;
  }, 0);

  return totalDeliveryTime / shipments.length;
};

// const calculateGeographicalDistribution = (shipments) => {
//   const distributionByRegion = shipments.reduce((result, shipment) => {
//     const region = shipment.destination || "Unknown Region";
//     result[region] = (result[region] || 0) + 1;
//     return result;
//   }, {});

//   const geographicalDistribution = Object.entries(distributionByRegion).map(
//     ([region, shipmentsCount]) => ({
//       region: region,
//       shipmentsCount: shipmentsCount,
//     })
//   );

//   return geographicalDistribution;
// };

module.exports = {
  getStatusAnalysis,
  getDeliveryAnalysis,
};
