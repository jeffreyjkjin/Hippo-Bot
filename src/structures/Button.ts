import { APIButtonComponent } from 'discord.js'
import { ButtonBuilder } from '@discordjs/builders'

export default class Button {
    private data: ButtonBuilder;
    
    id: string;
    execute: Function;

    constructor(data: ButtonBuilder, execute: Function) {
        this.data = data;
        this.id = data.toJSON()['custom_id'];
        this.execute = execute;
    }

    toJSON(): APIButtonComponent {
        return this.data.toJSON();
    }
}