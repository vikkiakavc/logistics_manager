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

const getDeliveryAnalysis = (shipments, decimalPlaces = 2) => {
  const totalShipments = shipments.length;
  const totalDelayedShipments = shipments.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;

  const averageDeliveryTimeInDays = calculateAverageDeliveryTime(shipments);

  const delayedPercentage = (totalDelayedShipments / totalShipments) * 100;

  return {
    averageDeliveryTimeInDays: Math.round(averageDeliveryTimeInDays),
    delayedPercentage: delayedPercentage,
  };
};

const calculateAverageDeliveryTime = (shipments) => {
  const totalDeliveryTimeInMilliseconds = shipments.reduce((sum, shipment) => {
    const deliveryTime = shipment.expectedDelivery - shipment.shipmentDate;
    return sum + deliveryTime;
  }, 0);

  const averageDeliveryTimeInMilliseconds =
    totalDeliveryTimeInMilliseconds / shipments.length;

  // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
  const averageDeliveryTimeInDays =
    averageDeliveryTimeInMilliseconds / (24 * 60 * 60 * 1000);

  return averageDeliveryTimeInDays;
};

const calculateGeographicalDistribution = (shipments) => {
  const distributionByRegion = shipments.reduce((result, shipment) => {
    const region = shipment.destination || "Unknown Region";
    result[region] = (result[region] || 0) + 1;
    return result;
  }, {});

  console.log(distributionByRegion);

  const geographicalDistribution = Object.entries(distributionByRegion).map(
    ([region, shipmentsCount]) => ({
      region: region,
      shipmentsCount: shipmentsCount,
    })
  );

  return geographicalDistribution;
};

module.exports = {
  getStatusAnalysis,
  getDeliveryAnalysis,
  calculateGeographicalDistribution,
};
