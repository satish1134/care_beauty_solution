import math

def generate_guilloche_paths():
    num_loops = 24
    outer_paths = []
    for i in range(num_loops):
        angle_deg = i * (360.0 / num_loops)
        outer_paths.append(f'<ellipse cx="50" cy="50" rx="46" ry="14" transform="rotate({angle_deg:.2f} 50 50)" fill="none" stroke="url(#goldWireH)" stroke-width="1.6" opacity="0.95" />')
        outer_paths.append(f'<ellipse cx="50" cy="50" rx="46" ry="14" transform="rotate({angle_deg:.2f} 50 50)" fill="none" stroke="url(#goldSpecularH)" stroke-width="0.8" opacity="0.8" />')
    return "\n    ".join(outer_paths)

svg_h = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 100" width="100%" height="100%">
  <defs>
    <linearGradient id="goldBaseH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#734B0B"/>
      <stop offset="15%" stop-color="#BF8A27"/>
      <stop offset="32%" stop-color="#FCEBA4"/>
      <stop offset="48%" stop-color="#DFAC38"/>
      <stop offset="68%" stop-color="#9C6B14"/>
      <stop offset="85%" stop-color="#FBF0B5"/>
      <stop offset="100%" stop-color="#693F05"/>
    </linearGradient>

    <linearGradient id="goldWireH" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#80530E"/>
      <stop offset="25%" stop-color="#E8BC4C"/>
      <stop offset="50%" stop-color="#FFF5C2"/>
      <stop offset="75%" stop-color="#BD8622"/>
      <stop offset="100%" stop-color="#633904"/>
    </linearGradient>

    <linearGradient id="goldSpecularH" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5E3502" stop-opacity="0.2"/>
      <stop offset="35%" stop-color="#FFFBE0" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#D9A833" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.8"/>
    </linearGradient>

    <linearGradient id="goldRodH" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5C3604"/>
      <stop offset="20%" stop-color="#C7952B"/>
      <stop offset="45%" stop-color="#FFF3BA"/>
      <stop offset="65%" stop-color="#DDA934"/>
      <stop offset="85%" stop-color="#8C570E"/>
      <stop offset="100%" stop-color="#4F2D02"/>
    </linearGradient>

    <filter id="emboss3DH" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#3B2202" flood-opacity="0.5"/>
      <feDropShadow dx="-0.5" dy="-0.5" stdDeviation="0.8" flood-color="#FFF8D1" flood-opacity="0.4"/>
    </filter>
  </defs>

  <g id="care-master-logo-h" filter="url(#emboss3DH)">
    
    <!-- ========================================== -->
    <!-- CIRCULAR EMBLEM (CENTER: 50, 50)           -->
    <!-- ========================================== -->
    <g>
      <!-- OUTSIDE WOVEN GUILLOCHE WREATH -->
      <g>
        {generate_guilloche_paths()}
      </g>

      <!-- INNER SOLID DOUBLE GOLD RINGS -->
      <circle cx="50" cy="50" r="37" fill="none" stroke="url(#goldBaseH)" stroke-width="2.2"/>
      <circle cx="50" cy="50" r="37" fill="none" stroke="url(#goldSpecularH)" stroke-width="0.8"/>
      
      <circle cx="50" cy="50" r="34" fill="none" stroke="url(#goldBaseH)" stroke-width="1.2"/>
      <circle cx="50" cy="50" r="34" fill="none" stroke="url(#goldSpecularH)" stroke-width="0.5"/>

      <!-- CENTRAL VERTICAL DIVIDING GOLD ROD -->
      <rect x="49" y="24" width="2" height="52" rx="1" fill="url(#goldRodH)" stroke="url(#goldSpecularH)" stroke-width="0.4"/>

      <!-- LEFT 5-LEAF BOTANICAL CREST -->
      <g transform="translate(33, 50)">
        <!-- Top vertical leaf -->
        <path d="M 0 -11 C -4 -6, -4 -1, 0 3 C 4 -1, 4 -6, 0 -11 Z" fill="url(#goldBaseH)" stroke="url(#goldSpecularH)" stroke-width="0.6"/>
        <line x1="0" y1="-8" x2="0" y2="2" stroke="#5E3502" stroke-width="0.4" opacity="0.6"/>

        <!-- Upper left & right -->
        <path d="M -1 -2 C -8 -7, -11 -2, -2 1 Z" fill="url(#goldBaseH)" stroke="url(#goldSpecularH)" stroke-width="0.5"/>
        <path d="M 1 -2 C 8 -7, 11 -2, 2 1 Z" fill="url(#goldBaseH)" stroke="url(#goldSpecularH)" stroke-width="0.5"/>

        <!-- Lower left & right -->
        <path d="M -1 1 C -9 -1, -11 5, -2 5 Z" fill="url(#goldBaseH)" stroke="url(#goldSpecularH)" stroke-width="0.5"/>
        <path d="M 1 1 C 9 -1, 11 5, 2 5 Z" fill="url(#goldBaseH)" stroke="url(#goldSpecularH)" stroke-width="0.5"/>

        <!-- Stem -->
        <path d="M 0 2 L 0 9" stroke="url(#goldRodH)" stroke-width="1.6" stroke-linecap="round"/>
      </g>

      <!-- RIGHT CLASSIC ROMAN SERIF 'C' -->
      <g transform="translate(67, 50)">
        <path d="M 8 -8 C 7 -10, 5 -11, 2 -11 C -4 -11, -8 -6, -8 0 C -8 6, -4 11, 2 11 C 5 11, 7 9, 8 8 L 7 7 C 6 8, 4 9, 2 9 C -2 9, -5 5, -5 0 C -5 -5, -2 -9, 2 -9 C 4 -9, 6 -8, 7 -7 Z"
              fill="url(#goldBaseH)" stroke="url(#goldSpecularH)" stroke-width="0.6"/>
        <circle cx="7.5" cy="-8" r="1.5" fill="url(#goldBaseH)"/>
      </g>
    </g>

    <!-- ========================================== -->
    <!-- BRAND WORDMARK 'CARe' & DIVIDER & SUBTITLE -->
    <!-- ========================================== -->
    <g transform="translate(120, 0)">
      
      <!-- 'CARe' Serif Typography (Capital C, A, R, Lowercase e) -->
      <text y="50" font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="46" 
            font-weight="900" 
            letter-spacing="5" 
            fill="url(#goldBaseH)" 
            stroke="url(#goldSpecularH)" 
            stroke-width="1">
        <tspan x="0">C</tspan>
        <tspan x="45">A</tspan>
        <tspan x="92">R</tspan>
        <tspan x="140" font-size="42" dy="1">e</tspan>
      </text>

      <!-- Ornamental Divider -->
      <g transform="translate(0, 64)">
        <line x1="0" y1="0" x2="300" y2="0" stroke="url(#goldBaseH)" stroke-width="1.6"/>
        <line x1="0" y1="-0.4" x2="300" y2="-0.4" stroke="url(#goldSpecularH)" stroke-width="0.6"/>
        
        <!-- Center Knot -->
        <path d="M 150 -4 C 146 0, 146 0, 150 4 C 154 0, 154 0, 150 -4 Z" fill="url(#goldBaseH)" stroke="url(#goldSpecularH)" stroke-width="0.8"/>
        <circle cx="138" cy="0" r="2" fill="url(#goldBaseH)"/>
        <circle cx="162" cy="0" r="2" fill="url(#goldBaseH)"/>
      </g>

      <!-- Subtitle 'A BEAUTY SOLUTION' -->
      <text x="150" y="82" 
            font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', sans-serif" 
            font-size="12" 
            font-weight="900" 
            letter-spacing="5" 
            fill="url(#goldBaseH)" 
            stroke="url(#goldSpecularH)" 
            stroke-width="0.4" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>
"""

with open("public/images/care-official-gold-logo-horizontal.svg", "w") as f:
    f.write(svg_h)

print("Saved public/images/care-official-gold-logo-horizontal.svg successfully!")
