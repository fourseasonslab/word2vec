class Word2Vec
{
	p: any;  
	f: Function;
	constructor(opt?: string){
		var childprocess = require("child_process");
		//this.p = childprocess.spawn('./vecWord', ["data/jawiki-sep-1-vectors-bin1.bin"], {});
		this.p = childprocess.spawn('./vecWord', ["data/jawiki-sep-1-vectors-bin1.bin"]);
		var that = this;
		console.log("わーい");
		this.p.stdout.on('data', function(data){
			//	console.log('stdout: ' + data);

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
			
			that.f(dataSplit);

		});
		this.p.on('exit', function (code) {
			console.log('child process exited.');
		});
		this.p.on('error', function (err) {
			console.error(err);
			process.exit(1);
		});
	}

	getVec(s: string, f: Function){
		this.f = f;
		this.p.stdin.write(s + "\n");
	}

	cosineSimilarity(a : any, b : any){
		if(a[0] === -1 || b[0] === -1) return 0;
		if(a[1] !== b[1]) return 0;
		
		var ans = 0;
		for(var i=0; i<a[1]; i++){
			ans += a[2][i] * b[2][i];
		}
		return ans;
	}

	twoWordSimilarity(a : string, b : string, f : Function){

		this.f = f;
		var w2v = new Word2Vec();
		w2v.getVec(a, function(splited){
			var asplited = splited;

			w2v.getVec(b, function(splited){
				console.log(w2v.cosineSimilarity(asplited, splited));
			});
		});
	}
}
/*
			if(that.f instanceof Function){
				var parseCabochaResult = function (inp) {
					inp = inp.replace(/ /g, ",");
					inp = inp.replace(/\r/g, "");
					inp = inp.replace(/\s+$/, "");
					var lines = inp.split("\n");
					var res = lines.map(function(line) {
						return line.replace('\t', ',').split(',');
					});
					return res;
				};
				var res = parseCabochaResult("" + data);
				//console.log(res);

				var depres = [];    //dependency relationsのresultって書きたかった
				var item = [0, "", []];	// [relID, "chunk", [[mecab results]]]o
				var mecabList = [];
				var mecabs = [];
				var scores = [];
				var score;
				//var types = [];
				for(var i = 0; i < res.length; i++){
					var row = res[i];
					if(i != 0 && (row[0] === "EOS" || row[0] === "*")){
						item[2] = mecabList;
						depres.push(item);
						item = [0, "", []];
						mecabList = [];
					}
					if(row[0] === "EOS") break;
					if(row[0] === "*"){
						item[0] = parseInt(
							row[2].substring(0, row[2].length - 1));
						score = row[4];
					} else{
						item[1] += row[0];
						mecabs.push(row);
						mecabList.push(mecabs.length - 1);
						var scr = Number(score);

						//scores.push(row[0]);
						scores.push(scr);
					}
				}
				var normScores = [];
				var scrmin = Math.min.apply(null, scores);
				var scrmax = Math.max.apply(null, scores);
				for(var i=0; i < scores.length; i++){
					normScores[i] = (scores[i] - scrmin) / (scrmax - scrmin);
				}
				for(var i = 0; i< mecabs.length; i++){
					if(mecabs[i][0] === "動詞" || mecabs[i] === "形容詞" || mecabs[i] === "形容動詞" || mecabs[i] === "名詞"){
						normScores[i] *= 2;
					}
				}
				var ret = {
					depRels: depres,
					words: mecabs,
					scores: normScores,
					//types: types
				};
				that.f(ret);
	 */

