export declare class WordVector {
    word: string;
    index: number;
    dimention: number;
    vector: number[];
    constructor(word: string, index: number, dimention: number, vector: number[]);
    cosineSimilarity(b: WordVector): number;
    add(b: WordVector): WordVector;
    reverse(): WordVector;
}
export declare class Word2Vec {
    p: any;
    buf: string[];
    private reqList;
    constructor(pathToVectors?: string);
    getVector(s: string, f: (v: WordVector) => any): void;
    getSimilarWordList(v: WordVector, count: number, f: (wl: (string | number)[]) => any): void;
    cosineSimilarity(a: WordVector, b: WordVector): number;
    twoWordSimilarity(a: string, b: string, f: Function): void;
}
