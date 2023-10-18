import Command from '../structures/Command'
import Event from '../structures/Event'

module.exports = new Event(
   'interactionCreate',
   false,
   async (i: any) => {
        if (i.isChatInputCommand()) {
            const command: Command = i.client.commands.get(i.commandName);

            if (!command) {
                await i.followUp({ 
                    content: `No command matching ${i.commandName} was found.`, 
                    ephemeral: true
                });
                return;
            }
    
            try {
                await command.execute(i);
            } 
            catch (e) {
                console.error(e);
                await i.followUp({ 
                    content: 'There was an error while executing this command.',
                    ephemeral: true
                });
            }
        }
   }
);