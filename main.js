const { DisTube } = require('distube')
const Discord = require('discord.js')
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES
  ]
})
const fs = require('fs')
const config = require('./config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.config = require('./config.json')
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ],
  youtubeDL: false
})
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.emotes = config.emoji

fs.readdir('./commands/', (err, files) => {
  if (err) return console.log('Could not find any commands!')
  const jsFiles = files.filter(f => f.split('.').pop() === 'js')
  if (jsFiles.length <= 0) return console.log('Could not find any commands!')
  jsFiles.forEach(file => {
    const cmd = require(`./commands/${file}`)
    console.log(`Loaded ${file}`)
    client.commands.set(cmd.name, cmd)
    if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
  })
})

client.on('ready', () => {
  console.log(`${client.user.tag} is ready to play music.`)
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  const prefix = config.prefix
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  }
  try {
    cmd.run(client, message, args)
  } catch (e) {
    console.error(e)
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
  }
})

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${status(queue)}`)
  )
  
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))

  client.login(config.token)


//   const msg = await queue.textChannel.send(
//     `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)
//     let storeId = []
//     storeId.push(msg.id)
//     console.log(storeId)
     
//      if(storeId.length > 5) {
//       myinterval = setInterval(() => { 
//           msg.delete()
//           clearInterval(myinterval)
//           console.log('Deleted')
//         }, 10)
//     }else{
//       queue.textChannel.send(
//         `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)
//     } 
// }

// //import client token
// const TOKEN = 'OTU3MDY5MDI2OTM1MzI4ODQ4.Yj5Z_Q.TnVSb49x7agvTWsetXeW-K08ac0';


// //importing discord.js
// const Discord = require('discord.js');
// const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS']});
// const { joinVoiceChannel } = require('@discordjs/voice');
// const voice = require('@discordjs/voice');
// const fs = require('fs');
// const {DisTube} = require('distube');
// const { SpotifyPlugin } = require('@distube/spotify');



// client.distube = new DisTube(client, {
//     emitNewSongOnly: true,
//     leaveOnFinish : true,
//     emitAddSongWhenCreatingQueue: false,
//     plugins: [
//         new SpotifyPlugin()
//     ]
// });



// module.exports = client;




// client.commands = new Discord.Collection();
// client.events = new Discord.Collection();

// ['command_handler', 'event_handler'].forEach(handler => {
//     require(`./handlers/${handler}`)(client, Discord)
// });








// // if (command === 'ban') {
// //     client.commands.get('ban').execute(message, args);
    
// // }


// // if (command === 'purge') {
    
// //         client.commands.get('purge').execute(message, args);
// // }  

// // if (command === 'play') {
// //     client.commands.get('play').execute(message, args);
// // }


// client.login(TOKEN);
