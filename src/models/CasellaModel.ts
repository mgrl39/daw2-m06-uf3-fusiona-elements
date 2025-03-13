export default class CasellaModel {
    private emoji: string;
    
    constructor(emoji: string) {
        this.emoji = emoji;
    }

    get getEmoji() {
        return this.emoji;
    }
}