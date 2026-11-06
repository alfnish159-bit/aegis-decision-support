"""Build standalone HTML views with a local embedded font; no network requests required."""
from pathlib import Path
import base64
L = Path(__file__).resolve().parents[1]
U = L / 'ui'
font = base64.b64encode((U / 'fonts/GolosText.ttf').read_bytes()).decode('ascii')
css = (U / 'styles.css').read_text().replace('FONT_DATA', font)
for view in ('console', 'docs'):
    head = (U / 'head.html').read_text()
    if view == 'docs':
        head = head.replace('Aegis · Оперативный журнал', 'Aegis REST API · Документация')
        head = head.replace('Aegis — журнал происшествий и координация ресурсов реагирования.', 'Контракт Aegis REST API: методы, параметры, ответы и проверка запросов.')
    extra = (U / 'docs.css').read_text() if view == 'docs' else ''
    body = (U / (view + '.body.html')).read_text()
    script = (U / (view + '.js')).read_text()
    (L / 'public' / (view + '.html')).write_text(head + '<style>' + css + extra + '</style></head><body>' + body + '<script>' + script + '</script></body></html>')
(L / 'public/GolosText-OFL.txt').write_text((U / 'fonts/GolosText-OFL.txt').read_text())
print('Built public/console.html and public/docs.html')
