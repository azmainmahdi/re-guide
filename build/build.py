"""Build dist/ from build/: one index.html with icons, the guide reader and the sample inlined, plus the fonts.
Run from the repo root: python3 build/build.py"""
import json, pathlib, re, shutil

B = pathlib.Path(__file__).parent
ROOT = B.parent
DIST = ROOT / 'dist'
FONTS = ROOT / 'node_modules' / '@fontsource'
SUBSETS = ('latin', 'latin-ext', 'bengali')

icons = json.loads((B / 'icons.json').read_text())
s = (B / 'app.src.html').read_text()
s = re.sub(r'__I_([a-z0-9-]+)__', lambda m: f'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{icons[m[1]]}</svg>', s)
s = s.replace('__ICONS__', json.dumps(icons))
s = s.replace('/*__GUIDE_JS__*/', (B / 'guide.js').read_text())
sample = next((ROOT / 'sample').glob('*.md'))
s = s.replace('/*__SAMPLE__*/null', json.dumps({'name': sample.name, 'text': sample.read_text()}, ensure_ascii=False))
assert '__I_' not in s and '/*__' not in s, 'a placeholder was left in the page'

if DIST.exists():
    shutil.rmtree(DIST)
(DIST / 'fonts').mkdir(parents=True)
(DIST / 'index.html').write_text(s)


def font_css(pkg, weights):
    out = []
    for w in weights:
        for name, rule in re.findall(r'/\* ([\w-]+) \*/\s*(@font-face \{.*?\})', (FONTS / pkg / f'{w}.css').read_text(), re.S):
            if not any(name == f'{pkg}-{sub}-{w}-normal' for sub in SUBSETS):
                continue
            f = re.search(r'url\(\./files/([^)]+\.woff2)\)', rule)[1]
            (DIST / 'fonts' / pkg).mkdir(exist_ok=True)
            shutil.copy(FONTS / pkg / 'files' / f, DIST / 'fonts' / pkg / f)
            out.append(re.sub(r'src:[^;]+;', f"src: url({pkg}/{f}) format('woff2');", rule))
    return '\n'.join(out)


(DIST / 'fonts' / 'ui.css').write_text(font_css('manrope', [400, 500, 600, 700]) + '\n' + font_css('bricolage-grotesque', [700]))
(DIST / 'fonts' / 'noto-sans-bengali.css').write_text(font_css('noto-sans-bengali', [400, 500, 600]))
print(f"built dist/ ({sum(f.stat().st_size for f in DIST.rglob('*') if f.is_file()) // 1024} KB)")
