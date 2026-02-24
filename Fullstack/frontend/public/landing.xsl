<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/gearguard-landing">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GearGuard</title>
        <style>
          :root {
            --bg0: #0b1220;
            --bg1: #101a2c;
            --glass: rgba(15, 22, 38, 0.85);
            --border: #273044;
            --text: #e6e9ef;
            --muted: #97a4b8;
            --accent: #5aa6ff;
            --accent2: #9fd1ff;
            --primary: #36a76d;
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            font-family: "Space Grotesk", Inter, system-ui, Arial, sans-serif;
            color: var(--text);
            background: linear-gradient(160deg, var(--bg0) 0%, #0f1a30 60%, var(--bg1) 100%);
          }

          /* ── HEADER ── */
          header {
            position: sticky;
            top: 0;
            z-index: 100;
            width: 100%;
            background: var(--glass);
            backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--border);
          }

          .header-inner {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 32px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .brand {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            background: linear-gradient(135deg, var(--accent2), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .tagline {
            font-size: 13px;
            color: var(--muted);
            margin-left: 12px;
          }

          .brand-group {
            display: flex;
            align-items: baseline;
            gap: 0;
          }

          nav {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          nav a {
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            padding: 8px 18px;
            border-radius: 8px;
            border: 1px solid transparent;
            color: var(--text);
            transition: background 0.2s, border-color 0.2s, color 0.2s;
          }

          nav a:hover {
            background: rgba(90, 166, 255, 0.08);
            border-color: var(--border);
          }

          nav a.nav-cta {
            background: var(--primary);
            color: #fff;
            border-color: var(--primary);
          }

          nav a.nav-cta:hover { background: #2f8f4e; }

          /* ── MAIN ── */
          main { flex: 1; }

          /* ── HERO ── */
          .hero {
            max-width: 1100px;
            margin: 0 auto;
            padding: 96px 32px 80px;
            text-align: center;
          }

          .hero h1 {
            font-size: clamp(32px, 5vw, 58px);
            font-weight: 800;
            line-height: 1.15;
            letter-spacing: -1px;
            margin-bottom: 22px;
            background: linear-gradient(135deg, var(--text) 40%, var(--accent2));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .hero p {
            max-width: 620px;
            margin: 0 auto 36px;
            font-size: 18px;
            color: var(--muted);
            line-height: 1.7;
          }

          .hero-actions {
            display: flex;
            gap: 14px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .hero-actions a {
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            padding: 14px 30px;
            border-radius: 10px;
            border: 1px solid transparent;
            transition: all 0.2s;
          }

          a.primary {
            background: var(--primary);
            color: #fff;
            border-color: var(--primary);
          }

          a.primary:hover { background: #2f8f4e; }

          a.secondary {
            border-color: var(--accent);
            color: var(--accent2);
            background: rgba(90, 166, 255, 0.06);
          }

          a.secondary:hover { background: rgba(90, 166, 255, 0.14); }

          /* ── FEATURES ── */
          .features {
            border-top: 1px solid var(--border);
            background: rgba(255,255,255,0.015);
          }

          .features-inner {
            max-width: 1100px;
            margin: 0 auto;
            padding: 72px 32px;
          }

          .features-inner h2 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 36px;
            color: var(--accent2);
            text-align: center;
          }

          .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
          }

          .feature-card {
            background: rgba(15, 22, 38, 0.6);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
            font-size: 15px;
            color: var(--muted);
            line-height: 1.6;
          }

          /* ── FOOTER ── */
          footer {
            width: 100%;
            border-top: 1px solid var(--border);
            background: rgba(11, 18, 32, 0.9);
          }

          .footer-inner {
            max-width: 1100px;
            margin: 0 auto;
            padding: 28px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }

          .footer-copy {
            font-size: 13px;
            color: var(--muted);
          }

          .footer-links {
            display: flex;
            gap: 20px;
          }

          .footer-links a {
            text-decoration: none;
            font-size: 13px;
            color: var(--muted);
            transition: color 0.2s;
          }

          .footer-links a:hover { color: var(--accent2); }
        </style>
      </head>
      <body>

        <!-- HEADER -->
        <header>
          <div class="header-inner">
            <div class="brand-group">
              <span class="brand"><xsl:value-of select="site-header/brand" /></span>
              <span class="tagline"><xsl:value-of select="site-header/tagline" /></span>
            </div>
            <nav>
              <xsl:for-each select="site-header/header-links/link-item">
                <xsl:choose>
                  <xsl:when test="position() = last()">
                    <a class="nav-cta">
                      <xsl:attribute name="href"><xsl:value-of select="@href" /></xsl:attribute>
                      <xsl:value-of select="@label" />
                    </a>
                  </xsl:when>
                  <xsl:otherwise>
                    <a>
                      <xsl:attribute name="href"><xsl:value-of select="@href" /></xsl:attribute>
                      <xsl:value-of select="@label" />
                    </a>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:for-each>
            </nav>
          </div>
        </header>

        <!-- MAIN -->
        <main>

          <!-- Hero -->
          <section class="hero">
            <h1><xsl:value-of select="site-main/hero-section/hero-title" /></h1>
            <p><xsl:value-of select="site-main/hero-section/hero-description" /></p>
            <div class="hero-actions">
              <xsl:for-each select="site-main/hero-section/hero-actions/action-link">
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="@href" /></xsl:attribute>
                  <xsl:attribute name="class"><xsl:value-of select="@variant" /></xsl:attribute>
                  <xsl:value-of select="@label" />
                </a>
              </xsl:for-each>
            </div>
          </section>

          <!-- Features -->
          <section class="features">
            <div class="features-inner">
              <h2><xsl:value-of select="site-main/feature-section/section-title" /></h2>
              <div class="feature-grid">
                <xsl:for-each select="site-main/feature-section/feature-list/feature-item">
                  <div class="feature-card"><xsl:value-of select="." /></div>
                </xsl:for-each>
              </div>
            </div>
          </section>

        </main>

        <!-- FOOTER -->
        <footer>
          <div class="footer-inner">
            <span class="footer-copy"><xsl:value-of select="site-footer/footer-text" /></span>
            <div class="footer-links">
              <xsl:for-each select="site-footer/footer-links/link-item">
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="@href" /></xsl:attribute>
                  <xsl:value-of select="@label" />
                </a>
              </xsl:for-each>
            </div>
          </div>
        </footer>

      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
