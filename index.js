if (typeof globalThis.ReadableStream === 'undefined') {
    const { ReadableStream } = require('stream/web');
    globalThis.ReadableStream = ReadableStream;
  }
  
  const { Client, GatewayIntentBits, EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST } = require('discord.js');
  const GIFEncoder = require('gifencoder');
  const { createCanvas } = require('canvas');
  const { Readable } = require('stream');
  const { Routes } = require('discord-api-types/v9');
  const QRCode = require('qrcode');
  const express = require('express');
  const footerText = 'Made By Jagath🩵';
  const https = require('https');
  
  function pingServer() {
    https.get('https://morse-5lqf.onrender.com', (resp) => {
      console.log('Ping successful');
    }).on('error', (err) => {
      console.log('Ping failed: ' + err.message);
    });
  }
  
  // Ping every 14 minutes
  setInterval(pingServer, 14 * 60 * 1000);
  
  const client = new Client({
      intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
      ],
  });
  
  const commands = [
      {
          name: 'ping',
          description: 'Show bot latency'
      },
      {
          name: 'help',
          description: 'Show all available commands'
      },
      {
          name: 'qr',
          description: 'Generate a QR code',
          options: [
              {
                  name: 'type',
                  type: ApplicationCommandOptionType.String,
                  description: 'Type of content (upi, paypal, or other)',
                  required: true,
                  choices: [
                      { name: 'UPI', value: 'upi' },
                      { name: 'PayPal', value: 'paypal' },
                      { name: 'Other', value: 'other' }
                  ]
              },
              {
                  name: 'content',
                  type: ApplicationCommandOptionType.String,
                  description: 'The content to encode in the QR code',
                  required: true
              }
          ]
      },
      {
          name: 'morse',
          description: 'Convert text to Morse code',
          options: [
              {
                  name: 'text',
                  type: ApplicationCommandOptionType.String,
                  description: 'The text to convert to Morse code',
                  required: true
              }
          ]
      },
      {
          name: 'demorse',
          description: 'Convert Morse code to text',
          options: [
              {
                  name: 'morse',
                  type: ApplicationCommandOptionType.String,
                  description: 'The Morse code to convert to text',
                  required: true
              }
          ]
      },
      {
          name: 'learn',
          description: 'Show Morse code for alphabets, numbers, and symbols'
      },
      {
          name: 'coin-flip',
          description: 'Flip a coin'
      },
      {
          name: 'roll',
          description: 'Roll a die',
          options: [
              {
                  name: 'sides',
                  type: ApplicationCommandOptionType.Integer,
                  description: 'Number of sides on the die',
                  required: true
              }
          ]
      }
  ];   
  
  client.on('ready', async () => {
      console.log(`Logged in as ${client.user.tag}!`);
  
      try {
          const rest = new REST({ version: '9' }).setToken(client.token);
          await rest.put(
              Routes.applicationCommands(client.user.id),
              { body: commands },
          );
      } catch (error) {
          console.error('Error registering slash commands:', error);
      }
  });
  
  async function handlePing(interaction) {
      try {
          await interaction.deferReply();
          const sent = await interaction.fetchReply();
  
          const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
          const wsLatency = client.ws.ping;
  
          const embed = new EmbedBuilder()
              .setTitle('Ping Information')
              .addFields(
                  { name: 'Roundtrip Latency', value: `${roundtripLatency}ms`, inline: true },
                  { name: 'WebSocket Latency', value: `${wsLatency}ms`, inline: true }
              )
              .setColor('Green')
              .setFooter({ text: footerText });
  
          await interaction.editReply({ content: null, embeds: [embed] });
      } catch (error) {
          console.error('Error in handlePing:', error);
          await interaction.followUp({ content: "An error occurred while processing your request.", ephemeral: true });
      }
  }
  
  async function handleQR(interaction, type, content) {
      const qrAttachment = await generateQRCode(type, content);
      if (qrAttachment) {
          const embed = new EmbedBuilder()
              .setTitle(`Generated QR Code (${type.toUpperCase()})`)
              .setDescription(`Content: ${content}`)
              .setImage('attachment://qrcode.png')
              .setColor('Blue')
              .setFooter({ text: footerText });
  
          await interaction.reply({ embeds: [embed], files: [qrAttachment] });
      } else {
          await interaction.reply('Sorry, there was an error generating the QR code. Please try again.');
      }
  }
  
  async function generateQRCode(type, content) {
      let qrContent;
      switch (type.toLowerCase()) {
          case 'upi':
              qrContent = `upi://pay?pa=${encodeURIComponent(content)}`;
              break;
          case 'paypal':
              qrContent = `https://www.paypal.com/paypalme/${encodeURIComponent(content)}`;
              break;
          default:
              qrContent = content;
      }
  
      try {
          const buffer = await QRCode.toBuffer(qrContent);
          return new AttachmentBuilder(buffer, { name: 'qrcode.png' });
      } catch (error) {
          console.error('Error generating QR code:', error);
          return null;
      }
  }
  
  client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()) return;
  
      const command = interaction.commandName;
  
      if (command === 'ping') {
          await handlePing(interaction);
      } else if (command === 'help') {
          const embed = new EmbedBuilder()
              .setTitle('Available Commands')
              .addFields(
                  { name: '/ping', value: 'Show bot latency', inline: true },
                  { name: '/help', value: 'Show all available commands', inline: true },
                  { name: '/qr [type] [content]', value: 'Generate a QR code (UPI, PayPal, or other)', inline: false },
                  { name: '/morse [text]', value: 'Convert text to Morse code', inline: false },
                  { name: '/demorse [morse]', value: 'Convert Morse code to text', inline: false },
                  { name: '/learn', value: 'Show Morse code for alphabets, numbers, and symbols', inline: false },
                  { name: '/coin-flip', value: 'Flip a coin', inline: false },
                  { name: '/roll [sides]', value: 'Roll a die', inline: false }
              )
              .setColor('Green')
              .setFooter({ text: footerText });
          await interaction.reply({ embeds: [embed] });
      } else if (command === 'qr') {
          const type = interaction.options.getString('type');
          const content = interaction.options.getString('content');
          await handleQR(interaction, type, content);
      } else if (command === 'morse') {
          const text = interaction.options.getString('text');
          await handleMorse(interaction, text);
      } else if (command === 'demorse') {
          const morse = interaction.options.getString('morse');
          await handleDemorse(interaction, morse);
      } else if (command === 'learn') {
          await handleLearn(interaction);
      } else if (command === 'coin-flip') {
          await handleCoinFlip(interaction);
      } else if (command === 'roll') {
          await handleRoll(interaction);
      }
  });
  
  async function handleCoinFlip(interaction) {
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      await interaction.reply(`The coin landed on: **${result}**`);
  }
  
  async function handleRoll(interaction) {
      const sides = interaction.options.getInteger('sides');
      if (sides < 2) {
          await interaction.reply('A die must have at least 2 sides.');
          return;
      }
      const result = Math.floor(Math.random() * sides) + 1;
      await interaction.reply(`You rolled a **${result}** on a ${sides}-sided die.`);
  }
  
  async function handleMorse(interaction, text) {
      const morseCode = textToMorse(text);
      
      const embed = new EmbedBuilder()
          .setTitle('Text to Morse Code Conversion')
          .addFields(
              { name: 'Original Text', value: text },
              { name: 'Morse Code', value: morseCode }
          )
          .setColor('Blue')
          .setFooter({ text: footerText });
  
      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId('copy_morse')
                  .setLabel('Copy Morse Code')
                  .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                  .setCustomId('light')
                  .setLabel('Light Morse')
                  .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                  .setCustomId('sound')
                  .setLabel('Sound Morse')
                  .setStyle(ButtonStyle.Primary)
          );
  
      const reply = await interaction.reply({ embeds: [embed], components: [row] });
  
      const filter = i => i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
  
      collector.on('collect', async i => {
          if (i.customId === 'copy_morse') {
              await i.reply({ content: `Copied Morse Code: \`${morseCode}\``, ephemeral: true });
          } else if (i.customId === 'light') {
              await handleLightMorse(i, morseCode);
          } else if (i.customId === 'sound') {
              await handleSoundMorse(i, morseCode);
          }
      });
  
      collector.on('end', async () => {
          await reply.edit({ components: [] });
      });
  }
  
  async function handleLearn(interaction) {
      const morseCodeMap = {
          'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
          'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
          'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
          'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
          'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
          '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
          '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
          "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
          '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
          '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
      };
  
      const embed = new EmbedBuilder()
          .setTitle('Morse Code Reference')
          .setDescription('Here\'s a comprehensive list of Morse code for alphabets, numbers, and common symbols:')
          .setColor('Green')
          .setFooter({ text: footerText });
  
      let alphabets = '';
      let numbers = '';
      let symbols = '';
  
      for (const [char, code] of Object.entries(morseCodeMap)) {
          const entry = `**${char}** ➤ *In Morse Is*  〔 **${code}** 〕\n`;
          if (/[A-Z]/.test(char)) {
              alphabets += entry;
          } else if (/[0-9]/.test(char)) {
              numbers += entry;
          } else {
              symbols += entry;
          }
      }
  
      embed.addFields(
          { name: 'Alphabets', value: alphabets.trim() || 'None', inline: false },
          { name: 'Numbers', value: numbers.trim() || 'None', inline: false },
          { name: 'Symbols', value: symbols.trim() || 'None', inline: false }
      );
  
      await interaction.reply({ embeds: [embed] });
  }
  
  async function handleDemorse(interaction, morse) {
      const decodedText = morseToText(morse);
      
      const embed = new EmbedBuilder()
          .setTitle('Morse Code to Text Conversion')
          .addFields(
              { name: 'Morse Code', value: morse },
              { name: 'Decoded Text', value: decodedText }
          )
          .setColor('Purple')
          .setFooter({ text: footerText });
  
      await interaction.reply({ embeds: [embed] });
  }
  
  function textToMorse(text) {
      const morseCode = {
          'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
          'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
          'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
          'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
          'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
          '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
          '8': '---..', '9': '----.'
      };
  
      return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
  }
  
  function morseToText(morse) {
      const morseCode = {
          '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
          '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
          '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
          '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
          '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
          '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
          '---..': '8', '----.': '9'
      };
  
      return morse.split(' ').map(code => morseCode[code] || ' ').join('');
  }
  
  async function handleLightMorse(interaction, morseCode) {
      try {
          await interaction.deferReply();
          const gifBuffer = await createMorseGif(morseCode);
          if (!gifBuffer) {
              await interaction.editReply('Error generating GIF. Please try again.');
              return;
          }
          const attachment = new AttachmentBuilder(gifBuffer, { name: 'morse.gif' });
          await sendWebhookMessage(interaction.channel, { files: [attachment] });
          await interaction.editReply('Light Morse code has been sent!');
      } catch (error) {
          console.error('Error handling Light Morse:', error);
          await interaction.editReply('An error occurred while processing your request.');
      }
  }
  
  async function createMorseGif(morseCode) {
      const width = 100; // Reduced size
      const height = 100;
      const encoder = new GIFEncoder(width, height);
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(200); // Faster frames
      encoder.setQuality(10);
  
      const frames = morseCode.split('').flatMap(char => {
          if (char === '.' || char === '-') {
              return [
                  () => {
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, width, height);
                  },
                  () => {
                      ctx.fillStyle = 'black';
                      ctx.fillRect(0, 0, width, height);
                  }
              ];
          }
          return [() => {
              ctx.fillStyle = 'black';
              ctx.fillRect(0, 0, width, height);
          }];
      });
  
      frames.forEach(frame => {
          frame();
          encoder.addFrame(ctx);
      });
  
      encoder.finish();
      return encoder.out.getData();
  }
  
  async function handleSoundMorse(interaction, morseCode) {
      try {
          await interaction.deferReply();
          const audioBuffer = await createMorseAudio(morseCode);
          if (!audioBuffer) {
              await interaction.editReply('Error generating audio file. Please try again.');
              return;
          }
          const attachment = new AttachmentBuilder(audioBuffer, { name: 'morse.wav' });
          await sendWebhookMessage(interaction.channel, { files: [attachment] });
          await interaction.editReply('Sound Morse code has been sent!');
      } catch (error) {
          console.error('Error handling Sound Morse:', error);
          await interaction.editReply('An error occurred while processing your request.');
      }
  }
  
  async function createMorseAudio(morseCode) {
      const dotLength = 50; // Shorter dot length
      const dashLength = dotLength * 3;
      const pauseLength = dotLength;
      const letterPauseLength = dotLength * 3;
      const wordPauseLength = dotLength * 7;
  
      const sampleRate = 44100;
      const amplitude = 0.5;
      const frequency = 800;
  
      const audioData = [];
  
      function generateTone(duration) {
          const samples = Math.floor(duration * sampleRate / 1000);
          for (let i = 0; i < samples; i++) {
              const sample = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
              audioData.push(Math.floor(sample * 32767));
          }
      }
  
      function generateSilence(duration) {
          const samples = Math.floor(duration * sampleRate / 1000);
          audioData.push(...new Array(samples).fill(0));
      }
  
      for (const char of morseCode) {
          if (char === '.') generateTone(dotLength);
          else if (char === '-') generateTone(dashLength);
          else if (char === ' ') generateSilence(letterPauseLength);
          else if (char === '/') generateSilence(wordPauseLength);
          generateSilence(pauseLength);
      }
  
      const buffer = Buffer.from(new Int16Array(audioData).buffer);
  
      const wavHeader = Buffer.alloc(44);
      wavHeader.write('RIFF', 0);
      wavHeader.writeUInt32LE(36 + buffer.length, 4);
      wavHeader.write('WAVE', 8);
      wavHeader.write('fmt ', 12);
      wavHeader.writeUInt32LE(16, 16);
      wavHeader.writeUInt16LE(1, 20);
      wavHeader.writeUInt16LE(1, 22);
      wavHeader.writeUInt32LE(sampleRate, 24);
      wavHeader.writeUInt32LE(sampleRate * 2, 28);
      wavHeader.writeUInt16LE(2, 32);
      wavHeader.writeUInt16LE(16, 34);
      wavHeader.write('data', 36);
      wavHeader.writeUInt32LE(buffer.length, 40);
  
      return Buffer.concat([wavHeader, buffer]);
  }
  
  const app = express();
  
  // Increase the timeout to 5 minutes (300000 ms)
  app.use((req, res, next) => {
    res.setTimeout(300000, () => {
      console.log('Request has timed out.');
      res.send(408);
    });
    next();
  });
  
  client.login(process.env.DISCORD_BOT_TOKEN);  
