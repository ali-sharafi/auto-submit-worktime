import axios from "axios";
import { TranslateResult, TranslatorInterface } from "../contract/TranslatorInterface";
import { DictionaryResponse } from "../types/dictionary";
class DictionaryService implements TranslatorInterface {
    async readTranslate(word: string): Promise<TranslateResult | null> {
        let result = await this.getTranslation(word);

        if (result)
            return this.parseResult(result);
        return null;
    }

    parseResult(response: DictionaryResponse): TranslateResult {
        const definitions = response.data.content.luna.entries;
        let result = {
            word: response.data.displayForm
        };

        for (let i = 0; i < definitions.length; i++) {
            const element = definitions[i];

        }
    }

    async getTranslation(word: string): Promise<DictionaryResponse | null> {
        let res = await axios.get(process.env.DICTIONARY_DOT_COM_API + '/' + word)
            .catch(console.error);

        if (res && res.data)
            return res.data as DictionaryResponse;
        return null;
    }
}

export default DictionaryService;