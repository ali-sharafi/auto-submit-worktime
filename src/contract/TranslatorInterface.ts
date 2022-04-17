export type TranslateResult = {
    meaning: string;
    examples: Array<string>;
}

export interface TranslatorInterface {
    readTranslate(word: string): Promise<TranslateResult>
}