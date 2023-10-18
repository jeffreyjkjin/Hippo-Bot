import Event from '../structures/Event'
import Modal from '../structures/Modal'

module.exports = new Event(
   'interactionCreate',
   false,
   async (i: any) => {
        if (i.isModalSubmit()) {
            const modal: Modal = i.client.modals.get(i.customId);

            if (!modal) {
                await i.followUp({ 
                    content: `No modal matching ${i.customId} was found.`, 
                    ephemeral: true
                });
                return;
            }
    
            try {
                await modal.execute(i);
            }
            catch (e) {
                console.error(e);
                await i.followUp({ 
                    content: 'There was an error while executing this modal.',
                    ephemeral: true
                });            
            }
        }
   }
);