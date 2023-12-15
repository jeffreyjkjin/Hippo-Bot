export default interface PollData {
    title: string;
    description: string;
    options: Map<string, Array<string>>;
    totalVotes: number;
    singleVote: boolean;
    addOptions: boolean;
    image: string;
    messageUrl: string;
    creatorId: string;
    ended: boolean;
}