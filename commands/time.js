const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Get the current time'),
    async execute(interaction) {
        const time = new Date();
        await interaction.reply(`The current time is ${time}`);
    },
};
