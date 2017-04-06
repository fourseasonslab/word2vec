var WordVector = (function () {
    function WordVector(index, dimention, vector) {
        this.index = index;
        this.dimention = dimention;
        this.vector = vector;
    }
    WordVector.prototype.cosineSimilarity = function (b) {
        if (this.index === -1 || b.index === -1)
            return 0;
        if (this.dimention !== b.dimention)
            return 0;
        var ans = 0;
        for (var i = 0; i < this.dimention; i++) {
            ans += this.vector[i] * b.vector[i];
        }
        return ans;
    };
    return WordVector;
}());
var Word2Vec = (function () {
    function Word2Vec(opt) {
        var childprocess = require("child_process");
        //this.p = childprocess.spawn('./vecWord', ["data/jawiki-sep-1-vectors-bin1.bin"], {});
        this.p = childprocess.spawn('./vecWord', ["data/jawiki-sep-1-vectors-bin1.bin"]);
        var that = this;
        this.p.stdout.on('data', function (data) {
            //console.log('stdout: ' + data);
            data = "" + data;
            var dataSplit = data.split("\n");
            //console.log(dataSplit);
            dataSplit[2] = dataSplit[2].split(" ");
            //console.log(dataSplit);
            var mapF = function (element) {
                if (element instanceof Array) {
                    return element.map(mapF);
                }
                else {
                    return Number(element);
                }
            };
            dataSplit = mapF(dataSplit);
            //console.log(dataSplit);
            that.f(new WordVector(dataSplit[0], dataSplit[1], dataSplit[2]));
        });
        this.p.on('exit', function (code) {
            console.log('child process exited.');
        });
        this.p.on('error', function (err) {
            console.error(err);
            process.exit(1);
        });
    }
    Word2Vec.prototype.getVector = function (s, f) {
        this.f = f;
        this.p.stdin.write(s + "\n");
    };
    Word2Vec.prototype.cosineSimilarity = function (a, b) {
        if (a.index === -1 || b.index === -1)
            return 0;
        if (a.dimention !== b.dimention)
            return 0;
        var ans = 0;
        for (var i = 0; i < a.dimention; i++) {
            ans += a.vector[i] * b.vector[i];
        }
        return ans;
    };
    Word2Vec.prototype.twoWordSimilarity = function (a, b, f) {
        this.f = f;
        var w2v = new Word2Vec();
        w2v.getVector(a, function (splited) {
            var asplited = splited;
            w2v.getVector(b, function (splited) {
                console.log(w2v.cosineSimilarity(asplited, splited));
            });
        });
    };
    return Word2Vec;
}());
module.exports = Word2Vec;
