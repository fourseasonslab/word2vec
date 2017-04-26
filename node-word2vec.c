#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

const long long max_size = 2000;         // max length of strings
const long long N = 40;                  // number of closest words that will be shown
const long long max_w = 50;              // max length of vocabulary entries
float *M;
char *vocab;
long long words, size;
char *bestw[N];

void word2vec()
{
	long long a, b;
	char s[max_size], word[max_size];
	if(!fgets(s, sizeof(s), stdin)) return;
	sscanf(s, "%s", word);
	for (b = 0; b < words; b++) if (!strcmp(&vocab[b * max_w], word)) break;
	if (b == words) b = -1;
	printf("%lld\n", b);
	if (b != -1){
		printf("%lld\n", size);
		for(a=0; a<size; a++){
			printf("%f ", M[a + b * size]);
		}
		printf("\n");
	}
	fflush(stdout);
}

void vec2word()
{
	long long a, b, n, c, d;
	float dist, len, bestd[N], vec[max_size];
	double tf;
	long long cn, bi[100];
	for (a = 0; a < N; a++) bestd[a] = 0;
	for (a = 0; a < N; a++) bestw[a][0] = 0;
	a = 0;
	if(scanf("%lld", &n) != 1) return; //word count to get
	if(n <= 0 || N < n) n = N;
	//
	cn = 0;
	for(a = 0; a < size; a++){
		if(scanf("%lf", &tf) != 1) return;
		vec[a] = (float)tf;
	}
	len = 0;
	for(a = 0; a < size; a++){
		len += vec[a] * vec[a];
	}
	len = sqrt(len);
	for(a = 0; a < size; a++){
		vec[a] /= len;
	}
	if(a < size) return;
	for (a = 0; a < n; a++) bestd[a] = -1;
	for (a = 0; a < n; a++) bestw[a][0] = 0;
	for (c = 0; c < words; c++) {
		a = 0;
		for (b = 0; b < cn; b++) if (bi[b] == c) a = 1;
		if (a == 1) continue;
		dist = 0;
		for (a = 0; a < size; a++) dist += vec[a] * M[a + c * size];
		for (a = 0; a < n; a++) {
			if (dist > bestd[a]) {
				for (d = n - 1; d > a; d--) {
					bestd[d] = bestd[d - 1];
					strcpy(bestw[d], bestw[d - 1]);
				}
				bestd[a] = dist;
				strcpy(bestw[a], &vocab[c * max_w]);
				break;
			}
		}
	}
	for (a = 0; a < n; a++) printf("%s\t%f\n", bestw[a], bestd[a]);
	fflush(stdout);
	char s[256];
	if(!fgets(s, sizeof(s), stdin)) return;
}

int main(int argc, char **argv) {
	FILE *f;
	char s[max_size];
	char file_name[max_size];
	float len;
	long long a, b;
	if (argc < 2) {
		printf("Usage: %s <vectors.bin>\n", argv[0]);
		return 0;
	}

	fflush(stdout);

	strcpy(file_name, argv[1]);
	f = fopen(file_name, "rb");
	if (f == NULL) {
		printf("Vector file not found\n");
		return -1;
	}
	fscanf(f, "%lld", &words);
	fscanf(f, "%lld", &size);
	vocab = (char *)malloc((long long)words * max_w * sizeof(char));
	for (a = 0; a < N; a++) bestw[a] = (char *)malloc(max_size * sizeof(char));

	fflush(stdout);

	M = (float *)malloc((long long)words * (long long)size * sizeof(float));
	if (M == NULL) {
		printf("MALLOC ERROR: %lld MB\n",
				(long long)words * size * sizeof(float) / (1024 * 1024));
		return -1;
	}
	for (b = 0; b < words; b++) {
		a = 0;
		while (1) {
			vocab[b * max_w + a] = fgetc(f);
			if (feof(f) || (vocab[b * max_w + a] == ' ')) break;
			if ((a < max_w) && (vocab[b * max_w + a] != '\n')) a++;
		}
		vocab[b * max_w + a] = 0;
		for (a = 0; a < size; a++) fread(&M[a + b * size], sizeof(float), 1, f);
		len = 0;
		for (a = 0; a < size; a++) len += M[a + b * size] * M[a + b * size];
		len = sqrt(len);
		for (a = 0; a < size; a++) M[a + b * size] /= len;
	}
	fclose(f);

	//printf("READY\n");
	for(;;){
		if(!fgets(s, sizeof(s), stdin)) break;
		if(strncmp(s, "word2vec", 8) == 0){
			word2vec();
		} else if(strncmp(s, "vec2word", 8) == 0){
			vec2word();
		} else{
			fputs("Unknown command", stderr);
			return 0;
		}
	}

	return 0;
}

