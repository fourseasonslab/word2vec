# node-word2vec
A npm package of [word2vec](https://code.google.com/archive/p/word2vec/).

## Installation
```bash
npm install node-word2vec
```

## Usage
```node
var Word2Vec = require("node-word2vec");
var w2v = new Word2Vec(__dirname + "/relative/path/to/your-vector-file.bin");
w2v.getVector("陽子", function(v1){
        w2v.getVector("明子", function(v2){
                console.log(v1.cosineSimilarity(v2));
        });
});
w2v.twoWordSimilarity("陽子", "明子", function(r){
        console.log(r);
})
```

## LICENCE
- MIT (for .ts and .js)
- Apache License 2.0 (for native word2vec sources)
