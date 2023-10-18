import Button from '../structures/Button'
import Event from '../structures/Event'

module.exports = new Event(
   'interactionCreate',
   false,
   async (i: any) => {
        if (i.isButton()) {
            const button: Button = i.client.buttons.get(i.customId);
        
            if (!button) {
                await i.followUp({ 
                    content: `No button matching ${i.customId} was found.`, 
                    ephemeral: true
                });
                return;
            }
    
            try {
                await button.execute(i);
            }
            catch (e) {
                console.error(e);
                await i.followUp({ 
                    content: 'There was an error while executing this button.',
                    ephemeral: true
                });            
            }
        }
   }
);