class WordVector
{
	index : number;
	dimention : number;
	vector : number[];

	constructor(index: number, dimention: number, vector: number[]){
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








class Word2Vec
{
	p: any;  
	f: Function;
	constructor(opt?: string){
		var childprocess = require("child_process");
		//this.p = childprocess.spawn('./vecWord', ["data/jawiki-sep-1-vectors-bin1.bin"], {});
		this.p = childprocess.spawn('./vecWord', ["data/jawiki-sep-1-vectors-bin1.bin"]);
		var that = this;
		this.p.stdout.on('data', function(data){
			//console.log('stdout: ' + data);

			data = "" + data;

			var dataSplit = data.split("\n");
			//console.log(dataSplit);
			dataSplit[2] = dataSplit[2].split(" ");
			//console.log(dataSplit);
			var mapF = function (element) {
				if(element instanceof Array){
					return element.map(mapF);
				}else{
					return Number(element);
				}
			}
			dataSplit = mapF(dataSplit);
			//console.log(dataSplit);
			
			that.f(new WordVector(dataSplit[0],dataSplit[1],dataSplit[2]));

		});
		this.p.on('exit', function (code) {
			console.log('child process exited.');
		});
		this.p.on('error', function (err) {
			console.error(err);
			process.exit(1);
		});
	}

	getVector(s: string, f: Function){
		this.f = f;
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

		this.f = f;
		var w2v = new Word2Vec();
		w2v.getVector(a, function(splited : WordVector){
			var asplited = splited;

			w2v.getVector(b, function(splited : WordVector){
				console.log(w2v.cosineSimilarity(asplited, splited));
			});
		});
	}
}


module.exports = Word2Vec;
