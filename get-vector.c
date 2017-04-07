#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

const long long max_size = 2000;         // max length of strings
const long long N = 40;                  // number of closest words that will be shown
const long long max_w = 50;              // max length of vocabulary entries

int main(int argc, char **argv) {
	FILE *f;
	char s[max_size];
	char file_name[max_size];
	float len;
	long long words, size, a, b;
	float *M;
	char *vocab;
	if (argc < 2) {
		printf("Usage: ./distance <vectors.bin>\n");
		return 0;
	}

	fflush(stdout);

	strcpy(file_name, argv[1]);
	f = fopen(file_name, "rb");
	if (f == NULL) {
		printf("Input file not found\n");
		return -1;
	}
	fscanf(f, "%lld", &words);
	fscanf(f, "%lld", &size);
	vocab = (char *)malloc((long long)words * max_w * sizeof(char));

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

	while(fgets(s, sizeof(s), stdin)){
		a = strlen(s);
		if(a) s[a - 1] = 0;
		// if (!strcmp(st1, "EXIT")) break;
		for (b = 0; b < words; b++) if (!strcmp(&vocab[b * max_w], s)) break;
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

	return 0;
}
