"""Rebuild name-bearing artwork from the approved native vectors.

Run: python3 source/build_assets.py from anywhere after installing requirements.
This never redraws the portrait or modifies the supplied favicon/avatar PNGs.
"""
from pathlib import Path
import html, json, math
import xml.etree.ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg

OUT = Path(__file__).resolve().parents[1]
NAME = 'The Aussie Pom'
LINE = 'Software, systems and curiosity in action.'
DOMAIN = 'theaussiepom.me'
PAPER, INK, DARK, PALE, LILAC = '#FAF8F3', '#252535', '#1B1B27', '#F1EEE8', '#E2D7F5'
PURPLE, LIGHTPURPLE, BLACK = '#62429A', '#CBB5F1', '#000000'
font = TTFont(OUT/'source/fonts/LiberationSans-Bold.ttf')
glyphs, cmap, units = font.getGlyphSet(), font.getBestCmap(), font['head'].unitsPerEm
kern = {}
for table in font['kern'].kernTables:
    kern.update(table.kernTable)
root = ET.parse(OUT/'source/tap-portrait-master.svg').getroot()
AW, AH = float(root.get('width')), float(root.get('height'))
named = [el for el in root.iter() if el.get('id')]
assert len(named) == 6
ART = ''.join(f'<path id="{el.get("id")}" d="{el.get("d")}" transform="{el.get("transform")}"/>' for el in named)
BOUNDS = []

def typography(text, size, x=0, y=0, colour=INK, tracking=-.025):
    pen = SVGPathPen(glyphs)
    pos, previous = 0, None
    for ch in text:
        name = cmap[ord(ch)]
        if previous:
            pos += kern.get((previous, name), 0)/units*size
        glyphs[name].draw(TransformPen(pen, (size/units, 0, 0, -size/units, x+pos, y)))
        pos += font['hmtx'][name][0]/units*size + tracking*size
        previous = name
    return f'<path fill="{colour}" d="{pen.getCommands()}"/>', pos-tracking*size

def textline(text, size, x, y, colour, max_width=None):
    a, width = typography(text, size, x, y, colour)
    if max_width is not None:
        assert width <= max_width, (text, width, max_width)
    BOUNDS.append({'text': text, 'size': size, 'x': x, 'baseline': y, 'width': width, 'max_width': max_width})
    return a

def badge(x, y, d, backing=LILAC):
    w, h = d*.68, d*.87
    s = min(w/AW, h/AH)
    xx, yy = x+d*.145+(w-AW*s)/2, y+d*.065+(h-AH*s)/2
    return f'<circle cx="{x+d/2}" cy="{y+d/2}" r="{d/2}" fill="{backing}"/><g fill="{BLACK}" transform="translate({xx:.5f} {yy:.5f}) scale({s:.8f})">{ART}</g>'

def svg(w, h, body, title=NAME, description=None):
    desc = f'<desc>{html.escape(description)}</desc>' if description else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:g}" height="{h:g}" viewBox="0 0 {w:g} {h:g}" role="img" aria-label="{html.escape(title, quote=True)}"><title>{html.escape(title)}</title>{desc}{body}</svg>'

def save_svg(path, w, h, body, title=NAME, png_width=None, pdf=False, description=None):
    data = svg(w, h, body, title, description)
    p = OUT/path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(data)
    if png_width:
        q = (OUT/str(path).replace('/svg/', '/png/')).with_suffix('.png')
        q.parent.mkdir(parents=True, exist_ok=True)
        cairosvg.svg2png(bytestring=data.encode(), write_to=str(q), output_width=png_width)
    if pdf:
        q = (OUT/str(path).replace('/svg/', '/pdf/')).with_suffix('.pdf')
        q.parent.mkdir(parents=True, exist_ok=True)
        cairosvg.svg2pdf(bytestring=data.encode(), write_to=str(q))

def lockup(mode, variant='on-light'):
    colour = {'on-light':INK,'on-dark':PALE,'black':BLACK,'white':'#FFFFFF','purple':PURPLE}[variant]
    back = '#FFFFFF' if variant == 'black' else LILAC
    if mode == 'primary':
        a, _ = typography('The', 54, 376, 126, colour)
        b, bw = typography('Aussie Pom', 104, 376, 244, colour)
        return math.ceil(376+bw+28), 360, badge(24,24,312,back)+a+b
    if mode == 'compact':
        a, _ = typography('The', 40, 200, 72, colour)
        b, bw = typography('Aussie Pom', 78, 200, 158, colour)
        return math.ceil(200+bw+24), 208, badge(12,24,160,back)+a+b
    if mode == 'horizontal':
        a, aw = typography(NAME, 80, 188, 115, colour)
        return math.ceil(188+aw+24), 176, badge(16,16,144,back)+a
    if mode == 'masthead':
        a, aw = typography(NAME, 52, 112, 71, colour)
        return math.ceil(112+aw+16), 104, badge(8,12,80,back)+a
    a, aw = typography(NAME, 100, 12, 96, colour)
    return math.ceil(aw+24), 130, a

def build():
    geometries = {}
    for mode in ['primary','horizontal','masthead','compact','wordmark']:
        variants = ['on-light','on-dark','black'] if mode != 'wordmark' else ['on-light','on-dark','black','white','purple']
        for variant in variants:
            w,h,body = lockup(mode,variant)
            geometries[mode] = [w,h]
            save_svg(f'logos/svg/tap-{mode}-{variant}.svg',w,h,body,png_width=1200 if mode in ['masthead','compact'] else 2400,pdf=True)
    # Large-context artwork carries the supporting line. Header logos do not.
    for theme, bg, foreground, accent in [('light',PAPER,INK,PURPLE),('dark',DARK,PALE,LIGHTPURPLE)]:
        body = f'<rect width="1600" height="400" fill="{bg}"/>'+badge(76,64,272)
        body += textline(NAME,96,400,183,foreground,1124)
        body += textline(LINE,36,404,258,accent,1120)
        body += textline(DOMAIN,24,406,318,foreground,1118)
        save_svg(f'banners/tap-masthead-{theme}.svg',1600,400,body,png_width=1600,description=LINE)
        body = f'<rect width="1500" height="500" fill="{bg}"/>'+badge(76,92,300)
        body += textline(NAME,92,432,218,foreground,992)
        body += textline(LINE,34,436,291,accent,988)
        body += textline(DOMAIN,24,438,351,foreground,986)
        save_svg(f'social/tap-social-banner-{theme}.svg',1500,500,body,png_width=1500,description=LINE)
        body = f'<rect width="1200" height="630" fill="{bg}"/>'+badge(64,120,320)
        body += textline('The',46,438,194,foreground,698)
        body += textline('Aussie Pom',96,434,306,foreground,702)
        body += textline('Software, systems',34,440,384,accent,696)
        body += textline('and curiosity in action.',34,440,431,accent,696)
        body += textline('Ben Dennis',24,72,554,foreground,450)
        d,dw = typography(DOMAIN,24,colour=foreground,tracking=0)
        body += f'<g transform="translate({1128-dw} 554)">{d}</g>'
        save_svg(f'social/tap-opengraph-{theme}.svg',1200,630,body,png_width=1200,description=LINE)
        # Keep essential text away from LinkedIn's lower-left profile-photo area.
        body = f'<rect width="1584" height="396" fill="{bg}"/>'
        body += textline(NAME,72,430,142,foreground,1074)
        body += textline(LINE,31,434,215,accent,1070)
        body += textline('Ben Dennis  /  '+DOMAIN,23,436,272,foreground,1068)
        save_svg(f'social/tap-linkedin-cover-{theme}.svg',1584,396,body,png_width=1584,description=LINE)
    w,h,_ = lockup('primary')
    live = badge(24,24,312)+'<g fill="#252535" font-family="Liberation Sans" font-weight="700" letter-spacing="-2.6"><text x="376" y="126" font-size="54" letter-spacing="-1.35">The</text><text x="376" y="244" font-size="104">Aussie Pom</text></g>'
    save_svg('source/tap-primary-editable-text.svg',w,h,live)
    tokens = {'name':NAME,'author':'Ben Dennis','supporting_line':LINE,'version':'3.0','date':'2026-11-12','website':'https://theaussiepom.me/','profiles':{'github':'https://github.com/theaussiepom','linkedin':'https://www.linkedin.com/in/theaussiepom/'},'portrait':{'ink':BLACK,'main_backing':LILAC,'favicon_backing':'#FFFFFF','invert_face':False},'light':{'paper':PAPER,'ink':INK,'accent':PURPLE,'feature':LILAC},'dark':{'paper':DARK,'ink':PALE,'accent':LIGHTPURPLE,'feature':'#332B46'},'hero':{'background':INK,'heading':'#FFFFFF','body':'#EEEAF3','label':'#DFD0FA'},'typography':{'website_ui':'Arial, Helvetica, sans-serif','website_reading':"Georgia, 'Times New Roman', serif",'logo_source':'Liberation Sans Bold; outlined in production SVGs'}}
    (OUT/'web').mkdir(exist_ok=True)
    (OUT/'web/brand-tokens.json').write_text(json.dumps(tokens,indent=2)+'\n')
    (OUT/'source/build-info.json').write_text(json.dumps({'version':'3.0','canvases':geometries,'text_bounds':BOUNDS},indent=2)+'\n')
    print(json.dumps({'built':NAME,'canvases':geometries,'measured_text_lines':len(BOUNDS)},indent=2))

if __name__ == '__main__':
    build()
