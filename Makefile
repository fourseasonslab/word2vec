CC = gcc
#Using -Ofast instead of -O3 might result in faster code, but is supported only by newer GCC versions
CFLAGS = -pthread -O3 -march=native -Wall -funroll-loops -Wno-unused-result

OS=$(shell lsb_release -si)

ifeq ($(OS),Ubuntu)
# for Ubuntu
LDFLAGS = -Wl,--no-as-needed -lm
else
# for others
LDFLAGS = -lm
endif

TARGETS = bin/word2vec bin/word2phrase bin/distance bin/word-analogy bin/compute-accuracy bin/node-word2vec

all:
	make bin
	tsc

bin: $(TARGETS)

bin/% : src/%.c Makefile
	$(CC) $(LDFLAGS) src/$*.c -o bin/$* $(CFLAGS)

clean:
	rm -rf $(TARGETS)
