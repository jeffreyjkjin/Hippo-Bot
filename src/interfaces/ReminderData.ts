export default interface ReminderData {
    title: string;
    datetime: string;
    subscribers: string[];
    messageUrl: string;
    creatorId: string;
    reminded: boolean;
}