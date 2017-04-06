var Word2Vec = require("node-word2vec");
var w2v = new Word2Vec(__dirname + "/jawiki-sep-1-vectors-bin1.bin");
w2v.getVector("陽子", function(v1){
	w2v.getVector("明子", function(v2){
		console.log(v1.cosineSimilarity(v2));
	});
});
