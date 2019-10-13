'use strict';

const http = require('http');
var musicplayer;
// If you need to pause the music or want to play it, the program wont overite your choice until you next die/spawn.
var played = false;

let init = setInterval(()=>{
  if (document.getElementsByTagName('video').length >= 1){
    clearInterval(init);
    musicplayer = document.getElementsByTagName('video')[0];
  }
},100);

setInterval(()=>{
  const adSkipButton = (document.getElementsByClassName('ytp-ad-skip-button') || [false])[0];
  if (adSkipButton) adSkipButton.click();
}, 100);

http.createServer((req, res) => {
  if (req.method !== 'POST') return res.end();

  res.writeHead(200, { 'Content-Type': 'text/html' });

  let body = '';
  req.on('data', (data) => {
    body += data;
  });

  req.on('end', () => {
    statusUpdate(JSON.parse(body));
    res.end();
  });
}).listen(1337);

function statusUpdate (data) {
  // Discard unwanted messenges
  if (!musicplayer || !data.previously || !data.player) return;

  /*
    Music should play when
    - in menu
    - dead
  */

  if (
    (data.player && data.player.activity === 'menu') || // menu
    (data.player.state.health === 0 || data.player.steamid !== data.provider.steamid) // dead
  ) {
    if (!played && musicplayer.paused){
      played = true;
      setTimeout(()=>{
        musicplayer.play();
      }, 2500);
    }
  } else {
    if (played && !musicplayer.paused){
      played = false;
      setTimeout(()=>{
        musicplayer.pause();
      }, 500);
    }
  }
}

window.addEventListener('keypress', ({ key }) => {
  if (key == '+' || key == '=')
    musicplayer.volume = Math.min(1, +musicplayer.volume.toFixed(2) + 0.05);
  else if (key == '-')
    musicplayer.volume = Math.max(0, +musicplayer.volume.toFixed(2) - 0.05);
});
