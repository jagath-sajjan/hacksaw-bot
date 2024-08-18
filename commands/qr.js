const { AttachmentBuilder } = require('discord.js');
const QRCode = require('qrcode');

module.exports = {
    name: 'qr',
    description: 'Generate a QR code',
    options: [
        {
            name: 'type',
            type: 3, // String
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
            type: 3, // String
            description: 'The content to encode in the QR code',
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const type = interaction.options.getString('type');
            const content = interaction.options.getString('content');
            const qrAttachment = await generateQRCode(type, content);
            if (qrAttachment) {
                const embed = {
                    title: `Generated QR Code (${type.toUpperCase()})`,
                    description: `Content: ${content}`,
                    image: { url: 'attachment://qrcode.png' },
                    color: 0x00FF00,
                    footer: { text: 'Made By Jagath🩵' }
                };

                await interaction.editReply({ embeds: [embed], files: [qrAttachment] });
            } else {
                await interaction.editReply('Sorry, there was an error generating the QR code. Please try again.');
            }
        } catch (error) {
            console.error('Error in QR command:', error);
            await interaction.editReply('An error occurred while generating the QR code.');
        }
    }
};

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