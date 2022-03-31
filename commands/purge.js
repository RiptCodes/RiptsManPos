const ms = require('ms')

module.exports = {
    name: 'purge',
    description: 'Purge messages',
    userPermissions: ['MANAGE_MESSAGES'],
    options: [
        {
            name: 'amount',
            description: 'Amount of messages to delete',
            type: 'integer',
            required: true
        }
    ],
    execute(client,Discord, message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('Ript said: You do not have permission to purge messages');
            if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) return message.channel.send('Ript said: I do not have permission to purge messages');
            //stop infinite loop
            if (isNaN(args[0])) return message.channel.send('Ript said: Please specify a number');
            message.channel.bulkDelete(args[0]).then(() => {
                message.channel.send(`${args[0]} messages have been purged`);
                

            }).catch(err => {
                message.channel.send('Ript was unable to purge the messages');
            });
        }
}

            
            //message.channel.send(`${args[0]} messages have been purged`);

  
// execute(message, args) {
//     if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('You do not have permission to purge messages');
//     //check if the user has the permission to purge
//     if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) return message.channel.send('I do not have permission to purge messages');
//     //check if the user has the permission to purge
//     if (!args[1]) return message.channel.send('Please specify a number');
//     //ask for a amount to delete
//     message.channel.bulkDelete(args[1]).then(() => {
//         //send a message to the channel
//         message.channel.send(`${args[1]} messages have been deleted`);
//     }).catch(err => {
//         //send a message to the channel
//         message.channel.send('I was unable to delete messages');
//     }
//     );
// }
// }