import math

# Color palette:
# Primary Gold: #C9A227
# Highlight Gold: #E8C76A / #FFF2B2
# Deep Gold: #8C6A12 / #5E3D07

def get_defs(prefix=""):
    return f"""
    <linearGradient id="{prefix}goldRichMaster" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5E3D07" />
      <stop offset="12%" stop-color="#8C6A12" />
      <stop offset="25%" stop-color="#C9A227" />
      <stop offset="42%" stop-color="#FFF2B2" />
      <stop offset="58%" stop-color="#E8C76A" />
      <stop offset="72%" stop-color="#8C6A12" />
      <stop offset="86%" stop-color="#FBF0B5" />
      <stop offset="100%" stop-color="#4F2D02" />
    </linearGradient>

    <linearGradient id="{prefix}goldRichWire" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#6B4509" />
      <stop offset="22%" stop-color="#C9A227" />
      <stop offset="50%" stop-color="#FFF5C6" />
      <stop offset="78%" stop-color="#8C6A12" />
      <stop offset="100%" stop-color="#4D2B02" />
    </linearGradient>

    <linearGradient id="{prefix}goldRichSpecular" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B2001" stop-opacity="0.1" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#E8C76A" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <linearGradient id="{prefix}goldLeafFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8C6A12" />
      <stop offset="25%" stop-color="#FFF0A8" />
      <stop offset="55%" stop-color="#C9A227" />
      <stop offset="85%" stop-color="#FDF1B8" />
      <stop offset="100%" stop-color="#5E3D07" />
    </linearGradient>

    <filter id="{prefix}richEmboss" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="3.5" stdDeviation="3" flood-color="#261400" flood-opacity="0.45" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="1.2" flood-color="#FFFBE0" flood-opacity="0.75" />
    </filter>

    <filter id="{prefix}fineShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.2" dy="2" stdDeviation="1.5" flood-color="#2D1701" flood-opacity="0.4" />
    </filter>
    """

def generate_guilloche(cx, cy, rx, ry, prefix="", stroke_w=3.4):
    num_loops = 24
    layers = []
    # Drop shadow on wire
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        layers.append(f'<ellipse cx="{cx+1.2}" cy="{cy+2.5}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="#2B1601" stroke-width="{stroke_w*0.8}" opacity="0.3" />')
    # Gold base wire
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        layers.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="url(#{prefix}goldRichWire)" stroke-width="{stroke_w}" />')
    # Specular shine
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        layers.append(f'<ellipse cx="{cx-0.7}" cy="{cy-0.7}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="url(#{prefix}goldRichSpecular)" stroke-width="{stroke_w*0.4}" opacity="0.85" />')
    return "\n    ".join(layers)

# 1. GENERATE MASTER FULL LOGO (TRANSPARENT BACKGROUND, EXTRA BREATHING ROOM, BOLDER TAGLINE)
def build_master_logo():
    cx, cy = 400, 310
    rx, ry = 190, 62
    
    wires = generate_guilloche(cx, cy, rx, ry, prefix="m_")
    
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 960" width="100%" height="100%">
  <defs>
    {get_defs("m_")}
  </defs>

  <g id="care-master-full-logo" filter="url(#m_richEmboss)">
    
    <!-- ============================================================ -->
    <!-- 1. CIRCULAR GOLD EMBLEM (CENTER: 400, 310)                  -->
    <!-- ============================================================ -->
    
    <!-- OUTSIDE WOVEN GUILLOCHE WREATH -->
    <g id="guilloche-wreath">
      {wires}
    </g>

    <!-- INNER SOLID DOUBLE GOLD RINGS (Transparent Center) -->
    <circle cx="400" cy="310" r="154" fill="none" stroke="url(#m_goldRichMaster)" stroke-width="6.5" />
    <circle cx="400" cy="310" r="154" fill="none" stroke="url(#m_goldRichSpecular)" stroke-width="2" />
    
    <circle cx="400" cy="310" r="145" fill="none" stroke="url(#m_goldRichMaster)" stroke-width="2.8" />
    <circle cx="400" cy="310" r="145" fill="none" stroke="url(#m_goldRichSpecular)" stroke-width="1.2" />

    <!-- CENTER VERTICAL DIVIDING GOLD ROD -->
    <g id="center-dividing-rod">
      <rect x="398.5" y="196" width="9" height="228" rx="4.5" fill="#261400" opacity="0.35" filter="url(#m_fineShadow)" />
      <rect x="396" y="194" width="8" height="228" rx="4" fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="1.2" />
      <line x1="398" y1="198" x2="398" y2="418" stroke="#FFFFFF" stroke-width="1.4" opacity="0.9" stroke-linecap="round" />
    </g>

    <!-- LEFT SIDE: 5-LEAF BOTANICAL EMBLEM CREST (Crisp Natural Wellness) -->
    <g id="left-leaf-crest" transform="translate(314, 310)">
      <!-- 1. Top Vertical Leaf -->
      <path d="M 0 -52 C -19 -29, -19 -8, 0 10 C 19 -8, 19 -29, 0 -52 Z" 
            fill="url(#m_goldLeafFill)" stroke="url(#m_goldRichMaster)" stroke-width="3.5" />
      <path d="M 0 -47 C -14 -27, -14 -10, 0 5 C 14 -10, 14 -27, 0 -47 Z" 
            fill="none" stroke="url(#m_goldRichSpecular)" stroke-width="1.5" />
      <line x1="0" y1="-42" x2="0" y2="7" stroke="#5E3D07" stroke-width="2" />
      <line x1="-0.5" y1="-42" x2="-0.5" y2="7" stroke="#FFF2B2" stroke-width="1" />

      <!-- 2. Upper-Left Angled Leaf -->
      <path d="M -6 -10 C -36 -33, -52 -8, -10 6 C -5 5, -2 0, -6 -10 Z" 
            fill="url(#m_goldLeafFill)" stroke="url(#m_goldRichMaster)" stroke-width="3.2" />
      <line x1="-26" y1="-16" x2="-5" y2="2" stroke="#5E3D07" stroke-width="1.8" />
      <line x1="-26.5" y1="-16.5" x2="-5.5" y2="1.5" stroke="#FFF2B2" stroke-width="0.8" />

      <!-- 3. Upper-Right Angled Leaf -->
      <path d="M 6 -10 C 36 -33, 52 -8, 10 6 C 5 5, 2 0, 6 -10 Z" 
            fill="url(#m_goldLeafFill)" stroke="url(#m_goldRichMaster)" stroke-width="3.2" />
      <line x1="26" y1="-16" x2="5" y2="2" stroke="#5E3D07" stroke-width="1.8" />
      <line x1="25.5" y1="-16.5" x2="4.5" y2="1.5" stroke="#FFF2B2" stroke-width="0.8" />

      <!-- 4. Lower-Left Horizontal Leaf -->
      <path d="M -6 8 C -42 2, -50 27, -9 25 C -4 23, -4 14, -6 8 Z" 
            fill="url(#m_goldLeafFill)" stroke="url(#m_goldRichMaster)" stroke-width="3.2" />
      <line x1="-27" y1="15" x2="-5" y2="17" stroke="#5E3D07" stroke-width="1.8" />
      <line x1="-27" y1="14.5" x2="-5" y2="16.5" stroke="#FFF2B2" stroke-width="0.8" />

      <!-- 5. Lower-Right Horizontal Leaf -->
      <path d="M 6 8 C 42 2, 50 27, 9 25 C 4 23, 4 14, 6 8 Z" 
            fill="url(#m_goldLeafFill)" stroke="url(#m_goldRichMaster)" stroke-width="3.2" />
      <line x1="27" y1="15" x2="5" y2="17" stroke="#5E3D07" stroke-width="1.8" />
      <line x1="27" y1="14.5" x2="5" y2="16.5" stroke="#FFF2B2" stroke-width="0.8" />

      <!-- Center Botanical Stem & Base Bead -->
      <path d="M 0 8 L 0 44" stroke="url(#m_goldRichMaster)" stroke-width="6.5" stroke-linecap="round" />
      <path d="M -1 9 L -1 41" stroke="#FFF2B2" stroke-width="2" stroke-linecap="round" />
      <circle cx="0" cy="44" r="4.2" fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="1" />
    </g>

    <!-- RIGHT SIDE: ROMAN SERIF 'C' MONOGRAM -->
    <g id="right-monogram-c" transform="translate(484, 310)">
      <path d="M 38 -39 C 32 -48, 22 -54, 8 -54 C -22 -54 -42 -32 -42 0 C -42 32 -22 54 8 54 C 24 54 34 46 40 38 L 32 31 C 26 38 19 44 8 44 C -14 44 -28 27 -28 0 C -28 -27 -14 -44 8 -44 C 18 -44 25 -40 30 -33 Z" 
            fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="2.6" />
      
      <!-- Top Teardrop Terminal Bulb -->
      <circle cx="37" cy="-37" r="8" fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="1.5" />
      <circle cx="35" cy="-39" r="2.5" fill="#FFFFFF" opacity="0.95" />

      <!-- Bottom Flared Serif Terminal -->
      <path d="M 28 31 L 45 39 L 30 46 Z" fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="1.2" />
    </g>

    <!-- ============================================================ -->
    <!-- 2. BRAND NAME 'CARe' (Refined 3D Metallic Serif Typography)   -->
    <!-- ============================================================ -->
    <g id="brand-name-care" transform="translate(400, 665)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif" 
            font-size="124" 
            font-weight="900" 
            letter-spacing="22" 
            fill="url(#m_goldRichMaster)" 
            stroke="url(#m_goldRichSpecular)" 
            stroke-width="2.6">
        <tspan x="-200">C</tspan>
        <tspan x="-68">A</tspan>
        <tspan x="68">R</tspan>
        <tspan x="200" font-size="114" dy="3">e</tspan>
      </text>
    </g>

    <!-- ============================================================ -->
    <!-- 3. DECORATIVE ORNAMENTAL DIVIDER WITH BOTANICAL KNOT         -->
    <!-- ============================================================ -->
    <g id="decorative-divider" transform="translate(400, 740)">
      <!-- Left Fine Rule with tapered ends -->
      <line x1="-310" y1="0" x2="-52" y2="0" stroke="url(#m_goldRichMaster)" stroke-width="3.8" stroke-linecap="round" />
      <line x1="-310" y1="-1" x2="-52" y2="-1" stroke="url(#m_goldRichSpecular)" stroke-width="1.6" stroke-linecap="round" />

      <!-- Center Botanical Flourish Knot -->
      <g id="flourish-knot">
        <path d="M 0 -14 C -11 -3, -11 3, 0 14 C 11 3, 11 -3, 0 -14 Z" 
              fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="2" />
        <circle cx="0" cy="0" r="3.2" fill="#FFFFFF" opacity="0.95" />

        <!-- Left Loop -->
        <path d="M -4 0 C -22 -14, -30 0, -4 9 Z" 
              fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="1.6" />
        
        <!-- Right Loop -->
        <path d="M 4 0 C 22 -14, 28 0, 4 9 Z" 
              fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="1.6" />
        
        <!-- Flanking Accent Gold Beads -->
        <circle cx="-36" cy="0" r="6" fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="1.4" />
        <circle cx="-37" cy="-1.5" r="2" fill="#FFFFFF" opacity="0.95" />
        <circle cx="36" cy="0" r="6" fill="url(#m_goldRichMaster)" stroke="url(#m_goldRichSpecular)" stroke-width="1.4" />
        <circle cx="35" cy="-1.5" r="2" fill="#FFFFFF" opacity="0.95" />
      </g>

      <!-- Right Fine Rule with tapered ends -->
      <line x1="52" y1="0" x2="310" y2="0" stroke="url(#m_goldRichMaster)" stroke-width="3.8" stroke-linecap="round" />
      <line x1="52" y1="-1" x2="310" y2="-1" stroke="url(#m_goldRichSpecular)" stroke-width="1.6" stroke-linecap="round" />
    </g>

    <!-- ============================================================ -->
    <!-- 4. TAGLINE 'A BEAUTY SOLUTION' (BOLDER, CLEARER, READABLE)   -->
    <!-- ============================================================ -->
    <g id="brand-tagline" transform="translate(400, 816)">
      <text font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', Georgia, serif" 
            font-size="34" 
            font-weight="900" 
            letter-spacing="18" 
            fill="url(#m_goldRichMaster)" 
            stroke="url(#m_goldRichSpecular)" 
            stroke-width="1.2" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo.svg", "w") as f:
        f.write(svg)
    print("Master full SVG saved successfully.")

# 2. GENERATE HEADER NAVBAR LOGO (TRANSPARENT, EMBLEM + CARE, NO TAGLINE FOR MAXIMUM MOBILE CLARITY)
def build_navbar_logo():
    cx, cy = 48, 45
    rx, ry = 38, 12
    wires = generate_guilloche(cx, cy, rx, ry, prefix="n_", stroke_w=1.8)
    
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 90" width="100%" height="100%">
  <defs>
    {get_defs("n_")}
  </defs>

  <g id="care-header-logo" filter="url(#n_fineShadow)">
    
    <!-- EMBLEM MEDALLION (CENTER: 48, 45) -->
    <g id="header-emblem">
      {wires}

      <!-- Double Rings -->
      <circle cx="48" cy="45" r="31" fill="none" stroke="url(#n_goldRichMaster)" stroke-width="2.2" />
      <circle cx="48" cy="45" r="31" fill="none" stroke="url(#n_goldRichSpecular)" stroke-width="0.8" />
      <circle cx="48" cy="45" r="28" fill="none" stroke="url(#n_goldRichMaster)" stroke-width="1" />

      <!-- Center Dividing Bar -->
      <rect x="47" y="21" width="2" height="48" rx="1" fill="url(#n_goldRichMaster)" stroke="url(#n_goldRichSpecular)" stroke-width="0.4" />
      <line x1="47.6" y1="22" x2="47.6" y2="68" stroke="#FFFFFF" stroke-width="0.5" opacity="0.9" />

      <!-- Left 5-Leaf Crest -->
      <g transform="translate(30, 45)">
        <path d="M 0 -11 C -4 -6, -4 -2, 0 2 C 4 -2, 4 -6, 0 -11 Z" fill="url(#n_goldLeafFill)" stroke="url(#n_goldRichMaster)" stroke-width="0.7" />
        <line x1="0" y1="-9" x2="0" y2="2" stroke="#5E3D07" stroke-width="0.5" />
        <path d="M -1.5 -2.5 C -7 -7, -11 -2, -2.5 1.5 Z" fill="url(#n_goldLeafFill)" stroke="url(#n_goldRichMaster)" stroke-width="0.6" />
        <path d="M 1.5 -2.5 C 7 -7, 11 -2, 2.5 1.5 Z" fill="url(#n_goldLeafFill)" stroke="url(#n_goldRichMaster)" stroke-width="0.6" />
        <path d="M -1.5 1.5 C -8 0.5, -10 6, -1.5 5 Z" fill="url(#n_goldLeafFill)" stroke="url(#n_goldRichMaster)" stroke-width="0.6" />
        <path d="M 1.5 1.5 C 8 0.5, 10 6, 1.5 5 Z" fill="url(#n_goldLeafFill)" stroke="url(#n_goldRichMaster)" stroke-width="0.6" />
        <path d="M 0 2 L 0 9.5" stroke="url(#n_goldRichMaster)" stroke-width="1.6" stroke-linecap="round" />
        <circle cx="0" cy="9.5" r="1" fill="url(#n_goldRichMaster)" />
      </g>

      <!-- Right Roman 'C' -->
      <g transform="translate(66, 45)">
        <path d="M 8 -8 C 6.5 -10, 4.5 -11, 1.5 -11 C -4.5 -11, -8.5 -6.5, -8.5 0 C -8.5 6.5, -4.5 11, 1.5 11 C 4.5 11, 6.5 9.5, 8 7.5 L 6.5 6 C 5 7.5, 3.5 8.5, 1.5 8.5 C -3 8.5 -5.5 5.5 -5.5 0 C -5.5 -5.5 -3 -8.5 1.5 -8.5 C 3.5 -8.5, 5 -7, 6 -5.5 Z" 
              fill="url(#n_goldRichMaster)" stroke="url(#n_goldRichSpecular)" stroke-width="0.6" />
        <circle cx="7.5" cy="-7.5" r="1.5" fill="url(#n_goldRichMaster)" stroke="url(#n_goldRichSpecular)" stroke-width="0.3" />
        <path d="M 5.5 6 L 9 7.5 L 6 8.5 Z" fill="url(#n_goldRichMaster)" />
      </g>
    </g>

    <!-- RIGHT SIDE WORDMARK: 'CARe' (Bold, Crisp Luxury Serif) -->
    <g transform="translate(100, 56)">
      <text font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="44" 
            font-weight="900" 
            letter-spacing="5" 
            fill="url(#n_goldRichMaster)" 
            stroke="url(#n_goldRichSpecular)" 
            stroke-width="1">
        <tspan x="0">C</tspan>
        <tspan x="36">A</tspan>
        <tspan x="74">R</tspan>
        <tspan x="112" font-size="39" dy="1">e</tspan>
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo-horizontal.svg", "w") as f:
        f.write(svg)
    print("Navbar horizontal SVG saved successfully.")

# 3. GENERATE ICON / FAVICON EMBLEM (SQUARE 400x400 FOR MOBILE / SOCIAL / FAVICON)
def build_icon_emblem():
    cx, cy = 200, 200
    rx, ry = 145, 48
    wires = generate_guilloche(cx, cy, rx, ry, prefix="i_", stroke_w=2.6)
    
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    {get_defs("i_")}
  </defs>

  <g id="care-emblem-icon-artwork" filter="url(#i_richEmboss)">
    {wires}

    <!-- Double Rings -->
    <circle cx="200" cy="200" r="118" fill="none" stroke="url(#i_goldRichMaster)" stroke-width="5" />
    <circle cx="200" cy="200" r="118" fill="none" stroke="url(#i_goldRichSpecular)" stroke-width="1.6" />
    <circle cx="200" cy="200" r="111" fill="none" stroke="url(#i_goldRichMaster)" stroke-width="2.2" />

    <!-- Center Dividing Bar -->
    <rect x="198.8" y="112" width="7" height="176" rx="3.5" fill="#261400" opacity="0.3" filter="url(#i_fineShadow)" />
    <rect x="197" y="110" width="6" height="176" rx="3" fill="url(#i_goldRichMaster)" stroke="url(#i_goldRichSpecular)" stroke-width="1" />
    <line x1="198.5" y1="113" x2="198.5" y2="283" stroke="#FFFFFF" stroke-width="1.2" opacity="0.9" stroke-linecap="round" />

    <!-- Left 5-Leaf Crest -->
    <g transform="translate(136, 200)">
      <path d="M 0 -40 C -15 -22, -15 -6, 0 8 C 15 -6, 15 -22, 0 -40 Z" fill="url(#i_goldLeafFill)" stroke="url(#i_goldRichMaster)" stroke-width="2.6" />
      <path d="M 0 -36 C -11 -20, -11 -8, 0 4 C 11 -8, 11 -20, 0 -36 Z" fill="none" stroke="url(#i_goldRichSpecular)" stroke-width="1" />
      <line x1="0" y1="-32" x2="0" y2="6" stroke="#5E3D07" stroke-width="1.6" />
      <line x1="-0.4" y1="-32" x2="-0.4" y2="6" stroke="#FFF2B2" stroke-width="0.8" />

      <path d="M -5 -8 C -28 -25, -40 -6, -8 5 Z" fill="url(#i_goldLeafFill)" stroke="url(#i_goldRichMaster)" stroke-width="2.4" />
      <line x1="-20" y1="-12" x2="-4" y2="2" stroke="#5E3D07" stroke-width="1.4" />

      <path d="M 5 -8 C 28 -25, 40 -6, 8 5 Z" fill="url(#i_goldLeafFill)" stroke="url(#i_goldRichMaster)" stroke-width="2.4" />
      <line x1="20" y1="-12" x2="4" y2="2" stroke="#5E3D07" stroke-width="1.4" />

      <path d="M -5 6 C -32 2, -38 21, -7 19 Z" fill="url(#i_goldLeafFill)" stroke="url(#i_goldRichMaster)" stroke-width="2.4" />
      <line x1="-21" y1="11" x2="-4" y2="13" stroke="#5E3D07" stroke-width="1.4" />

      <path d="M 5 6 C 32 2, 38 21, 7 19 Z" fill="url(#i_goldLeafFill)" stroke="url(#i_goldRichMaster)" stroke-width="2.4" />
      <line x1="21" y1="11" x2="4" y2="13" stroke="#5E3D07" stroke-width="1.4" />

      <path d="M 0 6 L 0 34" stroke="url(#i_goldRichMaster)" stroke-width="5" stroke-linecap="round" />
      <circle cx="0" cy="34" r="3.2" fill="url(#i_goldRichMaster)" />
    </g>

    <!-- Right Roman 'C' -->
    <g transform="translate(264, 200)">
      <path d="M 30 -30 C 25 -37, 17 -42, 6 -42 C -17 -42 -32 -25 -32 0 C -32 25 -17 42 6 42 C 19 42 27 36 32 30 L 25 24 C 20 30 15 34 6 34 C -11 34 -22 21 -22 0 C -22 -21 -11 -34 6 -34 C 14 -34 20 -31 24 -26 Z" 
            fill="url(#i_goldRichMaster)" stroke="url(#i_goldRichSpecular)" stroke-width="2" />
      <circle cx="29" cy="-29" r="6.2" fill="url(#i_goldRichMaster)" stroke="url(#i_goldRichSpecular)" stroke-width="1.2" />
      <circle cx="27.5" cy="-30.5" r="2" fill="#FFFFFF" opacity="0.9" />
      <path d="M 22 24 L 35 30 L 24 36 Z" fill="url(#i_goldRichMaster)" stroke="url(#i_goldRichSpecular)" stroke-width="1" />
    </g>

  </g>
</svg>"""

    with open("public/images/care-emblem-icon.svg", "w") as f:
        f.write(svg)
    with open("public/favicon.svg", "w") as f:
        f.write(svg)
    print("Icon and Favicon SVG saved successfully.")

if __name__ == "__main__":
    build_master_logo()
    build_navbar_logo()
    build_icon_emblem()
