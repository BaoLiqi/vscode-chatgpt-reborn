all: vsix share install

vsix:
	rm -f ./*.vsix
	vsce package

share: 
	cp ./*.vsix ~/share

install: 
	code --install-extension *.vsix

.PHONY: share install all