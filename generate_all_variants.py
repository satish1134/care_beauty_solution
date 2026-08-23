import re

# 1. Favicon Browser Tab (Clean gold ring + inner botanical leaf + divider rod + Roman C)
# Matches "favicon browsertab.png"
favicon_browser_tab = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <defs>
    <radialGradient id="favBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FCFAF5" />
    </radialGradient>
    
    <linearGradient id="favGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6E4506" />
      <stop offset="15%" stop-color="#A57A18" />
      <stop offset="30%" stop-color="#E2B739" />
      <stop offset="45%" stop-color="#FFF8D8" />
      <stop offset="60%" stop-color="#EDC55D" />
      <stop offset="80%" stop-color="#B0831F" />
      <stop offset="92%" stop-color="#FAEAA2" />
      <stop offset="100%" stop-color="#553002" />
    </linearGradient>

    <linearGradient id="favGoldSpec" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A1E00" stop-opacity="0.15" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#EAC45F" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <filter id="fav3D" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="3.5" stdDeviation="3.0" flood-color="#281400" flood-opacity="0.38" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#FFFDF0" flood-opacity="0.9" />
    </filter>
  </defs>

  <g id="care-favicon-browser" filter="url(#fav3D)">
    <!-- Outer Precision Beveled Gold Ring -->
    <circle cx="128" cy="128" r="96" fill="none" stroke="url(#favGold3D)" stroke-width="8.5" />
    <circle cx="128" cy="128" r="96" fill="none" stroke="url(#favGoldSpec)" stroke-width="2.5" />
    <circle cx="128" cy="128" r="90.5" fill="none" stroke="url(#favGold3D)" stroke-width="2.0" opacity="0.8" />
    <circle cx="128" cy="128" r="101.5" fill="none" stroke="url(#favGold3D)" stroke-width="2.0" opacity="0.8" />

    <!-- Center Vertical Divider Bar with 3D Bevel & highlight -->
    <rect x="125.5" y="60" width="5.5" height="136" rx="2.75" fill="url(#favGold3D)" stroke="url(#favGoldSpec)" stroke-width="1.0" />
    <line x1="127" y1="62" x2="127" y2="194" stroke="#FFFFFF" stroke-width="1.2" opacity="0.85" />

    <!-- Left Botanical Leaf Cluster -->
    <g transform="translate(80, 128) scale(1.5)">
      <path d="M 0 -42 C -15 -24, -15 -5, 0 8 C 15 -5, 15 -24, 0 -42 Z" fill="url(#favGold3D)" stroke="url(#favGoldSpec)" stroke-width="2.5" />
      <path d="M -5 -11 C -30 -28, -40 -8, -7 4 C -3 3, -1 -2, -5 -11 Z" fill="url(#favGold3D)" stroke="url(#favGoldSpec)" stroke-width="2" />
      <path d="M 5 -11 C 30 -28, 40 -8, 7 4 C 3 3, 1 -2, 5 -11 Z" fill="url(#favGold3D)" stroke="url(#favGoldSpec)" stroke-width="2" />
      <path d="M -5 6 C -24 5, -29 18, -6 14 Z" fill="url(#favGold3D)" stroke="url(#favGoldSpec)" stroke-width="1.8" />
      <path d="M 5 6 C 24 5, 29 18, 6 14 Z" fill="url(#favGold3D)" stroke="url(#favGoldSpec)" stroke-width="1.8" />
      <path d="M 0 8 L 0 32" stroke="url(#favGold3D)" stroke-width="4.5" stroke-linecap="round" />
    </g>

    <!-- Right Roman Letter 'C' -->
    <g transform="translate(176, 128) scale(1.5)">
      <path d="M 32 -32 C 26 -40, 18 -44, 6 -44 C -17 -44 -32 -26 -32 0 C -32 26 -17 44 6 44 C 19 44 28 38 32 31 L 25 26 C 21 32 15 36 7 36 C -10 36 -21 22 -21 0 C -21 -22 -10 -36 7 -36 C 15 -36 21 -32 24 -27 Z" 
            fill="url(#favGold3D)" stroke="url(#favGoldSpec)" stroke-width="1.8" />
      <circle cx="31" cy="-30" r="5.5" fill="url(#favGold3D)" stroke="url(#favGoldSpec)" stroke-width="1" />
      <path d="M 23 26 L 36 33 L 24 38 Z" fill="url(#favGold3D)" />
    </g>
  </g>
</svg>'''

# 2. Guilloche Emblem Only (Matches "Favicon.png")
favicon_emblem_wreath = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" width="100%" height="100%">
  <defs>
    <linearGradient id="emblemGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6E4506" />
      <stop offset="15%" stop-color="#A57A18" />
      <stop offset="30%" stop-color="#E2B739" />
      <stop offset="45%" stop-color="#FFF8D8" />
      <stop offset="60%" stop-color="#EDC55D" />
      <stop offset="80%" stop-color="#B0831F" />
      <stop offset="92%" stop-color="#FAEAA2" />
      <stop offset="100%" stop-color="#553002" />
    </linearGradient>

    <linearGradient id="emblemGoldWire" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#734907" />
      <stop offset="25%" stop-color="#D8AF33" />
      <stop offset="50%" stop-color="#FFF6D0" />
      <stop offset="75%" stop-color="#9E7317" />
      <stop offset="100%" stop-color="#5B3402" />
    </linearGradient>

    <linearGradient id="emblemGoldSpec" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A1E00" stop-opacity="0.15" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#EAC45F" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <filter id="emblem3D" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="3.5" stdDeviation="3.0" flood-color="#281400" flood-opacity="0.38" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#FFFDF0" flood-opacity="0.9" />
    </filter>
  </defs>

  <g id="care-emblem-wreath" filter="url(#emblem3D)" transform="translate(140, 140)">
    <!-- Guilloche Outer Wreath 20 Ellipses -->
    <g transform="scale(0.72) translate(-400, -310)">
'''

for i in range(20):
    deg = i * 18
    favicon_emblem_wreath += f'      <ellipse cx="400" cy="310" rx="175" ry="58" transform="rotate({deg:.2f} 400 310)" fill="none" stroke="url(#emblemGoldWire)" stroke-width="4.8" />\n'

for i in range(0, 20, 2):
    deg = i * 18
    favicon_emblem_wreath += f'      <ellipse cx="399" cy="309" rx="175" ry="58" transform="rotate({deg:.2f} 400 310)" fill="none" stroke="url(#emblemGoldSpec)" stroke-width="1.5" opacity="0.9" />\n'

favicon_emblem_wreath += '''    </g>

    <!-- Double Inner Gold Rings -->
    <circle cx="0" cy="0" r="76" fill="none" stroke="url(#emblemGold3D)" stroke-width="5.0" />
    <circle cx="0" cy="0" r="76" fill="none" stroke="url(#emblemGoldSpec)" stroke-width="1.8" />
    <circle cx="0" cy="0" r="71" fill="none" stroke="url(#emblemGold3D)" stroke-width="2.5" />

    <!-- Center Vertical Divider Bar -->
    <rect x="-2.2" y="-48" width="4.4" height="96" rx="2.2" fill="url(#emblemGold3D)" stroke="url(#emblemGoldSpec)" stroke-width="0.8" />
    <line x1="-0.6" y1="-46" x2="-0.6" y2="46" stroke="#FFFFFF" stroke-width="1.0" opacity="0.85" />

    <!-- Left Botanical Leaf Cluster -->
    <g transform="translate(-36, 0) scale(1.15)">
      <path d="M 0 -42 C -15 -24, -15 -5, 0 8 C 15 -5, 15 -24, 0 -42 Z" fill="url(#emblemGold3D)" stroke="url(#emblemGoldSpec)" stroke-width="2.5" />
      <path d="M -5 -11 C -30 -28, -40 -8, -7 4 C -3 3, -1 -2, -5 -11 Z" fill="url(#emblemGold3D)" stroke="url(#emblemGoldSpec)" stroke-width="2" />
      <path d="M 5 -11 C 30 -28, 40 -8, 7 4 C 3 3, 1 -2, 5 -11 Z" fill="url(#emblemGold3D)" stroke="url(#emblemGoldSpec)" stroke-width="2" />
      <path d="M -5 6 C -24 5, -29 18, -6 14 Z" fill="url(#emblemGold3D)" stroke="url(#emblemGoldSpec)" stroke-width="1.8" />
      <path d="M 5 6 C 24 5, 29 18, 6 14 Z" fill="url(#emblemGold3D)" stroke="url(#emblemGoldSpec)" stroke-width="1.8" />
      <path d="M 0 8 L 0 32" stroke="url(#emblemGold3D)" stroke-width="4.5" stroke-linecap="round" />
    </g>

    <!-- Right Roman Letter 'C' -->
    <g transform="translate(36, 0) scale(1.15)">
      <path d="M 32 -32 C 26 -40, 18 -44, 6 -44 C -17 -44 -32 -26 -32 0 C -32 26 -17 44 6 44 C 19 44 28 38 32 31 L 25 26 C 21 32 15 36 7 36 C -10 36 -21 22 -21 0 C -21 -22 -10 -36 7 -36 C 15 -36 21 -32 24 -27 Z" 
            fill="url(#emblemGold3D)" stroke="url(#emblemGoldSpec)" stroke-width="1.8" />
      <circle cx="31" cy="-30" r="5.5" fill="url(#emblemGold3D)" stroke="url(#emblemGoldSpec)" stroke-width="1" />
      <path d="M 23 26 L 36 33 L 24 38 Z" fill="url(#emblemGold3D)" />
    </g>
  </g>
</svg>'''

# 3. Header Logo Horizontal Lockup (Matches "Header logo.png")
# High fidelity horizontal with transparent background & beautiful proportions
header_logo_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 160" width="100%" height="100%">
  <defs>
    <linearGradient id="hlGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#663F05" />
      <stop offset="12%" stop-color="#9C7215" />
      <stop offset="26%" stop-color="#DBB030" />
      <stop offset="42%" stop-color="#FFF9DE" />
      <stop offset="56%" stop-color="#ECC664" />
      <stop offset="72%" stop-color="#A57A18" />
      <stop offset="88%" stop-color="#FAE89E" />
      <stop offset="100%" stop-color="#522F02" />
    </linearGradient>

    <linearGradient id="hlGoldWire" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#734907" />
      <stop offset="25%" stop-color="#D8AF33" />
      <stop offset="50%" stop-color="#FFF6D0" />
      <stop offset="75%" stop-color="#9E7317" />
      <stop offset="100%" stop-color="#5B3402" />
    </linearGradient>

    <linearGradient id="hlGoldSpec" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A1E00" stop-opacity="0.1" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#EAC45F" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <filter id="hlBevel" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="1.8" dy="3.2" stdDeviation="2.4" flood-color="#241300" flood-opacity="0.36" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="1.0" flood-color="#FFFDEE" flood-opacity="0.88" />
    </filter>
  </defs>

  <g id="header-logo-group" filter="url(#hlBevel)">
    <!-- LEFT: EMBLEM (Center X=80, Y=80, Radius ~68) -->
    <g transform="translate(80, 80)">
      <!-- Guilloche Wreath -->
      <g transform="scale(0.42) translate(-400, -310)">
'''

for i in range(20):
    deg = i * 18
    header_logo_svg += f'        <ellipse cx="400" cy="310" rx="175" ry="58" transform="rotate({deg:.2f} 400 310)" fill="none" stroke="url(#hlGoldWire)" stroke-width="5.0" />\n'

for i in range(0, 20, 2):
    deg = i * 18
    header_logo_svg += f'        <ellipse cx="399" cy="309" rx="175" ry="58" transform="rotate({deg:.2f} 400 310)" fill="none" stroke="url(#hlGoldSpec)" stroke-width="1.6" opacity="0.9" />\n'

header_logo_svg += '''      </g>

      <!-- Inner Circles -->
      <circle cx="0" cy="0" r="44.5" fill="none" stroke="url(#hlGold3D)" stroke-width="3.2" />
      <circle cx="0" cy="0" r="44.5" fill="none" stroke="url(#hlGoldSpec)" stroke-width="1.0" />
      <circle cx="0" cy="0" r="41.5" fill="none" stroke="url(#hlGold3D)" stroke-width="1.6" />

      <!-- Center Divider Bar -->
      <rect x="-1.4" y="-30" width="2.8" height="60" rx="1.4" fill="url(#hlGold3D)" stroke="url(#hlGoldSpec)" stroke-width="0.5" />
      <line x1="-0.4" y1="-29" x2="-0.4" y2="29" stroke="#FFFFFF" stroke-width="0.6" opacity="0.9" />

      <!-- Left Botanical Leaf -->
      <g transform="translate(-21, 0) scale(0.68)">
        <path d="M 0 -42 C -15 -24, -15 -5, 0 8 C 15 -5, 15 -24, 0 -42 Z" fill="url(#hlGold3D)" stroke="url(#hlGoldSpec)" stroke-width="2.5" />
        <path d="M -5 -11 C -30 -28, -40 -8, -7 4 C -3 3, -1 -2, -5 -11 Z" fill="url(#hlGold3D)" stroke="url(#hlGoldSpec)" stroke-width="2" />
        <path d="M 5 -11 C 30 -28, 40 -8, 7 4 C 3 3, 1 -2, 5 -11 Z" fill="url(#hlGold3D)" stroke="url(#hlGoldSpec)" stroke-width="2" />
        <path d="M -5 6 C -24 5, -29 18, -6 14 Z" fill="url(#hlGold3D)" stroke="url(#hlGoldSpec)" stroke-width="1.8" />
        <path d="M 5 6 C 24 5, 29 18, 6 14 Z" fill="url(#hlGold3D)" stroke="url(#hlGoldSpec)" stroke-width="1.8" />
        <path d="M 0 8 L 0 32" stroke="url(#hlGold3D)" stroke-width="5" stroke-linecap="round" />
      </g>

      <!-- Right Roman 'c' -->
      <g transform="translate(21, 0) scale(0.68)">
        <path d="M 32 -32 C 26 -40, 18 -44, 6 -44 C -17 -44 -32 -26 -32 0 C -32 26 -17 44 6 44 C 19 44 28 38 32 31 L 25 26 C 21 32 15 36 7 36 C -10 36 -21 22 -21 0 C -21 -22 -10 -36 7 -36 C 15 -36 21 -32 24 -27 Z" 
              fill="url(#hlGold3D)" stroke="url(#hlGoldSpec)" stroke-width="1.8" />
        <circle cx="31" cy="-30" r="5.5" fill="url(#hlGold3D)" stroke="url(#hlGoldSpec)" stroke-width="1" />
        <path d="M 23 26 L 36 33 L 24 38 Z" fill="url(#hlGold3D)" />
      </g>
    </g>

    <!-- RIGHT: CARe BRAND NAME -->
    <g transform="translate(182, 102)">
      <!-- Roman Font Letters -->
      <text font-family="'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif" 
            font-size="80" 
            font-weight="700" 
            letter-spacing="5" 
            fill="url(#hlGold3D)" 
            stroke="url(#hlGoldSpec)" 
            stroke-width="1.2">
        <tspan x="0">C</tspan>
        <tspan dx="4">A</tspan>
        <tspan dx="4">R</tspan>
        <tspan dx="4" font-size="70" dy="-1">e</tspan>
      </text>
    </g>
  </g>
</svg>'''

# 4. Master Full Logo (Matches "Full_LOGO.png" and "white background.png")
# Centered Guilloche Medallion + CARe + Celtic/Floral Knot divider + "A BEAUTY SOLUTION"
full_master_logo_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="flGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5E3803" />
      <stop offset="12%" stop-color="#9C7215" />
      <stop offset="26%" stop-color="#DBB030" />
      <stop offset="42%" stop-color="#FFF9DE" />
      <stop offset="56%" stop-color="#ECC664" />
      <stop offset="72%" stop-color="#A57A18" />
      <stop offset="88%" stop-color="#FAE89E" />
      <stop offset="100%" stop-color="#4A2800" />
    </linearGradient>

    <linearGradient id="flGoldWire" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#734907" />
      <stop offset="25%" stop-color="#D8AF33" />
      <stop offset="50%" stop-color="#FFF6D0" />
      <stop offset="75%" stop-color="#9E7317" />
      <stop offset="100%" stop-color="#5B3402" />
    </linearGradient>

    <linearGradient id="flGoldSpec" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A1E00" stop-opacity="0.15" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#EAC45F" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <filter id="flBevel" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2.5" dy="5.0" stdDeviation="4.0" flood-color="#221100" flood-opacity="0.38" />
      <feDropShadow dx="-1.2" dy="-1.2" stdDeviation="1.8" flood-color="#FFFDF0" flood-opacity="0.9" />
    </filter>
  </defs>

  <g id="full-master-logo" filter="url(#flBevel)">
    <!-- TOP EMBLEM (Center X=400, Y=290, Radius ~180) -->
    <g transform="translate(400, 290)">
      <!-- Guilloche Wreath -->
      <g transform="scale(1.08) translate(-400, -310)">
'''

for i in range(20):
    deg = i * 18
    full_master_logo_svg += f'        <ellipse cx="400" cy="310" rx="175" ry="58" transform="rotate({deg:.2f} 400 310)" fill="none" stroke="url(#flGoldWire)" stroke-width="4.8" />\n'

for i in range(0, 20, 2):
    deg = i * 18
    full_master_logo_svg += f'        <ellipse cx="399" cy="309" rx="175" ry="58" transform="rotate({deg:.2f} 400 310)" fill="none" stroke="url(#flGoldSpec)" stroke-width="1.6" opacity="0.9" />\n'

full_master_logo_svg += '''      </g>

      <!-- Inner Circles -->
      <circle cx="0" cy="0" r="114" fill="none" stroke="url(#flGold3D)" stroke-width="7.5" />
      <circle cx="0" cy="0" r="114" fill="none" stroke="url(#flGoldSpec)" stroke-width="2.5" />
      <circle cx="0" cy="0" r="106" fill="none" stroke="url(#flGold3D)" stroke-width="3.5" />

      <!-- Center Vertical Divider Bar -->
      <rect x="-3.5" y="-76" width="7.0" height="152" rx="3.5" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="1.2" />
      <line x1="-1.0" y1="-74" x2="-1.0" y2="74" stroke="#FFFFFF" stroke-width="1.5" opacity="0.9" />

      <!-- Left Botanical Leaf Cluster -->
      <g transform="translate(-54, 0) scale(1.75)">
        <path d="M 0 -42 C -15 -24, -15 -5, 0 8 C 15 -5, 15 -24, 0 -42 Z" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="2.5" />
        <path d="M -5 -11 C -30 -28, -40 -8, -7 4 C -3 3, -1 -2, -5 -11 Z" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="2" />
        <path d="M 5 -11 C 30 -28, 40 -8, 7 4 C 3 3, 1 -2, 5 -11 Z" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="2" />
        <path d="M -5 6 C -24 5, -29 18, -6 14 Z" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="1.8" />
        <path d="M 5 6 C 24 5, 29 18, 6 14 Z" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="1.8" />
        <path d="M 0 8 L 0 32" stroke="url(#flGold3D)" stroke-width="4.5" stroke-linecap="round" />
      </g>

      <!-- Right Roman Letter 'C' -->
      <g transform="translate(54, 0) scale(1.75)">
        <path d="M 32 -32 C 26 -40, 18 -44, 6 -44 C -17 -44 -32 -26 -32 0 C -32 26 -17 44 6 44 C 19 44 28 38 32 31 L 25 26 C 21 32 15 36 7 36 C -10 36 -21 22 -21 0 C -21 -22 -10 -36 7 -36 C 15 -36 21 -32 24 -27 Z" 
              fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="1.8" />
        <circle cx="31" cy="-30" r="5.5" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="1" />
        <path d="M 23 26 L 36 33 L 24 38 Z" fill="url(#flGold3D)" />
      </g>
    </g>

    <!-- CARe BRAND WORDMARK -->
    <g transform="translate(400, 585)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif" 
            font-size="132" 
            font-weight="700" 
            letter-spacing="14" 
            fill="url(#flGold3D)" 
            stroke="url(#flGoldSpec)" 
            stroke-width="1.8">
        <tspan>C</tspan>
        <tspan dx="8">A</tspan>
        <tspan dx="8">R</tspan>
        <tspan dx="8" font-size="116" dy="-2">e</tspan>
      </text>
    </g>

    <!-- KNOT DIVIDER BAR -->
    <g transform="translate(400, 626)">
      <!-- Left & Right Gold Rule Lines -->
      <line x1="-310" y1="0" x2="-42" y2="0" stroke="url(#flGold3D)" stroke-width="2.6" stroke-linecap="round" />
      <line x1="-310" y1="-0.8" x2="-42" y2="-0.8" stroke="url(#flGoldSpec)" stroke-width="0.8" />

      <line x1="42" y1="0" x2="310" y2="0" stroke="url(#flGold3D)" stroke-width="2.6" stroke-linecap="round" />
      <line x1="42" y1="-0.8" x2="310" y2="-0.8" stroke="url(#flGoldSpec)" stroke-width="0.8" />

      <!-- Center Fleur / Knot Emblem -->
      <g transform="scale(0.85)">
        <path d="M 0 -10 C -8 -6, -8 6, 0 10 C 8 6, 8 -6, 0 -10 Z" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="1.2" />
        <circle cx="-16" cy="0" r="5.5" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="1.0" />
        <circle cx="16" cy="0" r="5.5" fill="url(#flGold3D)" stroke="url(#flGoldSpec)" stroke-width="1.0" />
        <circle cx="-28" cy="0" r="3.2" fill="url(#flGold3D)" />
        <circle cx="28" cy="0" r="3.2" fill="url(#flGold3D)" />
        <circle cx="0" cy="0" r="4.0" fill="#FFF8D8" />
      </g>
    </g>

    <!-- SUBTITLE: A BEAUTY SOLUTION -->
    <g transform="translate(400, 680)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif" 
            font-size="28" 
            font-weight="700" 
            letter-spacing="18" 
            fill="url(#flGold3D)" 
            stroke="url(#flGoldSpec)" 
            stroke-width="0.8">
        A BEAUTY SOLUTION
      </text>
    </g>
  </g>
</svg>'''

# 5. Black Background Master Logo (Matches "black background logo.png")
# Pure luxury dark canvas #0A0A0A with luminous 3D gold relief
black_background_logo_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <!-- Luxury Deep Charcoal / Black Canvas -->
  <rect width="800" height="800" fill="#0A0B0D" rx="28" />
  <radialGradient id="darkBgGlow" cx="50%" cy="36%" r="50%">
    <stop offset="0%" stop-color="#2A2210" stop-opacity="0.6" />
    <stop offset="70%" stop-color="#0A0B0D" stop-opacity="0.9" />
    <stop offset="100%" stop-color="#050607" />
  </radialGradient>
  <rect width="800" height="800" fill="url(#darkBgGlow)" rx="28" />

  {full_master_logo_svg.split("<svg xmlns=")[1].split(">", 1)[1].rsplit("</svg>", 1)[0]}
</svg>'''

# Write all outputs to public/images/
with open("public/images/care-favicon-browsertab.svg", "w") as f:
    f.write(favicon_browser_tab)

with open("public/images/care-favicon-emblem.svg", "w") as f:
    f.write(favicon_emblem_wreath)

with open("public/images/care-header-logo-official.svg", "w") as f:
    f.write(header_logo_svg)

with open("public/images/care-full-master-logo.svg", "w") as f:
    f.write(full_master_logo_svg)

with open("public/images/care-black-background-logo.svg", "w") as f:
    f.write(black_background_logo_svg)

# Also update existing canonical files
with open("public/images/care-official-gold-logo-horizontal.svg", "w") as f:
    f.write(header_logo_svg)

with open("public/images/care-official-gold-logo.svg", "w") as f:
    f.write(full_master_logo_svg)

with open("public/images/care-favicon.svg", "w") as f:
    f.write(favicon_browser_tab)

with open("public/favicon.svg", "w") as f:
    f.write(favicon_browser_tab)

with open("public/images/care-mobile-icon.svg", "w") as f:
    f.write(favicon_emblem_wreath)

with open("public/images/care-emblem-icon.svg", "w") as f:
    f.write(favicon_emblem_wreath)

print("Successfully generated all 6 exact brand variations into public/images/!")
