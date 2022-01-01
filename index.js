// Keep bot alive
require("http")
  .createServer((req, res) =>
    res.end(`
<h1>Cloud is UP!</h1>
`)
  )
  .listen(3000);

const Discord = require("discord.js");
const TOKEN = process.env.TOKEN;
const OptionTypes = Discord.Constants.ApplicationCommandOptionTypes;

// Constants
const EmbedColor = "#6C92C8";

// Functions
function randomElement(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

const client = new Discord.Client({
  // Soon to change...
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

// Login Message
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  const guild = client.guilds.cache.get("830670520172150805");
  let commands = guild ? guild.commands : client.application.commands;
  commands.create({
    name: "ping",
    description: "Replies with pong.",
  });
  commands.create({
    name: "kill",
    description: "Send a fun kill message",
    options: [
      {
        name: "target",
        description: "The target of the command",
        required: true,
        type: OptionTypes.USER,
      },
    ],
  });
  commands.create({
    name: "gamer",
    description: "Return a random number between 0 and 100",
    options: [
      {
        name: "target",
        description: "The target of the command (optional)",
        required: false,
        type: OptionTypes.USER,
      },
    ],
  });
  commands.create({
    name: "kick",
    description: "Kick a specified user",
    options: [
      {
        name: "target",
        description: "The target of the command",
        required: true,
        type: OptionTypes.USER,
      },
      {
        name: "reason",
        description: "The reason for kicking the user",
        required: false,
        type: OptionTypes.STRING,
      },
    ],
  });
  commands.create({
    name: "ban",
    description: "Ban a specified user",
    options: [
      {
        name: "target",
        description: "The target of the command",
        required: true,
        type: OptionTypes.USER,
      },
      {
        name: "reason",
        description: "The reason for banning the user",
        required: false,
        type: OptionTypes.STRING,
      },
    ],
  });
  commands.create({
    name: "unban",
    description: "Unban a specified user",
    options: [
      {
        name: "id",
        description: "The id of the user you wish to unban",
        required: true,
        type: OptionTypes.INTEGER,
      },
      {
        name: "reason",
        description: "The reason for unbanning the user",
        required: false,
        type: OptionTypes.STRING,
      },
    ],
  });
});

client.on("messageCreate", (message) => {
  if (message.channel.type === "dm" || message.author.bot) return;
});

client.on("interactionCreate", async (interaction) => {
  // ### [REMEMBER]: ephemeral: true ###
  if (!interaction.isCommand()) return;
  const { commandName, options } = interaction;
  switch (commandName.toLowerCase()) {
    case "ping":
      interaction.reply(`Pong! ${Date.now() - interaction.createdTimestamp}ms latency`);
      break;
    case "kill":
      var person = options.getMember("target");
      await interaction.reply(
        randomElement([
          `${interaction.member} made ${person} feel the pain`,
          `${person} slipped on a rubber duck placed by ${interaction.member}`,
          `${person} was pushed off a cliff by ${interaction.member}`,
          `${interaction.member} punched ${person}`,
          `${interaction.member} pinched ${person}`,
          `${person} was exploded by ${interaction.member}`,
        ])
      );
      break;
    case "gamer":
      var target = options.getMember("target") || interaction.member;
      var displayName = target.displayName;
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(EmbedColor)
            .setDescription(`${Math.round(Math.random() * 100)}% Gamer`)
            .setTitle(
              `${displayName}${
                displayName.endsWith("s") ? "'" : "'s"
              } Gamer level, very nice`
            ),
        ],
      });
      break;
    case "kick":
      if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("#ff0000")
              .setTitle("Error")
              .setDescription("Invalid Permissions"),
          ],
          ephemeral: true,
        });
        break;
      }
      var target = options.getMember("target");
      var reason = options.getString("reason") || "Unknown Reason";
      if (target.id === interaction.member.id) {
        interaction.reply({
          content: "Cannot kick self.",
          ephemeral: true,
        });
        break;
      }
      if (!target.kickable) {
        interaction.reply({
          content:
            "This member cannot be kicked. Please make sure Cloud has the correct permissions.",
          ephemeral: true,
        });
        break;
      }
      if (target.user.bot) {
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setTitle("Cannot kick a bot.")
              .setColor(EmbedColor)
              .setDescription("Please manually remove this user."),
          ],
          ephemeral: true,
        });
        break;
      }
      target
        .send({
          embeds: [
            new Discord.MessageEmbed()
              .setTitle(`Kicked from "${interaction.guild.name}".`)
              .setDescription(reason)
              .setColor("#ff0000"),
          ],
        })
        .catch(() => {});
      target.kick(reason);
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(EmbedColor)
            .setTitle(`Kicked ${target.user.tag}`)
            .setDescription(reason),
        ],
        ephemeral: true,
      });
      break;
    case "ban":
      if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("#ff0000")
              .setTitle("Error")
              .setDescription("Invalid Permissions"),
          ],
          ephemeral: true,
        });
        break;
      }
      var target = options.getMember("target");
      var reason = options.getString("reason") || "Unknown Reason";
      if (target.id === interaction.member.id) {
        interaction.reply({
          content: "Cannot ban self.",
          ephemeral: true,
        });
        break;
      }
      if (!target.bannable) {
        interaction.reply({
          content:
            "This member cannot be banned. Please make sure Cloud has the correct permissions.",
          ephemeral: true,
        });
        break;
      }
      if (target.user.bot) {
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setTitle("Cannot ban a bot.")
              .setColor(EmbedColor)
              .setDescription("Please manually remove this user."),
          ],
          ephemeral: true,
        });
        break;
      }
      target
        .send({
          embeds: [
            new Discord.MessageEmbed()
              .setTitle(`Banned from "${interaction.guild.name}".`)
              .setDescription(reason)
              .setColor("#ff0000"),
          ],
        })
        .catch(() => {});
      target.ban({ reason: reason });
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(EmbedColor)
            .setTitle(`Banned ${target.user.tag}`)
            .setDescription(reason),
        ],
        ephemeral: true,
      });
      break;
    case "unban":
      if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
        interaction.reply({
          embeds: [new Discord.MessageEmbed()],
        });
      }
      var target = options.getInteger("target");
  }
});

client.on("rateLimit", (info) => {
  console.log(
    `Rate limit hit ${
      info.timeDifference
        ? info.timeDifference
        : info.timeout
        ? info.timeout
        : "Unknown timeout "
    }`
  );
});

client.on("debug", (i) => console.log(i));

client.login(TOKEN);
