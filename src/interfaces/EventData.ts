export default interface EventData {
    title: string;
    description: string;
    datetime: string;
    attendees: string[];
    maybe: string[];
    pass: string[];
    image: string;
    messageUrl: string;
    channelId: string;
    creatorId: string;
    started: boolean;
}