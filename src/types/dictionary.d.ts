export type DictionaryResponse = {
    data: {
        displayForm: string
        content: {
            luna: {
                entries: [{
                    posBlocks: [{
                        definitions: [{
                            order: number,
                            definition: string
                        }]
                    }]
                }]
            },
            learners: [{
                definitions: [{
                    defs: array<string>
                }]
            }],
            examples: Array<{ sentence: string }>
        }
    }
}