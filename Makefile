.PHONY: build watch serve

build:
	cd build && pipenv install && pipenv run python build.py

watch:
	watchexec -w markdown -w build -w css -w index.html -- $(MAKE) build

serve:
	python3 -m http.server 8000
