.PHONY: build watch

build:
	cd build && pipenv install && pipenv run python build.py

watch:
	watchexec -w posts -w build -w css -w index.html -- $(MAKE) build
