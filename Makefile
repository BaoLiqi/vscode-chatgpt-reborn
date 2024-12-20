
vsix:
	rm -f ./*.vsix
	time vsce package

share: 
	cp ./*.vsix ~/share

install: 
	code --install-extension *.vsix

clean:
	rm -rf out
	rm -f *.vsix