var fs = require("fs");

export class WordVector
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
	add(b: WordVector){
		if(this.index === -1 || b.index === -1) return null;
		if(this.dimention !== b.dimention) return null;

		var vec = [];
		for(var i=0; i<this.dimention; i++){
			vec[i] = this.vector[i] + b.vector[i];
		}
		
		return new WordVector(null, null, this.dimention, vec);
	}
	reverse(){
		if(this.index === -1) return null;

		var vec = [];
		for(var i=0; i<this.dimention; i++){
			vec[i] = -this.vector[i];
		}
		
		return new WordVector(null, null, this.dimention, vec);
	}

}

class Word2VecRequest
{
	word: string;
	func: Function;
	qType: string;
	constructor(word: string, func: Function, qType: string){
		this.word = word;
		this.func = func;
		this.qType = qType;
	}
}

namespace W2VConst
{
	export const binPath
		= __dirname + "/../bin/node-word2vec";
	export const defaultVectorPath
		= __dirname + "/../data/jawiki-sep-1-vectors-bin1.bin";
}

export class Word2Vec
{
	p: any;  
	buf: string[] = [];
	private reqList: Word2VecRequest[] = [];
	constructor(pathToVectors: string = W2VConst.defaultVectorPath){
		var childprocess = require("child_process");
		fs.accessSync(W2VConst.binPath);
		fs.accessSync(pathToVectors);
		this.p = childprocess.spawn(W2VConst.binPath, [pathToVectors]);
		var that = this;
		this.p.stdout.on('data', function(data: any){
			data = "" + data;
			data = data.split("\n");
			data.pop();	// remove last newline
			Array.prototype.push.apply(that.buf, data);	// append all
			//console.log(that.buf);
			while(that.buf.length !== 0){
				var req = that.reqList.shift();
				if(req.qType === "word2vec"){
					var idx = Number(that.buf.shift());
					var dim = 0;
					var vec: number[] = [];
					if(idx !== -1 && !isNaN(idx)){
						dim = Number(that.buf.shift());
						vec = that.buf.shift().split(" ").map(function(e){
							return Number(e);
						});
					}
					if(req && req.func instanceof Function){
						req.func(new WordVector(req.word, idx, dim, vec));
					}
				} else if(req.qType === "vec2word"){
					if(req && req.func instanceof Function){
						req.func(that.buf.map(function(e){
							var t = e.split("\t");
							var r = [];
							r[0] = t[0];
							if(t[1]) r[1] = Number(t[1]);
							return r;
						}));
					}
					that.buf = [];
				}
			}
		});
		this.p.on('exit', function (code: any) {
			console.error('child process exited.');
		});
		this.p.on('error', function (err: any) {
			console.error("Error in Word2Vec process(p.onError)");
			console.error(err);
			process.exit(1);
		});
		this.p.stdin.on('error', function (err: any) {
			console.error("Error in Word2Vec process(p.stdin.onError)");
			console.error(err);
			process.exit(1);
		});
		this.p.stdout.on('error', function (err: any) {
			console.error("Error in Word2Vec process(p.stdout.onError)");
			console.error(err);
			process.exit(1);
		});
	}

	getVector(s: string, f: (v: WordVector) => any){
		this.reqList.push(new Word2VecRequest(s, f, "word2vec"));
		this.p.stdin.write("word2vec\n" + s + "\n");
	}

	getSimilarWordList(v: WordVector, count: number, f: (wl: (string | number)[]) => any){
		if(v && v.vector && v.vector.length > 0){
			this.reqList.push(new Word2VecRequest(null, f, "vec2word"));
			this.p.stdin.write("vec2word\n" + count + " " + v.vector.join(" ") + "\n");
		} else{
			f([]);
		}
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

