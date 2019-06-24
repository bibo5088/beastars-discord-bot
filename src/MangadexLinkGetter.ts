import axios, {AxiosResponse} from 'axios';
import Cache from "./Cache";

interface Chapter {
    id: string;
    title: string;
    chapter: number;
    volume: string;
}

interface MangadexChapters {
    [id: string]: {
        "volume": string;
        "chapter": number;
        "title": string;
        "lang_code": "gb" | string;
    };
}

export default class MangadexLinkGetter {
    cache: Cache;

    constructor() {
        //1H cache
        this.cache = new Cache(60 * 60);
    }

    async getPageLink(chapterNo: number): Promise<string> {

        const chapters = <Chapter[]>await this.cache.get("chapters", MangadexLinkGetter.getChapterList);

        const chapter = chapters.find((el) => el.chapter == chapterNo);

        //Chapter not found
        if (chapter == undefined) {
            return `Cannot find chapter Nº ${chapterNo}`;
        }

        //Return chapter Link
        return `https://mangadex.org/chapter/${chapter.id}`;

    }

    private static async getChapterList(): Promise<Chapter[]> {
        const beastarsId = "20523";

        const result = <AxiosResponse>await axios.get(`https://mangadex.org/api/manga/${beastarsId}`).catch(() => {
            return [];
        });

        const chapters: Chapter[] = [];
        const mangadexChapters: MangadexChapters = result.data["chapter"];

        for (const mangadexChapterName in mangadexChapters) {
            const mangadexChapter = mangadexChapters[mangadexChapterName];

            //Ignore non english chapters
            if (mangadexChapter.lang_code != "gb") continue;

            //Add new chapter
            chapters.push({
                id: mangadexChapterName,
                title: mangadexChapter.title,
                chapter: mangadexChapter.chapter,
                volume: mangadexChapter.volume
            });
        }

        return chapters;
    }
}