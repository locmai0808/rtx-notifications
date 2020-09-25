const fetch = require('node-fetch');
const notifier = require('node-notifier');
const open = require('open');
const chalk = require('chalk');
var player = require('play-sound')((opts = {}));

const PROPS = {
  5438481600: 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090/',
  5438481700: 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080/',
};

const interval = setInterval(function () {
  fetch('https://api-prod.nvidia.com/direct-sales-shop/DR/products/en_us/USD/5438481600,5438481700')
    .then((res) => res.json())
    .then((res) => {
      try {
        const products = res.products.product;
        products.forEach((product) => {
          if (product.inventoryStatus.status === 'PRODUCT_INVENTORY_IN_STOCK') {
            notifier.notify({
              title: product.displayName,
              message: 'IN STOCK',
              icon: './rtx3000.png',
              sound: true, // Only Notification Center or Windows Toasters
              wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
            });
            console.log(chalk.green(`${product.displayName} - IN STOCK`));
            console.log(chalk.green(`Opening link: ${PROPS[product.id]}`));
            open(PROPS[product.id]);
            playSound();
          } else {
            console.log(chalk.red(`${product.displayName} - OUT OF STOCK`));
          }
        });
      } catch (err) {
        console.log(err);
        console.log(chalk.red('API seems dead'));
        clearInterval(interval);
      }
    });
}, 5000);

const playSound = () => {
  if (player.player === null) {
    console.log(chalk.red("✖ couldn't find sound player"));
  } else {
    const playerName = player.player;
    console.log(chalk.green(`✔ sound player found: ${playerName}`));
    player.play('./notification.mp3', (error) => {
      if (error) {
        console.log(chalk.red("✖ couldn't play sound", error));
      }
    });
  }
};
