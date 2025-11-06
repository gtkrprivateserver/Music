const { Client, GatewayIntentBits, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');
const express = require('express');
const axios = require('axios');

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildVoiceStates,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
});

const player = new Player(client);

// --- Keep-alive server ---
const app = express();
app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(3000, () => console.log("Express server running"));

// --- Slash command ---
const commands = [
new SlashCommandBuilder()
.setName('play')
.setDescription('Play a song')
.addStringOption(option => option.setName('query').setDescription('Song name or link').setRequired(true))
].map(cmd => cmd.toJSON());

const { REST } = require('discord.js');
const { Routes } = require('discord-api-types/v10');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
try {
console.log('Deploying commands...');
await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
console.log('Commands deployed!');
} catch (err) { console.error(err); }
})();

// --- Music queue embed ---
const queueEmbeds = new Map();
async function generateQueueEmbed(queue) {
const track = queue.current;
const list = queue.tracks.slice(0, 10).map((t,i)=>"${i+1}. ${t.title}").join('\n') || 'Queue empty';
return new EmbedBuilder()
.setTitle('🎶 Music Queue')
.setColor('Blue')
.addFields(
{ name: 'Now Playing', value: track?.title || 'Nothing' },
{ name: 'Up Next', value: list }
);
}

// --- Control buttons ---
function generateControlRow() {
return new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId('pause').setLabel('⏯️ Pause/Resume').setStyle(ButtonStyle.Primary),
new ButtonBuilder().setCustomId('skip').setLabel('⏭️ Skip').setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId('stop').setLabel('⏹️ Stop').setStyle(ButtonStyle.Danger)
);
}

// --- Track start ---
player.on('trackStart', async (queue, track) => {
const embed = await generateQueueEmbed(queue);
const row = generateControlRow();
const msg = await queue.metadata.send({ embeds: [embed], components: [row] });
queueEmbeds.set(queue.guild.id, { msg });
});

// --- Handle disconnects safely ---
player.on('clientDisconnect', queue => queue.destroy());
client.on('voiceStateUpdate', (oldState, newState) => {
if(oldState.channelId && !newState.channelId && client.user.id === oldState.member.user.id){
console.log('Bot got kicked from voice channel.');
}
});

// --- Slash command play ---
client.on('interactionCreate', async interaction => {
if(!interaction.isCommand()) return;
if(interaction.commandName !== 'play') return;

const voiceChannel = interaction.member.voice.channel;
if(!voiceChannel) return interaction.reply('You must be in a voice channel!');

const queue = player.createQueue(interaction.guild, { metadata: interaction.channel });
try { if(!queue.connection) await queue.connect(voiceChannel); } 
catch { queue.destroy(); return interaction.reply('Cannot join your voice channel!'); }

const query = interaction.options.getString('query');
const track = await player.search(query, { requestedBy: interaction.user }).then(x => x.tracks[0]);
if(!track) return interaction.reply('Song not found!');
queue.play(track);

interaction.reply(`🎵 Added: **${track.title}**`);

});

// --- Button interaction ---
client.on('interactionCreate', async interaction => {
if(!interaction.isButton()) return;
const queue = player.getQueue(interaction.guildId);
if(!queue) return interaction.reply({ content: 'No active queue!', ephemeral: true });

switch(interaction.customId){
    case 'pause': queue.setPaused(!queue.connection.paused); break;
    case 'skip': queue.skip(); break;
    case 'stop': queue.destroy(); break;
}

const msg = queueEmbeds.get(interaction.guild.id)?.msg;
if(msg) msg.edit({ embeds: [await generateQueueEmbed(queue)], components: [generateControlRow()] });
interaction.reply({ content: '✅ Action executed!', ephemeral: true });

});

// --- Error handling ---
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.login(process.env.TOKEN);
