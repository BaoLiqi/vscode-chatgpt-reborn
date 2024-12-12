
vsix:
	rm -f ./*.vsix
	vsce package

share: 
	cp ./*.vsix ~/share

install: 
	code --install-extension *.vsix

webview:
	mkdir -p out
	cp ./src/renderer/index.html out/
	npx esbuild ./src/renderer/index.tsx --bundle --outfile=out/webview.bundle.js

tailwind:
	mkdir -p out
	npx tailwindcss -i ./styles/main.css -o ./out/tailwind_out.css

clean:
	rm -rf out
	rm -f *.vsix