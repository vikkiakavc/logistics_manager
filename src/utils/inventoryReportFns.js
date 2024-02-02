const calculateTotalValue = (inventoryItems) => {
  if (!inventoryItems || inventoryItems.length === 0) {
    return 0;
  }

  // Calculate total value by summing up quantity * price for each item
  const totalValue = inventoryItems.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);

  return totalValue;
};

const calculateAverageCost = (inventoryItems) => {
  if (!inventoryItems || inventoryItems.length === 0) {
    return 0; // Return 0 if there are no inventory items
  }

  // Calculate total cost and total quantity
  const { totalCost, totalQuantity } = inventoryItems.reduce(
    (acc, item) => {
      return {
        totalCost: acc.totalCost + item.quantity * item.price,
        totalQuantity: acc.totalQuantity + item.quantity,
      };
    },
    { totalCost: 0, totalQuantity: 0 }
  );

  // Calculate average cost
  const averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;

  return averageCost;
};

const categorizeItems = (inventoryItems) => {
  if (!inventoryItems || inventoryItems.length === 0) {
    return { lowStockItems: 0, outOfStockItems: 0 }; // Return 0 for both categories if there are no inventory items
  }

  const lowStockThreshold = 10;
  const outOfStockThreshold = 0; // Items with quantity 0 are considered 'Out of Stock'

  // Categorize items and count them
  const categorizedItems = inventoryItems.reduce(
    (result, item) => {
      if (item.quantity <= outOfStockThreshold) {
        result.outOfStockItems += 1;
      } else if (item.quantity <= lowStockThreshold) {
        result.lowStockItems += 1;
      }
      return result;
    },
    { lowStockItems: 0, outOfStockItems: 0 }
  );

  return categorizedItems;
};

const calculateTurnoverRates = (inventoryItems) => {
  if (!inventoryItems || inventoryItems.length === 0) {
    return []; // Return an empty array if there are no inventory items
  }

  // Calculate turnover rates for each item
  const turnoverRates = inventoryItems.map((item) => {
    const turnoverRate = item.quantity !== 0 ? item.quantity / item.price : 0;
    return { itemName: item.name, rate: turnoverRate };
  });

  // Sort the turnoverRates array by rate in descending order
  turnoverRates.sort((a, b) => b.rate - a.rate);

  // Highlight items with the highest and lowest rates
  const highlightedTurnoverRates = turnoverRates.map((item) => {
    return {
      itemName: item.itemName,
      rate: item.rate,
      isHighest: item === turnoverRates[0],
      isLowest: item === turnoverRates[turnoverRates.length - 1],
    };
  });

  return highlightedTurnoverRates;
};

module.exports = {
  calculateTotalValue,
  calculateAverageCost,
  categorizeItems,
  calculateTurnoverRates,
};
