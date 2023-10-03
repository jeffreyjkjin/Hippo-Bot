import { APIModalInteractionResponseCallbackData, ModalBuilder } from 'discord.js'

export default class Modal {
    private data: ModalBuilder;
    
    id: string;
    execute: Function;

    constructor(data: ModalBuilder, execute: Function) {
        this.data = data;
        this.id = data.toJSON()['custom_id'];
        this.execute = execute;
    }

    toJSON(): APIModalInteractionResponseCallbackData {
        return this.data.toJSON();
    }
}