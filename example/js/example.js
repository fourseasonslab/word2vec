var Word2Vec = require("../../").Word2Vec;
var w2v = new Word2Vec(__dirname + "/../ts/jawiki-sep-1-vectors-bin1.bin");
w2v.getVector("りんご", function (vApple) {
    w2v.getVector("赤", function (vRed) {
        w2v.getVector("バナナ", function (vBanana) {
            var v = vRed.add(vApple.reverse()).add(vBanana);
            w2v.getSimilarWordList(v, 10, function (wl) {
                console.log(wl);
                process.exit();
            });
        });
    });
});
