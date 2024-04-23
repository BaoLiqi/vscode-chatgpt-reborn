all: share install

vsix:
	vsce package

share: vsix
	cp ./*.vsix ~/share

install: vsix
	code --install-extension *.vsix

.PHONY: share install all