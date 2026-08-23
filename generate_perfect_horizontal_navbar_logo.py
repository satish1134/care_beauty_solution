import math

def generate_perfect_navbar_logo():
    # Emblem at cx=45, cy=45, radius 38
    cx, cy = 46, 45
    rx, ry = 36, 12
    num_loops = 24
    
    wire_layers = []
    # Drop shadow
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wire_layers.append(f'<ellipse cx="{cx+0.8}" cy="{cy+1.5}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="#241200" stroke-width="1.6" opacity="0.3" />')
    
    # Gold wire
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wire_layers.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="url(#navGoldWire)" stroke-width="2" />')
        
    # Specular shine
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wire_layers.append(f'<ellipse cx="{cx-0.4}" cy="{cy-0.4}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="url(#navGoldSpec)" stroke-width="0.8" opacity="0.85" />')

    wires_markup = "\n    ".join(wire_layers)

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 90" width="100%" height="100%">
  <defs>
    <linearGradient id="navGoldMaster" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5E3D07" />
      <stop offset="15%" stop-color="#9C6B14" />
      <stop offset="28%" stop-color="#C9A227" />
      <stop offset="45%" stop-color="#FFF2B2" />
      <stop offset="60%" stop-color="#E8C76A" />
      <stop offset="78%" stop-color="#8C6A12" />
      <stop offset="90%" stop-color="#FBF0B5" />
      <stop offset="100%" stop-color="#4F2D02" />
    </linearGradient>

    <linearGradient id="navGoldWire" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#6B4509" />
      <stop offset="25%" stop-color="#C9A227" />
      <stop offset="50%" stop-color="#FFF5C6" />
      <stop offset="75%" stop-color="#8C6A12" />
      <stop offset="100%" stop-color="#4D2B02" />
    </linearGradient>

    <linearGradient id="navGoldSpec" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B2001" stop-opacity="0.1" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <linearGradient id="navGoldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8C6A12" />
      <stop offset="30%" stop-color="#FFF0A8" />
      <stop offset="60%" stop-color="#C9A227" />
      <stop offset="100%" stop-color="#5E3D07" />
    </linearGradient>

    <filter id="navShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.2" dy="2.2" stdDeviation="1.5" flood-color="#261400" flood-opacity="0.4" />
      <feDropShadow dx="-0.6" dy="-0.6" stdDeviation="1" flood-color="#FFFBE0" flood-opacity="0.6" />
    </filter>
  </defs>

  <g id="care-navbar-brand-lockup" filter="url(#navShadow)">
    
    <!-- ========================================== -->
    <!-- CIRCULAR EMBLEM (CENTER: 46, 45)           -->
    <!-- ========================================== -->
    <g id="emblem">
      {wires_markup}

      <!-- Double Gold Rings -->
      <circle cx="46" cy="45" r="30" fill="none" stroke="url(#navGoldMaster)" stroke-width="2.2" />
      <circle cx="46" cy="45" r="30" fill="none" stroke="url(#navGoldSpec)" stroke-width="0.8" />
      <circle cx="46" cy="45" r="27.5" fill="none" stroke="url(#navGoldMaster)" stroke-width="1" />

      <!-- Center Vertical Dividing Bar -->
      <rect x="45.1" y="22" width="1.8" height="46" rx="0.9" fill="url(#navGoldMaster)" stroke="url(#navGoldSpec)" stroke-width="0.4" />
      <line x1="45.8" y1="23" x2="45.8" y2="67" stroke="#FFFFFF" stroke-width="0.4" opacity="0.9" />

      <!-- Left 5-Leaf Botanical Crest -->
      <g transform="translate(29, 45)">
        <!-- Top vertical leaf -->
        <path d="M 0 -10.5 C -3.8 -6, -3.8 -2, 0 2 C 3.8 -2, 3.8 -6, 0 -10.5 Z" fill="url(#navGoldLeaf)" stroke="url(#navGoldMaster)" stroke-width="0.7" />
        <line x1="0" y1="-8.5" x2="0" y2="1.8" stroke="#5E3D07" stroke-width="0.5" />
        <!-- Angled Leaves -->
        <path d="M -1.2 -2.5 C -6.8 -6.5, -10.5 -1.8, -2 1.5 Z" fill="url(#navGoldLeaf)" stroke="url(#navGoldMaster)" stroke-width="0.6" />
        <path d="M 1.2 -2.5 C 6.8 -6.5, 10.5 -1.8, 2 1.5 Z" fill="url(#navGoldLeaf)" stroke="url(#navGoldMaster)" stroke-width="0.6" />
        <!-- Horizontal Leaves -->
        <path d="M -1.2 1.5 C -7.5 0.5, -9.5 5.5, -1.5 4.8 Z" fill="url(#navGoldLeaf)" stroke="url(#navGoldMaster)" stroke-width="0.6" />
        <path d="M 1.2 1.5 C 7.5 0.5, 9.5 5.5, 1.5 4.8 Z" fill="url(#navGoldLeaf)" stroke="url(#navGoldMaster)" stroke-width="0.6" />
        <!-- Stem -->
        <path d="M 0 2 L 0 9" stroke="url(#navGoldMaster)" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="0" cy="9" r="0.9" fill="url(#navGoldMaster)" />
      </g>

      <!-- Right Roman Serif 'C' -->
      <g transform="translate(63.5, 45)">
        <path d="M 7.5 -7.8 C 6.2 -9.5, 4.2 -10.5, 1.5 -10.5 C -4.2 -10.5 -8 -6.2 -8 0 C -8 6.2 -4.2 10.5 1.5 10.5 C 4.2 10.5 6.2 9.2 7.5 7.2 L 6 5.8 C 4.8 7.2 3.4 8.2 1.5 8.2 C -2.8 8.2 -5.2 5.2 -5.2 0 C -5.2 -5.2 -2.8 -8.2 1.5 -8.2 C 3.4 -8.2 4.8 -7.2 5.8 -5.5 Z" 
              fill="url(#navGoldMaster)" stroke="url(#navGoldSpec)" stroke-width="0.5" />
        <circle cx="7.2" cy="-7.2" r="1.4" fill="url(#navGoldMaster)" stroke="url(#navGoldSpec)" stroke-width="0.3" />
        <path d="M 5.2 5.8 L 8.5 7.2 L 5.8 8.2 Z" fill="url(#navGoldMaster)" />
      </g>
    </g>

    <!-- ========================================== -->
    <!-- RIGHT: 'CARe' (CLASSICAL LUXURY SERIF)     -->
    <!-- ========================================== -->
    <g transform="translate(98, 56)">
      <text font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="44" 
            font-weight="900" 
            letter-spacing="6" 
            fill="url(#navGoldMaster)" 
            stroke="url(#navGoldSpec)" 
            stroke-width="1">
        <tspan x="0">C</tspan>
        <tspan x="38">A</tspan>
        <tspan x="78">R</tspan>
        <tspan x="118" font-size="39" dy="1">e</tspan>
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo-horizontal.svg", "w") as f:
        f.write(svg_content)
    print("Horizontal navbar logo updated in public/images/care-official-gold-logo-horizontal.svg")

if __name__ == "__main__":
    generate_perfect_navbar_logo()
