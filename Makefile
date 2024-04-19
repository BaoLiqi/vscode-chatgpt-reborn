vsix:
	vsce package

share: vsix
	cp ./*.vsix ~/share