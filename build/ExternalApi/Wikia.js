"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wikia = void 0;
const axios_1 = require("axios");
const types_1 = require("../types");
class Wikia {
    static async searchFirstLink(query) {
        const articles = await this.searchArticles(query);
        if (articles.length === 0) {
            throw new types_1.CommandError(`Cannot find article with search query \`${query}\``);
        }
        return articles[0].url;
    }
    static async searchArticles(query) {
        const url = `https://beastars-eng.fandom.com/api/v1/Search/List?query=${encodeURIComponent(query)}`;
        const result = await axios_1.default.get(url).catch(() => {
            //Cannot find article
            throw new types_1.CommandError(`Cannot find article with search query \`${query}\``);
        });
        return result.data.items;
    }
}
exports.Wikia = Wikia;
//# sourceMappingURL=Wikia.js.map