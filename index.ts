class WordVector
{
	word: string;
	index : number;
	dimention : number;
	vector : number[];

	constructor(word: string, index: number, dimention: number, vector: number[]){
		this.word = word;
		this.index = index;
		this.dimention = dimention;
		this.vector = vector;
	}

	cosineSimilarity(b : WordVector){
		if(this.index === -1 || b.index === -1) return 0;
		if(this.dimention !== b.dimention) return 0;
		
		var ans = 0;
		for(var i=0; i<this.dimention; i++){
			ans += this.vector[i] * b.vector[i];
		}
		return ans;
	}
}

class Word2VecRequest
{
	word: string;
	func: Function;
	constructor(word: string, func: Function){
		this.word = word;
		this.func = func;
	}
}

namespace W2VConst
{
	export const binPathGetVector
		= __dirname + "/get-vector";
	export const defaultVectorPath
		= __dirname + "/data/jawiki-sep-1-vectors-bin1.bin";
}

class Word2Vec
{
	p: any;  
	buf: string[] = [];
	reqList: Word2VecRequest[] = [];
	constructor(pathToVectors: string = W2VConst.defaultVectorPath){
		var childprocess = require("child_process");
		this.p = childprocess.spawn(W2VConst.binPathGetVector, [pathToVectors]);
		var that = this;
		this.p.stdout.on('data', function(data){
			data = "" + data;
			data = data.split("\n");
			data.pop();	// remove last newline
			Array.prototype.push.apply(that.buf, data);	// append all
			//console.log(that.buf);
			while(that.buf.length !== 0){
				var req = that.reqList.shift();
				var idx = Number(that.buf.shift());
				var dim = 0;
				var vec = [];
				if(idx !== -1 && !isNaN(idx)){
					dim = Number(that.buf.shift());
					vec = that.buf.shift().split(" ").map(function(e){
						return Number(e);
					});
				}
				if(req && req.func instanceof Function){
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

	getVector(s: string, f: Function){
		this.reqList.push(new Word2VecRequest(s, f));
		this.p.stdin.write(s + "\n");
	}

	cosineSimilarity(a : WordVector, b : WordVector){
		if(a.index === -1 || b.index === -1) return 0;
		if(a.dimention !== b.dimention) return 0;
		
		var ans = 0;
		for(var i=0; i<a.dimention; i++){
			ans += a.vector[i] * b.vector[i];
		}
		return ans;
	}

	twoWordSimilarity(a : string, b : string, f : Function){
		var that = this;
		this.getVector(a, function(v1 : WordVector){
			that.getVector(b, function(v2 : WordVector){
				f(v1.cosineSimilarity(v2));
			});
		});
	}
}

module.exports = Word2Vec;
