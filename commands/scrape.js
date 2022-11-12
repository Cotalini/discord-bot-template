const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scrape')
        .setDescription('Scrape a shopify website for variants')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Link to the shopify product')
                .setRequired(true)),
    async execute(interaction) {
        // determines if the message is sent in dm or not and makes sure the ephemeral is set accordingly as if it is true in dm it will throw an error
        let eph;
        interaction.guildId ? eph = true : eph = false;        // gets the input from the user
        const link = interaction.options.getString('link');
        // adds .json to the end of the link to get the json data
        axios.get(link + '.json')
            .then(function (resp) {
                // creates a new embed
                const embed = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle(resp.data.product.title)
                    .setURL(link)
                    .setAuthor({ name: 'https://' + link.split('/')[2], url: 'https://' + link.split('/')[2] })
                    .setThumbnail(resp.data.product.image.src)
                    .setTimestamp()
                    .setFooter({ text: 'Shopify Scraper | Cotali#1111', iconURL: 'https://1000logos.net/wp-content/uploads/2020/08/Shopify-Logo.png' });

                // loops through the variants and adds them to the embed
                const variants = resp.data.product.variants;
                let size = String();
                let vars = String();
                for (let i = 0; i < variants.length; i++) {
                    // adds the size to the size string and the variant id to the vars string
                    size += variants[i].title + '\n';
                    vars += variants[i].id.toString() + '\n';
                }
                // adds the size and variant id fields to the embed
                embed.addFields(
                    { name: 'Options', value: size, inline: true },
                    { name: 'Variants', value: vars, inline: true }
                );
                // sends the message with the embed and ephemeral so only the user can see it
                interaction.reply({ embeds: [embed], ephemeral: eph })
            })
            .catch(function (err) {
                // if there is an error, it sends a message saying there was an error
                console.log(err);
                return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            });
    },
};