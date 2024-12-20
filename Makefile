
vsix:
	rm -f ./*.vsix
	time vsce package

share: 
	cp ./*.vsix ~/share

install: 
	code --install-extension *.vsix

http:
	yarn build:webview
	python3 -m http.server 8000 --directory ./out
	
clean:
	rm -rf out
	rm -f *.vsix