#!/usr/bin/env python3
"""Hero reference v3 — painterly render per the full prompt."""
import io
import math
import sys
from pathlib import Path

import cairosvg
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "hero-reference-v3.png"

W, H = 1920, 1080
HORIZON = 600
SUN_X, SUN_Y = 800, HORIZON - 8
rng = np.random.default_rng(11)

ZENITH = "#060e1c"
NAVY = "#0a1828"
INDIGO = "#132240"
MIDSKY = "#1a3154"
AMBER = "#c8833a"
GOLD = "#f5c96a"
HOT = "#fff4d6"
TEALSKY = "#1a4a5e"
W1 = "#1b3a52"
W2 = "#143049"
W3 = "#0a1e30"
W4 = "#060f1a"
HILL_A = "#3a536b"
HILL_B = "#22394f"
HILL_C = "#101d2e"
FOAM = "#dde8f0"
PAPER = "#e8dfc8"
INK = "#0c2340"
RED = "#b03040"
AMB2 = "#e8a830"
KELP1 = "#1e5c50"
KELP2 = "#287060"


def render(svg, w=W, h=H, alpha=False):
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=w, output_height=h)
    img = Image.open(io.BytesIO(png))
    return img.convert("RGBA" if alpha else "RGB")


def hexrgb(c):
    c = c.lstrip("#")
    return tuple(int(c[i : i + 2], 16) for i in (0, 2, 4))


def main():
    print("sky...")
    ys = np.linspace(0, 1, H)[:, None]
    stops = [
        (0.00, ZENITH),
        (0.16, NAVY),
        (0.36, INDIGO),
        (0.52, MIDSKY),
        (0.64, AMBER),
        (0.72, GOLD),
        (0.76, HOT),
        (0.80, TEALSKY),
        (1.00, W4),
    ]
    sky = np.zeros((H, W, 3), np.float32)
    pos = np.array([s[0] for s in stops])
    cols = np.array([hexrgb(s[1]) for s in stops], np.float32)
    for ch in range(3):
        sky[:, :, ch] = np.interp(ys[:, 0], pos, cols[:, ch])[:, None]

    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - SUN_X) / 620) ** 2 + ((yy - SUN_Y) / 360) ** 2)
    bloom = np.clip(1 - d, 0, 1) ** 2.2
    hot = np.array(hexrgb(HOT), np.float32)
    gold = np.array(hexrgb(GOLD), np.float32)
    bloom_col = hot * np.clip(1 - d * 2.2, 0, 1)[..., None] ** 1.5 + gold * bloom[..., None] * 0.85
    sky = np.clip(sky + bloom_col * 0.9, 0, 255)

    low = rng.normal(0, 1, (H // 28 + 1, W // 28 + 1, 1)).repeat(28, 0).repeat(28, 1)[:H, :W]
    low = np.asarray(
        Image.fromarray(((low - low.min()) / (np.ptp(low) or 1) * 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(18)
        ),
        np.float32,
    )[..., None]
    low = (low - low.mean()) / 40
    fine = rng.normal(0, 1, (H, W, 1)) * 3.2
    sky = np.clip(sky * (1 + low * 0.06) + fine, 0, 255)
    sky_img = Image.fromarray(sky.astype(np.uint8), "RGB")

    scrim = Image.new("L", (W, H), 0)
    ds = ImageDraw.Draw(scrim)
    ds.ellipse([W // 2 - 760, 60, W // 2 + 760, 560], fill=110)
    scrim = scrim.filter(ImageFilter.GaussianBlur(120))
    dark = Image.new("RGB", (W, H), (4, 9, 15))
    sky_img = Image.composite(Image.blend(sky_img, dark, 0.5), sky_img, scrim)

    print("clouds...")

    def cloud(cx, cy, s, body, shadow, rim, lit):
        lobes = [
            (-1.9, 0.2, 0.55),
            (-1.05, -0.42, 0.78),
            (-0.25, -0.68, 0.95),
            (0.62, -0.45, 0.82),
            (1.55, -0.08, 0.62),
            (0.12, -0.02, 1.05),
            (0.95, 0.1, 0.7),
        ]
        g = f'<g><ellipse cx="{cx}" cy="{cy + s * 30:.0f}" rx="{s * 118:.0f}" ry="{s * 24:.0f}" fill="{shadow}" opacity="0.75"/>'
        for dx, dy, r in lobes:
            lx, ly = cx + dx * s * 46, cy + dy * s * 34
            g += f'<ellipse cx="{lx:.0f}" cy="{ly - s * 5:.0f}" rx="{r * s * 58:.0f}" ry="{r * s * 24:.0f}" fill="{lit}" opacity="0.30"/>'
            g += f'<ellipse cx="{lx:.0f}" cy="{ly:.0f}" rx="{r * s * 58:.0f}" ry="{r * s * 42:.0f}" fill="{body}"/>'
        g += f'<path d="M{cx - s * 120:.0f},{cy + s * 28:.0f} Q{cx},{cy + s * 50:.0f} {cx + s * 120:.0f},{cy + s * 28:.0f}" stroke="{rim}" stroke-width="{s * 6:.1f}" fill="none" opacity="0.6" stroke-linecap="round"/>'
        g += f'<ellipse cx="{cx - s * 16:.0f}" cy="{cy - s * 30:.0f}" rx="{s * 36:.0f}" ry="{s * 15:.0f}" fill="{lit}" opacity="0.25"/></g>'
        return g

    clouds_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
{cloud(250, 170, 1.65, "#3a4d6e", "#1c2b44", "#c8913a", "#8593ba")}
{cloud(470, 300, 1.0, "#2c3c56", "#16233a", "#a87828", "#66759c")}
{cloud(1530, 160, 1.45, "#3a4d6e", "#1c2b44", "#c8913a", "#8593ba")}
{cloud(1700, 300, 0.95, "#2c3c56", "#16233a", "#a87828", "#66759c")}
{cloud(1000, 90, 0.75, "#2c3c56", "#16233a", "#c8913a", "#70809f")}
</svg>"""
    clouds = render(clouds_svg, alpha=True).filter(ImageFilter.GaussianBlur(2.2))
    sky_img.paste(clouds, (0, 0), clouds)

    gull_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
<g fill="none" stroke="#aebccc" stroke-width="3" stroke-linecap="round">
<path d="M870 150 q14 -12 26 0 q12 -12 26 0"/>
<path d="M1060 110 q10 -9 19 0 q9 -9 19 0" stroke-width="2.4"/>
<path d="M540 200 q11 -10 21 0 q10 -10 21 0" stroke-width="2.6"/>
<path d="M1290 175 q9 -8 17 0 q8 -8 17 0" stroke-width="2.2" stroke="#92a2b6"/>
</g></svg>"""
    g_im = render(gull_svg, alpha=True)
    sky_img.paste(g_im, (0, 0), g_im)

    print("hills...")

    def hillpath(y0, amp, wl, ph, fill, op, h=2):
        pts = []
        x = -60
        while x <= W + 60:
            y = y0
            for i in range(h):
                y += (amp / (i * 0.6 + 1)) * math.sin((x / (wl / (i * 0.45 + 1))) + ph + i * 0.9)
            pts.append((x, y))
            x += 18
        d = f"M-60,{H} L" + " L".join(f"{p[0]:.0f},{p[1]:.0f}" for p in pts) + f" L{W + 60},{H} Z"
        return f'<path d="{d}" fill="{fill}" opacity="{op}"/>'

    hills_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
{hillpath(HORIZON + 2, 30, 560, 0.6, HILL_A, 0.55, 3)}
{hillpath(HORIZON + 10, 46, 380, 2.2, HILL_B, 0.88)}
{hillpath(HORIZON + 16, 34, 260, 4.1, HILL_C, 1.0)}
</svg>"""
    hills = render(hills_svg, alpha=True).filter(ImageFilter.GaussianBlur(1.4))
    sky_img.paste(hills, (0, 0), hills)

    base = sky_img

    print("water brushstrokes...")
    grad = np.zeros((H, W, 3), np.float32)
    wpos = np.array([0, 0.35, 1.0])
    wcols = np.array([hexrgb(W1), hexrgb(W2), hexrgb(W4)], np.float32)
    span = H - (HORIZON + 14)
    yy2 = np.clip((np.arange(H) - (HORIZON + 14)) / span, 0, 1)
    for ch in range(3):
        grad[:, :, ch] = np.interp(yy2, wpos, wcols[:, ch])[:, None]
    mask = (np.arange(H) >= HORIZON + 14)[:, None].repeat(W, 1)
    gimg = Image.fromarray(grad.astype(np.uint8), "RGB")
    base = Image.composite(gimg, base, Image.fromarray((mask * 255).astype(np.uint8), "L"))

    strokes = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dstr = ImageDraw.Draw(strokes)
    for _ in range(950):
        y = HORIZON + 18 + (rng.random() ** 1.6) * (H - HORIZON - 40)
        x = rng.random() * W
        depth = (y - (HORIZON + 18)) / (H - HORIZON - 18)
        ln = 26 + depth * 120 * rng.random()
        amp = 1.2 + depth * 3.6
        sheen_d = abs(x - SUN_X) / 300
        warm = max(0, 1 - sheen_d) * max(0, 1 - depth * 1.15)
        col = hexrgb(W1) if rng.random() < 0.5 else hexrgb("#27506e")
        if warm > 0.15 and rng.random() < warm:
            col = hexrgb(GOLD) if rng.random() < 0.5 else hexrgb("#d9b06a")
            a = int(60 + 90 * warm)
        else:
            a = int(28 + 50 * (1 - depth) + rng.random() * 30)
        pts = []
        seg = int(ln // 8) + 3
        ph = rng.random() * 6.28
        for s in range(seg):
            px = x + s * 8
            py = y + amp * math.sin(ph + s * 0.9)
            pts.append((px, py))
        dstr.line(pts, fill=col + (a,), width=max(1, int(1 + depth * 2.4)))
    strokes = strokes.filter(ImageFilter.GaussianBlur(0.5))
    base.paste(strokes, (0, 0), strokes)

    foam = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    df = ImageDraw.Draw(foam)
    pts = [(x, HORIZON + 16 + 3.5 * math.sin(x / 85) + 1.5 * math.sin(x / 31)) for x in range(-10, W + 10, 8)]
    df.line(pts, fill=hexrgb(FOAM) + (150,), width=3)
    pts2 = [(x, HORIZON + 22 + 2.5 * math.sin(x / 70 + 2)) for x in range(-10, W + 10, 10)]
    df.line(pts2, fill=hexrgb(FOAM) + (60,), width=2)
    foam = foam.filter(ImageFilter.GaussianBlur(0.7))
    base.paste(foam, (0, 0), foam)

    print("props...")

    def lighthouse(tx, ty, s):
        return f"""<g transform="translate({tx},{ty}) scale({s})">
<ellipse cx="60" cy="196" rx="64" ry="12" fill="#04101c" opacity="0.7"/>
<path d="M10 190 Q32 174 60 182 Q88 174 110 190 Q88 202 60 204 Q32 202 10 190 Z" fill="#16293c"/>
<path d="M14 188 Q40 178 60 184" stroke="#0a1c2c" stroke-width="3" fill="none" opacity="0.6"/>
<path d="M42 62 L78 62 L84 184 L36 184 Z" fill="#ddd5be"/>
<path d="M60 62 L78 62 L84 184 L60 184 Z" fill="#c0b69e"/>
<path d="M40 100 L80 100 L81.5 122 L38.5 122 Z" fill="{RED}"/>
<path d="M60 100 L80 100 L81.5 122 L60 122 Z" fill="#8a2232"/>
<path d="M37.5 150 L82.5 150 L83.5 166 L36.5 166 Z" fill="{RED}"/>
<path d="M60 150 L82.5 150 L83.5 166 L60 166 Z" fill="#8a2232"/>
<rect x="53" y="160" width="14" height="22" rx="7" fill="#16293c"/>
<circle cx="51" cy="132" r="4" fill="#16293c"/><circle cx="51" cy="88" r="4" fill="#16293c"/>
<path d="M34 62 L86 62 L89 72 L31 72 Z" fill="#0e1c2e"/>
<path d="M37 64 L83 64" stroke="{PAPER}" stroke-width="1.6" opacity="0.45"/>
<rect x="44" y="32" width="32" height="28" rx="3" fill="#0c1a2c"/>
<rect x="48" y="36" width="24" height="20" rx="2" fill="{GOLD}"/>
<rect x="55" y="34" width="10" height="24" fill="{HOT}" opacity="0.95"/>
<path d="M42 32 L78 32 L60 8 Z" fill="{RED}"/>
<circle cx="60" cy="6" r="4" fill="{AMB2}"/></g>"""

    def dory(tx, ty, s):
        return f"""<g transform="translate({tx},{ty}) scale({s})">
<ellipse cx="87" cy="98" rx="76" ry="10" fill="#04101c" opacity="0.55"/>
<path d="M12 46 Q87 58 162 46 Q140 94 87 98 Q34 94 12 46 Z" fill="#cfc6ae"/>
<path d="M14 50 Q87 60 160 50" stroke="#a89a7e" stroke-width="2.5" fill="none" opacity="0.8"/>
<path d="M18 58 Q87 68 156 58" stroke="#a89a7e" stroke-width="2" fill="none" opacity="0.6"/>
<path d="M28 56 Q87 66 146 56 Q128 82 87 86 Q46 82 28 56 Z" fill="#18293f"/>
<line x1="58" y1="62" x2="58" y2="82" stroke="{PAPER}" stroke-width="3" opacity="0.65"/>
<line x1="87" y1="64" x2="87" y2="84" stroke="{PAPER}" stroke-width="3" opacity="0.65"/>
<line x1="116" y1="62" x2="116" y2="82" stroke="{PAPER}" stroke-width="3" opacity="0.65"/>
<path d="M12 46 Q87 58 162 46" stroke="{PAPER}" stroke-width="3.2" fill="none" opacity="0.8"/>
<line x1="87" y1="48" x2="87" y2="6" stroke="{INK}" stroke-width="3.2"/>
<path d="M87 8 L118 20 L87 34 Z" fill="{PAPER}" opacity="0.92"/>
<path d="M87 8 L118 20 L87 34" stroke="{AMB2}" stroke-width="1.2" fill="none" opacity="0.6"/>
<path d="M87 6 L106 11 L87 16 Z" fill="{RED}"/></g>"""

    def buoy(tx, ty, s):
        return f"""<g transform="translate({tx},{ty}) scale({s})">
<ellipse cx="36" cy="108" rx="32" ry="8" fill="#04101c" opacity="0.55"/>
<path d="M14 102 Q14 54 36 48 Q58 54 58 102 Z" fill="#ddd5be"/>
<path d="M36 48 Q58 54 58 102 L36 102 Z" fill="#c0b69e"/>
<path d="M16 74 Q36 69 56 74 L56 90 Q36 85 16 90 Z" fill="{RED}"/>
<path d="M36 69 L56 74 L56 90 L36 85 Z" fill="#8a2232"/>
<path d="M23 48 L49 48 L45 34 L27 34 Z" fill="#16293c"/>
<circle cx="36" cy="27" r="9" fill="{AMB2}"/><circle cx="36" cy="27" r="4.5" fill="{HOT}"/>
<path d="M36 108 Q29 124 33 140" stroke="{INK}" stroke-width="2.4" fill="none" stroke-dasharray="5 4" opacity="0.55"/></g>"""

    def rope(tx, ty, s):
        return f"""<g transform="translate({tx},{ty}) scale({s})" opacity="0.9">
<ellipse cx="38" cy="26" rx="34" ry="14" fill="none" stroke="{PAPER}" stroke-width="5.5" opacity="0.65"/>
<ellipse cx="38" cy="26" rx="22" ry="9" fill="none" stroke="{PAPER}" stroke-width="5" opacity="0.55"/>
<ellipse cx="38" cy="26" rx="11" ry="4.5" fill="none" stroke="{PAPER}" stroke-width="4.5" opacity="0.45"/>
<path d="M70 28 Q86 34 92 46" stroke="{PAPER}" stroke-width="4" fill="none" opacity="0.5" stroke-linecap="round"/></g>"""

    def anchor(tx, ty, s):
        return f"""<g transform="translate({tx},{ty}) scale({s})" opacity="0.8">
<circle cx="32" cy="14" r="11" fill="none" stroke="{PAPER}" stroke-width="4.5"/>
<line x1="32" y1="25" x2="32" y2="70" stroke="{PAPER}" stroke-width="5.5" stroke-linecap="round"/>
<path d="M10 68 Q32 78 54 68" stroke="{PAPER}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<line x1="10" y1="68" x2="10" y2="58" stroke="{PAPER}" stroke-width="3.5" stroke-linecap="round"/>
<line x1="54" y1="68" x2="54" y2="58" stroke="{PAPER}" stroke-width="3.5" stroke-linecap="round"/>
<line x1="15" y1="42" x2="49" y2="42" stroke="{PAPER}" stroke-width="4.5" stroke-linecap="round"/></g>"""

    def kelp(tx, ty, s, fl=1):
        return f"""<g transform="translate({tx},{ty}) scale({fl * s},{s})" opacity="0.92">
<path d="M16 110 Q4 76 18 46 Q26 22 20 0" stroke="{KELP1}" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M16 110 Q30 82 22 50 Q16 26 28 6" stroke="{KELP2}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<path d="M16 110 Q8 94 12 72 Q22 50 14 28" stroke="{KELP1}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.7"/>
<ellipse cx="20" cy="2" rx="12" ry="6" fill="{KELP2}" transform="rotate(-18,20,2)"/>
<ellipse cx="28" cy="8" rx="10" ry="5" fill="{KELP1}" transform="rotate(28,28,8)" opacity="0.85"/>
<ellipse cx="13" cy="26" rx="9" ry="4.5" fill="{KELP2}" transform="rotate(-40,13,26)" opacity="0.8"/></g>"""

    props_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
{lighthouse(1480, 398, 1.28)}
{dory(250, 700, 1.12)}
{buoy(640, 650, 0.92)}
{rope(70, 890, 1.7)}
{anchor(1740, 850, 1.5)}
{kelp(18, 962, 1.7)}
{kelp(1828, 950, 1.55, -1)}
</svg>"""
    props = render(props_svg, alpha=True)
    base.paste(props, (0, 0), props)

    print("rays...")

    def tri(x2, y2, x3, y3, op):
        return f'<polygon points="{SUN_X},{SUN_Y} {x2},{y2} {x3},{y3}" fill="white" opacity="{op}"/>'

    rays_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
<rect width="{W}" height="{H}" fill="black"/>
<circle cx="{SUN_X}" cy="{SUN_Y}" r="86" fill="white"/>
{tri(430, 0, 560, 0, 0.50)}{tri(610, 0, 710, 0, 0.62)}{tri(760, 0, 860, 0, 0.68)}
{tri(905, 0, 1020, 0, 0.55)}{tri(1075, 0, 1185, 0, 0.42)}
{tri(240, 90, 340, 46, 0.34)}{tri(1340, 70, 1465, 128, 0.34)}
<polygon points="{SUN_X},{SUN_Y} 0,0 0,{HORIZON}" fill="white" opacity="0.07"/>
<polygon points="{SUN_X},{SUN_Y} {W},0 {W},{HORIZON}" fill="white" opacity="0.07"/>
<ellipse cx="{SUN_X}" cy="{HORIZON + 170}" rx="120" ry="230" fill="white" opacity="0.62"/>
<ellipse cx="{SUN_X}" cy="{HORIZON + 120}" rx="60" ry="120" fill="white" opacity="0.5"/>
</svg>"""
    rr = render(rays_svg)
    rw = rr.filter(ImageFilter.GaussianBlur(55))
    rt = rr.filter(ImageFilter.GaussianBlur(20))

    def tint(img, r, g, b):
        a = np.asarray(img).astype(np.float32)
        a[:, :, 0] *= r
        a[:, :, 1] *= g
        a[:, :, 2] *= b
        return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

    rw = tint(rw, 1.12, 0.84, 0.46)
    rt = tint(rt, 1.08, 0.9, 0.58)
    comp = Image.blend(base, ImageChops.screen(base, rw), 0.68)
    comp = Image.blend(comp, ImageChops.screen(comp, rt), 0.5)
    comp = Image.composite(Image.blend(comp, dark, 0.32), comp, scrim)

    print("finish...")
    arr = np.asarray(comp).astype(np.float32)
    vt = np.ones((H, 1))
    for i in range(240):
        vt[H - 1 - i] = 1 - 0.5 * ((1 - i / 240) ** 2.0)
    cx, cy = W / 2, H * 0.52
    dd = np.sqrt(((xx - cx) / (W * 0.72)) ** 2 + ((yy - cy) / (H * 0.78)) ** 2)
    cv = np.clip(1 - 0.22 * np.clip(dd - 0.78, 0, 1) * 3, 0.78, 1)
    arr *= (vt[:, None] * cv)[..., None]
    noise = rng.normal(0, 1, (H, W, 1)) * 10.5
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    final = Image.fromarray(arr, "RGB").filter(ImageFilter.GaussianBlur(0.5))
    final.save(OUT)
    final.save(ROOT / "hero-reference.png")
    print(f"done → {OUT} ({final.size[0]}×{final.size[1]})")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise
