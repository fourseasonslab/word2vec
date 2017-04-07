var WordVector = (function () {
    function WordVector(word, index, dimention, vector) {
        this.word = word;
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
var Word2VecRequest = (function () {
    function Word2VecRequest(word, func) {
        this.word = word;
        this.func = func;
    }
    return Word2VecRequest;
}());
var W2VConst;
(function (W2VConst) {
    W2VConst.binPathGetVector = __dirname + "/get-vector";
    W2VConst.defaultVectorPath = __dirname + "/data/jawiki-sep-1-vectors-bin1.bin";
})(W2VConst || (W2VConst = {}));
var Word2Vec = (function () {
    function Word2Vec(pathToVectors) {
        if (pathToVectors === void 0) { pathToVectors = W2VConst.defaultVectorPath; }
        this.buf = [];
        this.reqList = [];
        var childprocess = require("child_process");
        this.p = childprocess.spawn(W2VConst.binPathGetVector, [pathToVectors]);
        var that = this;
        this.p.stdout.on('data', function (data) {
            data = "" + data;
            data = data.split("\n");
            data.pop(); // remove last newline
            Array.prototype.push.apply(that.buf, data); // append all
            //console.log(that.buf);
            while (that.buf.length !== 0) {
                var req = that.reqList.shift();
                var idx = Number(that.buf.shift());
                var dim = 0;
                var vec = [];
                if (idx !== -1 && !isNaN(idx)) {
                    dim = Number(that.buf.shift());
                    vec = that.buf.shift().split(" ").map(function (e) {
                        return Number(e);
                    });
                }
                if (req && req.func instanceof Function) {
                    req.func(new WordVector(req.word, idx, dim, vec));
                }
            }
        });
        this.p.on('exit', function (code) {
            console.log('child process exited.');
        });
        this.p.on('error', function (err) {
            console.error("Error in Word2Vec process");
            console.error(err);
            process.exit(1);
        });
    }
    Word2Vec.prototype.getVector = function (s, f) {
        this.reqList.push(new Word2VecRequest(s, f));
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
        var that = this;
        this.getVector(a, function (v1) {
            that.getVector(b, function (v2) {
                f(v1.cosineSimilarity(v2));
            });
        });
    };
    return Word2Vec;
}());
module.exports = Word2Vec;
