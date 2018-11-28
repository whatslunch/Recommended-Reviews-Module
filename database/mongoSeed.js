const faker = require('faker');
const fs = require('fs');
const moment = require('moment');
const { sprintf } = require('sprintf-js');

const randomInt = max => Math.floor(Math.random() * max + 1);

const stream = fs.createWriteStream('./database/mongoReview.json');

let i = 0;

function write() {
  while (i < 10000000) {
    i += 1;
    let fakeDate = faker.date.past();
    fakeDate = JSON.stringify(fakeDate).slice(1, 11);
    const name = faker.company.companyName();
    const reviewNum = randomInt(9);
    const restaurantReviews = {};
    restaurantReviews.id = i;
    restaurantReviews.restaurant_name = name;
    restaurantReviews.reviews = [];

    for (let j = 0; j < reviewNum; j += 1) {
      const newReview = {};
      newReview.user_name = faker.name.findName();
      newReview.user_avatar = faker.image.avatar();
      newReview.location = `${faker.address.city()} ${faker.address.state()}`;
      newReview.date = moment(fakeDate).format('YYYY-MM-DD');
      newReview.score = `https://s3-us-west-1.amazonaws.com/pley-food/star_${randomInt(9)}.png`;
      newReview.food_image = `https://s3-us-west-2.amazonaws.com/yump-sf-images/${sprintf('%05s.jpg', randomInt(499))}`;
      restaurantReviews.reviews.push(newReview);
    }

    if (!stream.write(`${JSON.stringify(restaurantReviews)}\n`)) {
      return;
    }
    if (i % 1000) {
      console.log(`${(i / 10000000 * 100).toFixed(2)} %`);
      console.clear();
    }
  }
  stream.end();
}
stream.on('drain', () => {
  write();
});

write();
