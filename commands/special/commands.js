// commands.js

const playlistManager = require('./playlistManager');

function execute(message) {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  if (command === 'createplaylist') {
    playlistManager.createPlaylist(message, args);
  } else if (command === 'addtrack') {
    playlistManager.addTrack(message, args);
  } else if (command === 'playplaylist') {
    playlistManager.playPlaylist(message, args);
  }
}

module.exports = { execute };
