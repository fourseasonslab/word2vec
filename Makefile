CC = gcc
#Using -Ofast instead of -O3 might result in faster code, but is supported only by newer GCC versions
CFLAGS = -pthread -O3 -march=native -Wall -funroll-loops -Wno-unused-result
LDFLAGS = -Wl,--no-as-needed -lm

TARGETS = word2vec word2phrase distance word-analogy compute-accuracy node-word2vec

all: $(TARGETS)

word2vec : word2vec.c
	$(CC) $(LDFLAGS) word2vec.c -o word2vec $(CFLAGS)
word2phrase : word2phrase.c
	$(CC) $(LDFLAGS) word2phrase.c -o word2phrase $(CFLAGS)
distance : distance.c
	$(CC) $(LDFLAGS) distance.c -o distance $(CFLAGS)
word-analogy : word-analogy.c
	$(CC) $(LDFLAGS) word-analogy.c -o word-analogy $(CFLAGS)
compute-accuracy : compute-accuracy.c
	$(CC) $(LDFLAGS) compute-accuracy.c -o compute-accuracy $(CFLAGS)
	chmod +x *.sh

get-vector : get-vector.c 
	$(CC) $(LDFLAGS) get-vector.c -o get-vector $(CFLAGS)

vec2word : vec2word.c 
	$(CC) $(LDFLAGS) vec2word.c -o vec2word $(CFLAGS)

clean:
	rm -rf $(TARGETS)
