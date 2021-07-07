require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const https = require('https');
const emojiKey = '4919fc266719a408d81a8d7ec103ab8f12db28f3';

const fs = require('fs');

let rawdata = fs.readFileSync('full-emoji-list.json');
let emojiList = JSON.parse(rawdata);


bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  let tokens = msg.content.split(' ');

  let reactions = 0;
  let maxReactions = 20;
  let maxPerToken = 1;

  tokens.forEach((token) => {
    token = token.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    token = token.toLowerCase();
    console.log(token);

    let num = maxPerToken;

    let possibleForThisToken = [];

    Object.keys(emojiList).forEach(function(key) {
      let list = emojiList[key];
    
      list.forEach(function(emoji) {
        emoji.keywords.forEach(function(word) {
          if(word == token || word == token.substring(0, token.length - 1)) {
            if(reactions < maxReactions) {
              possibleForThisToken.push(emoji.emoji);
              reactions++;
            }
          }
        });
      });
    });

    while(num > 0 && possibleForThisToken.length > 0) {
      num --;

      var random = getRandomInt(0, possibleForThisToken.length - 1);
      msg.react(possibleForThisToken[random]);
      possibleForThisToken.splice(random, 1);
    }
  });

  /*https.get('https://emoji-api.com/emojis?search=' + keyword + '&access_key=' + emojiKey, (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(JSON.parse(data)[0].character);
      if(JSON.parse(data)[0].character) {
        msg.react(JSON.parse(data)[0].character);
      }
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });*/
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
