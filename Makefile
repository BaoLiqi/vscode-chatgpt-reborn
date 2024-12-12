
vsix:
	rm -f ./*.vsix
	vsce package

share: 
	cp ./*.vsix ~/share

install: 
	code --install-extension *.vsix

webview:tailwind
	mkdir -p out
	npx esbuild ./src/renderer/index.tsx --bundle --outfile=out/webview.bundle.js

tailwind:
	mkdir -p out
	npx tailwindcss -i ./styles/main.css -o ./out/tailwind_out.css

clean:
	rm -rf out
	rm -f *.vsix