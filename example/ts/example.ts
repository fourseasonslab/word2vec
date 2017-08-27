import { Word2Vec } from "../../";

var w2v = new Word2Vec(__dirname + "/jawiki-sep-1-vectors-bin1.bin");
w2v.getVector("りんご", function(vApple){
	w2v.getVector("赤", function(vRed){
		w2v.getVector("バナナ", function(vBanana){
			/*
			console.log(JSON.stringify(vApple));
			console.log(JSON.stringify(vRed));
			console.log(JSON.stringify(vBanana));
			*/
			var v = vRed.add(vApple.reverse()).add(vBanana);
			//console.log(JSON.stringify(v));
			//console.log("10 " + v.vector.join(" "));
			w2v.getSimilarWordList(v, 10, function(wl){
				console.log(wl);
				process.exit();
			})
		});
	});
});
