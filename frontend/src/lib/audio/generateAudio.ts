const audioUrls = import.meta.glob<string>("../data/audio/*/*.mp3", {
    eager: true,
    query: "?url",
    import: "default",
});
const audioCache = new Map<string, HTMLAudioElement>();

let playing: HTMLAudioElement | null = null;

export const playSound = (familyId: number, position: number, char: string) => {
    const audioFile = `${String(familyId).padStart(2,"0")}_${position}_${char}.mp3`;
    const audioUrl = audioUrls[`../data/audio/${familyId}_family/${audioFile}`];

    if (!audioUrl) return;

    let audio = audioCache.get(audioFile);
    if (!audio){
        audio = new Audio(audioUrl);
        audioCache.set(audioFile, audio);
    }

    playing?.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
    playing = audio;
}
