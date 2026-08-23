import math

def generate_guilloche_paths():
    # 24 overlapping circular arcs/ellipses forming the braided wire wreath
    # In the logo: 24 outer rounded wire loops overlapping each other
    num_loops = 24
    outer_paths = []
    
    # Generate 24 rotated loop paths
    # Each loop is a narrow rounded petal / wire loop from r_in to r_out
    for i in range(num_loops):
        angle_deg = i * (360.0 / num_loops)
        angle_rad = math.radians(angle_deg)
        
        # A tilted ellipse or bezier petal
        outer_paths.append(f'<ellipse cx="250" cy="250" rx="148" ry="46" transform="rotate({angle_deg:.2f} 250 250)" fill="none" stroke="url(#goldWire)" stroke-width="3" opacity="0.9" />')
        outer_paths.append(f'<ellipse cx="250" cy="250" rx="148" ry="46" transform="rotate({angle_deg:.2f} 250 250)" fill="none" stroke="url(#goldSpecular)" stroke-width="1.2" opacity="0.8" />')
        
    return "\n    ".join(outer_paths)

svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 680" width="100%" height="100%">
  <defs>
    <!-- Rich 3D Realistic Gold Gradients matching the master render -->
    <linearGradient id="goldBase" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#734B0B"/>
      <stop offset="15%" stop-color="#BF8A27"/>
      <stop offset="32%" stop-color="#FCEBA4"/>
      <stop offset="48%" stop-color="#DFAC38"/>
      <stop offset="68%" stop-color="#9C6B14"/>
      <stop offset="85%" stop-color="#FBF0B5"/>
      <stop offset="100%" stop-color="#693F05"/>
    </linearGradient>

    <linearGradient id="goldWire" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#80530E"/>
      <stop offset="25%" stop-color="#E8BC4C"/>
      <stop offset="50%" stop-color="#FFF5C2"/>
      <stop offset="75%" stop-color="#BD8622"/>
      <stop offset="100%" stop-color="#633904"/>
    </linearGradient>

    <linearGradient id="goldSpecular" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5E3502" stop-opacity="0.2"/>
      <stop offset="35%" stop-color="#FFFBE0" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#D9A833" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.8"/>
    </linearGradient>

    <linearGradient id="goldRod" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5C3604"/>
      <stop offset="20%" stop-color="#C7952B"/>
      <stop offset="45%" stop-color="#FFF3BA"/>
      <stop offset="65%" stop-color="#DDA934"/>
      <stop offset="85%" stop-color="#8C570E"/>
      <stop offset="100%" stop-color="#4F2D02"/>
    </linearGradient>

    <!-- Master Emboss Filter for 3D metallic volume & shadow -->
    <filter id="emboss3D" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="3.5" stdDeviation="3" flood-color="#3B2202" flood-opacity="0.45"/>
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#FFF8D1" flood-opacity="0.4"/>
    </filter>

    <filter id="textDepth" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" flood-color="#3B2202" flood-opacity="0.5"/>
    </filter>
  </defs>

  <g id="care-master-logo" filter="url(#emboss3D)">
    
    <!-- ========================================== -->
    <!-- CIRCULAR EMBLEM (CENTER: 300, 230)        -->
    <!-- ========================================== -->
    <g transform="translate(50, -20)">
      
      <!-- OUTSIDE WOVEN GUILLOCHE WREATH -->
      <g>
        {generate_guilloche_paths()}
      </g>

      <!-- INNER SOLID DOUBLE GOLD RINGS -->
      <circle cx="250" cy="250" r="118" fill="none" stroke="url(#goldBase)" stroke-width="5.5"/>
      <circle cx="250" cy="250" r="118" fill="none" stroke="url(#goldSpecular)" stroke-width="2"/>
      
      <circle cx="250" cy="250" r="110" fill="none" stroke="url(#goldBase)" stroke-width="2.5"/>
      <circle cx="250" cy="250" r="110" fill="none" stroke="url(#goldSpecular)" stroke-width="1"/>

      <!-- CENTRAL VERTICAL DIVIDING GOLD ROD (Rounded 3D Bar) -->
      <rect x="247" y="165" width="6" height="170" rx="3" fill="url(#goldRod)" stroke="url(#goldSpecular)" stroke-width="0.8"/>

      <!-- ========================================== -->
      <!-- LEFT 5-LEAF BOTANICAL CREST WITH VEINS     -->
      <!-- ========================================== -->
      <g transform="translate(195, 250)">
        <!-- 1. Center Top Vertical Leaf -->
        <path d="M 0 -36 C -11 -20, -11 -4, 0 8 C 11 -4, 11 -20, 0 -36 Z" 
              fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1.8"/>
        <line x1="0" y1="-28" x2="0" y2="6" stroke="#5E3502" stroke-width="1.4" opacity="0.6"/>

        <!-- 2. Upper Left Leaf -->
        <path d="M -4 -8 C -24 -22, -36 -6, -8 4 C -4 3, -2 0, -4 -8 Z" 
              fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1.6"/>
        <line x1="-16" y1="-10" x2="-4" y2="1" stroke="#5E3502" stroke-width="1.2" opacity="0.6"/>

        <!-- 3. Upper Right Leaf -->
        <path d="M 4 -8 C 24 -22, 36 -6, 8 4 C 4 3, 2 0, 4 -8 Z" 
              fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1.6"/>
        <line x1="16" y1="-10" x2="4" y2="1" stroke="#5E3502" stroke-width="1.2" opacity="0.6"/>

        <!-- 4. Lower Left Leaf -->
        <path d="M -4 4 C -28 -2, -34 16, -6 16 C -2 14, -2 8, -4 4 Z" 
              fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1.6"/>
        <line x1="-18" y1="8" x2="-3" y2="10" stroke="#5E3502" stroke-width="1.2" opacity="0.6"/>

        <!-- 5. Lower Right Leaf -->
        <path d="M 4 4 C 28 -2, 34 16, 6 16 C 2 14, 2 8, 4 4 Z" 
              fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1.6"/>
        <line x1="18" y1="8" x2="3" y2="10" stroke="#5E3502" stroke-width="1.2" opacity="0.6"/>

        <!-- Central Stem -->
        <path d="M 0 6 L 0 28" stroke="url(#goldRod)" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="0" cy="28" r="2.5" fill="url(#goldBase)"/>
      </g>

      <!-- ========================================== -->
      <!-- RIGHT CLASSIC ROMAN SERIF 'C'              -->
      <!-- ========================================== -->
      <g transform="translate(305, 250)">
        <!-- Custom vector serif C matching the exact stroke contrast -->
        <path d="M 24 -26 C 21 -30, 16 -34, 7 -34 C -12 -34, -24 -20, -24 0 C -24 20, -12 34, 7 34 C 16 34, 22 29, 25 24 L 21 21 C 18 25, 13 28, 6 28 C -7 28, -15 17, -15 0 C -15 -17, -7 -28, 6 -28 C 13 -28, 18 -25, 20 -22 Z"
              fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1.8"/>
        <!-- Top serif teardrop terminal -->
        <circle cx="23" cy="-25" r="4.5" fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1"/>
        <!-- Bottom serif terminal -->
        <path d="M 18 21 L 27 26 L 20 28 Z" fill="url(#goldBase)"/>
      </g>
    </g>

    <!-- ========================================== -->
    <!-- BRAND WORDMARK 'CARe'                      -->
    <!-- Capital C, Capital A, Capital R, Lowercase e -->
    <!-- ========================================== -->
    <g transform="translate(300, 485)" filter="url(#textDepth)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="82" 
            font-weight="900" 
            letter-spacing="14" 
            fill="url(#goldBase)" 
            stroke="url(#goldSpecular)" 
            stroke-width="1.8">
        <tspan x="-135">C</tspan>
        <tspan x="-45">A</tspan>
        <tspan x="45">R</tspan>
        <tspan x="135" font-size="76" dy="2">e</tspan>
      </text>
    </g>

    <!-- ========================================== -->
    <!-- ORNAMENTAL DIVIDER WITH BOTANICAL KNOT     -->
    <!-- ========================================== -->
    <g transform="translate(300, 535)">
      <!-- Left tapering rule -->
      <line x1="-220" y1="0" x2="-35" y2="0" stroke="url(#goldBase)" stroke-width="2.8"/>
      <line x1="-220" y1="-0.6" x2="-35" y2="-0.6" stroke="url(#goldSpecular)" stroke-width="1"/>

      <!-- Center Ornate Fleur-de-lis / Botanical Knot -->
      <g transform="translate(0, 0)">
        <!-- Center diamond loop -->
        <path d="M 0 -8 C -7 -1, -7 1, 0 8 C 7 1, 7 -1, 0 -8 Z" fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1.2"/>
        <!-- Left loop -->
        <path d="M -2 0 C -12 -8, -18 0, -2 4 Z" fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1"/>
        <!-- Right loop -->
        <path d="M 2 0 C 12 -8, 18 0, 2 4 Z" fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="1"/>
        <!-- Flanking gold beads -->
        <circle cx="-22" cy="0" r="3.5" fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="0.8"/>
        <circle cx="22" cy="0" r="3.5" fill="url(#goldBase)" stroke="url(#goldSpecular)" stroke-width="0.8"/>
      </g>

      <!-- Right tapering rule -->
      <line x1="35" y1="0" x2="220" y2="0" stroke="url(#goldBase)" stroke-width="2.8"/>
      <line x1="35" y1="-0.6" x2="220" y2="-0.6" stroke="url(#goldSpecular)" stroke-width="1"/>
    </g>

    <!-- ========================================== -->
    <!-- SUBTITLE 'A BEAUTY SOLUTION'               -->
    <!-- ========================================== -->
    <g transform="translate(300, 580)" filter="url(#textDepth)">
      <text font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', Georgia, serif" 
            font-size="21" 
            font-weight="900" 
            letter-spacing="10" 
            fill="url(#goldBase)" 
            stroke="url(#goldSpecular)" 
            stroke-width="0.8" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>
"""

with open("public/images/care-official-gold-logo.svg", "w") as f:
    f.write(svg_content)

print("Saved public/images/care-official-gold-logo.svg successfully!")
