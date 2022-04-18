import { TranslateResult, TranslatorInterface } from "../contract/TranslatorInterface";
class DictionaryService implements TranslatorInterface {
    async readTranslate(word: string): Promise<TranslateResult> {
        //TODO
        return {
            meaning: '',
            examples: []
        }
    }
}

export default DictionaryService;