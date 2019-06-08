/* Gets the price of started hour multiplied by the price of given unicorn */
function calculatePrice(currentDate, newDate, price) {
  console.log(
    Math.ceil(Math.abs(currentDate - newDate) / 36e5) * price,
    'total cost this time around'
  );
  return Math.ceil(Math.abs(currentDate - newDate) / 36e5) * price;
}

module.exports = {
  calculatePrice
};
