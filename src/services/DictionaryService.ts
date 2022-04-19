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
        console.log('response: ', response);
        return {
            word: response.data.displayForm,
            meanings: this.getMeanings(response),
            examples: this.getLearnersExamples(response)
        };
    }

    getLearnersExamples(response: DictionaryResponse): Array<string> {
        const learners = response.data.content.learners;
        const learnersDefinitions = learners.flatMap(item => item.definitions);
        return [...learnersDefinitions.map(item => item.defs)];
    }

    getMeanings(response: DictionaryResponse): Array<string> {
        const definitions = response.data.content.luna.entries;
        let result = [];
        for (let i = 0; i < definitions.length; i++) {
            const posBlocks = definitions[i].posBlocks;
            const definitionBlock = posBlocks.flatMap(item => item.definitions);
            result.push(...definitionBlock.map(def => def.definition));
        }

        return result;
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