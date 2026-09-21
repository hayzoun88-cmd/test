class Component extends DCLogic {
  state = { route: "accueil", query: {}, menuOpen: false, videoIntro: true, slide: 0, leadStatus: "", cat: "", sent: false, error: "", files: [], recap: "", copyStatus: "" };
  routes = ["accueil", "sport", "textile", "a-propos", "devis"];
  lastRoute = "accueil";
  theme = (() => { try { return localStorage.getItem("freshmerch-theme") === "light" ? "light" : "dark"; } catch (e) { return "dark"; } })();
  applyTheme() { document.documentElement.setAttribute("data-theme", this.theme); try { localStorage.setItem("freshmerch-theme", this.theme); } catch (e) {} }
  parseHash() {
    const raw = (window.location.hash || "#accueil").slice(1);
    const [path, qs] = raw.split("?");
    if (!this.routes.includes(path)) return null;
    return { route: path, query: Object.fromEntries(new URLSearchParams(qs || "")) };
  }
  reveal() { import("./site.js").then(m => m.initReveal(document)).catch(() => {}); }
  componentDidMount() {
    const r = this.parseHash(); if (r) this.setState(r);
    this.onHash = () => {
      const r = this.parseHash();
      if (!r) return; // ancre interne (#catalogue…) : on laisse le navigateur défiler
      if (r.route !== this.state.route) window.scrollTo(0, 0);
      document.body.style.overflow = "";
      this.setState({ ...r, sent: false, error: "", menuOpen: false });
    };
    window.addEventListener("hashchange", this.onHash);
    this.applyTheme();
    this.slideTimer = setInterval(() => this.setState(s => ({ slide: (s.slide + 1) % 6 })), 3200);
    this.reveal();
  }
  componentWillUnmount() { window.removeEventListener("hashchange", this.onHash); clearInterval(this.slideTimer); }
  componentDidUpdate() { if (this.state.route !== this.lastRoute) { this.lastRoute = this.state.route; setTimeout(() => this.reveal(), 30); } }
  renderVals() {
    const { route, query } = this.state;
    const sport = query.sport;
    const q = (s) => `#devis?sport=${encodeURIComponent(s)}`;
    const lines = { Football: "Une identité pensée pour le terrain.", Handball: "Coupe ample, matière qui respire.", Basketball: "Débardeur et short assortis, numéros intégrés.", Rugby: "Renforts et coutures pensés pour le contact.", Running: "Léger, ajusté, visible.", Esports: "Le jersey de scène, jusqu'au dernier sponsor." };
    const sportsData = [["Football", "football"], ["Handball", "handball"], ["Basketball", "basketball"], ["Rugby", "rugby"], ["Running", "running"], ["Esports", "esports"]];
    const cats = [["", "Tout voir"], ["tshirts", "T-shirts & débardeurs"], ["sweats", "Sweats & hoodies"], ["polos", "Polos & vestes"], ["bas", "Bas & accessoires"]];
    const labels = { tshirts: "T-shirts", sweats: "Sweats", polos: "Polos & vestes", bas: "Bas & accessoires" };
    const arts = {
      tshirts: "radial-gradient(circle at 70% 25%,#3d90ff,transparent 55%),linear-gradient(140deg,#071225,#0b2b66)",
      sweats: "radial-gradient(circle at 20% 15%,#ffcc00,transparent 50%),linear-gradient(135deg,#0a1830,#143f8c)",
      polos: "radial-gradient(circle at 70% 25%,#3d90ff,transparent 55%),linear-gradient(145deg,#0b1220,#18283e)",
      bas: "radial-gradient(circle at 30% 20%,#ff5b6e,transparent 48%),linear-gradient(140deg,#071225,#153a79)"
    };
    const products = [
      ["tshirts", "T-shirt col rond", "Coton 180 g, coupe droite. Flocage ou impression numérique.", "T-SHIRT"],
      ["tshirts", "T-shirt technique", "Polyester respirant pour l'entraînement et les événements sportifs.", "TECHNIQUE"],
      ["tshirts", "Débardeur", "Léger et ajusté, idéal running et salle.", "DÉBARDEUR"],
      ["sweats", "Sweat col rond", "Molleton 300 g brossé. Broderie poitrine ou flocage dos.", "SWEAT"],
      ["sweats", "Hoodie zippé", "Capuche doublée, poches kangourou, marquage broderie.", "HOODIE"],
      ["polos", "Polo piqué", "Maille piquée 200 g, broderie logo poitrine.", "POLO"],
      ["polos", "Veste softshell", "Coupe-vent déperlante, broderie ou transfert.", "SOFTSHELL"],
      ["bas", "Jogging", "Molleton, taille élastiquée, marquage cuisse.", "JOGGING"],
      ["bas", "Casquette", "6 panneaux, broderie 3D frontale.", "CASQUETTE"]
    ];
    const fields = [["nom","Nom"],["prenom","Prénom"],["societe","Société"],["fonction","Fonction"],["email","Email"],["telephone","Téléphone"],["type_de_projet","Type de projet"],["date_souhaitee","Date souhaitée"],["produit","Produits"],["quantite","Quantité"],["delai_souhaite","Délai"],["budget_indicatif","Budget"],["type_personnalisation","Technique"],["couleurs","Couleurs"],["logo","Logo"],["noms_numeros","Noms & numéros"],["sponsors","Sponsors"],["description","Description"]];
    return {
      isAccueil: route === "accueil", isSport: route === "sport", isTextile: route === "textile", isApropos: route === "a-propos", isDevis: route === "devis",
      year: new Date().getFullYear(),
      isLight: this.theme === "light", themeLabel: this.theme === "light" ? "Mode sombre" : "Mode clair", themeAria: this.theme === "light" ? "Activer le mode sombre" : "Activer le mode clair",
      menuOpen: this.state.menuOpen, menuAria: this.state.menuOpen ? "Fermer le menu" : "Ouvrir le menu",
      toggleMenu: () => this.setState(s => { document.body.style.overflow = s.menuOpen ? "" : "hidden"; return { menuOpen: !s.menuOpen }; }),
      closeMenu: () => { document.body.style.overflow = ""; this.setState({ menuOpen: false }); },
      showIntro: this.state.videoIntro,
      skipIntro: () => this.setState({ videoIntro: false }),
      toggleTheme: () => { this.theme = this.theme === "light" ? "dark" : "light"; this.applyTheme(); this.forceUpdate(); },
      showMarquee: this.props.showMarquee ?? true,
      marquee: (() => {
        const words = ["MAILLOTS", "SHORTS", "CHAUSSETTES", "SURVÊTEMENTS", "VESTES", "SWEATS", "T-SHIRTS", "POLOS", "DÉBARDEURS", "CASQUETTES", "SACS", "SERVIETTES"];
        return React.createElement("div", { "aria-hidden": "true", style: { overflow: "hidden", background: "#071225", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)", padding: "12px 0", maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)" } },
          React.createElement("div", { style: { display: "flex", width: "max-content", animation: "fmMarquee 40s linear infinite", willChange: "transform" } },
            [0, 1, 2].map(r => React.createElement("div", { key: r, style: { display: "flex", alignItems: "center", flexShrink: 0 } },
              words.map((w) => React.createElement(React.Fragment, { key: w },
                React.createElement("span", { style: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: ".16em", color: "#c3cddb", padding: "0 22px", whiteSpace: "nowrap" } }, w),
                React.createElement("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "#ffed00", flexShrink: 0 } })
              ))))));
      })(),
      // Accueil
      sportSlideshow: React.createElement("div", { style: { position: "absolute", inset: 0 } },
        ["football", "handball", "basketball", "rugby", "running", "esports"].map((f, i) => React.createElement("img", {
          key: f, src: `assets/sports-photos/${f}.jpg`, alt: `Visuel FreshMerch ${f}`, loading: "lazy",
          style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: i === this.state.slide ? 1 : 0, transform: i === this.state.slide ? "scale(1)" : "scale(1.04)", transition: "opacity 1s cubic-bezier(.2,.75,.2,1), transform 1.2s cubic-bezier(.2,.75,.2,1)" }
        })).concat([React.createElement("div", { key: "dots", style: { position: "absolute", left: 16, bottom: 14, display: "flex", gap: 6 } },
          [0,1,2,3,4,5].map(i => React.createElement("span", { key: i, style: { width: i === this.state.slide ? 22 : 6, height: 6, borderRadius: 999, background: i === this.state.slide ? "#ffed00" : "rgba(255,255,255,.4)", transition: "width .4s cubic-bezier(.2,.75,.2,1)" } })))])),
      craft: [
        { n: "01", title: "Design", text: "Une direction visuelle claire, pensée pour votre identité." },
        { n: "02", title: "Matières", text: "Des supports adaptés à l'usage, au confort et à la performance." },
        { n: "03", title: "Sublimation", text: "Des couleurs et détails intégrés directement au textile." },
        { n: "04", title: "Coupe & finition", text: "Une pièce pensée pour tomber juste et durer." },
        { n: "05", title: "Contrôle qualité", text: "Un regard sur chaque détail avant que le textile arrive sur le terrain." }
      ],
      leadStatus: this.state.leadStatus,
      submitLead: (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        const body = `Nom : ${f.get("name")}\nEmail : ${f.get("email")}\n\nProjet :\n${f.get("message")}`;
        window.location.href = `mailto:jules.frescaline@gmail.com?subject=${encodeURIComponent("Nouveau projet FreshMerch")}&body=${encodeURIComponent(body)}`;
        this.setState({ leadStatus: "Votre messagerie s'ouvre avec la demande pré-remplie." });
      },
      // Sport
      sports: sportsData.map(([name, file], i) => ({ n: String(i + 1).padStart(2, "0"), name, lower: name.toLowerCase(), line: lines[name], img: `assets/sports-photos/${file}.jpg`, alt: `Visuel FreshMerch ${name.toLowerCase()}`, href: q(name), span: "auto" })),
      tech: [
        { n: "01", title: "Design vectoriel", text: "Votre identité — couleurs, numéros, sponsors — est déclinée sur un patron adapté à la coupe choisie." },
        { n: "02", title: "Impression & transfert", text: "Le motif est imprimé puis thermofixé sur une matière technique respirante." },
        { n: "03", title: "Confection", text: "Assemblage et finitions (coutures plates, empiècements) adaptés à l'usage sportif." }
      ],
      // Textile
      cats: cats.map(([id, label]) => { const active = this.state.cat === id; return { id, label, active, bg: active ? "#071225" : "transparent", fg: active ? "#fff" : "#5c6879", select: () => this.setState({ cat: id }) }; }),
      products: products.filter(([c]) => !this.state.cat || c === this.state.cat).map(([c, name, desc, tag]) => ({ name, desc, tag, catLabel: labels[c], art: arts[c] })),
      techTextile: [
        { n: "01", title: "Flocage textile", text: "Votre visuel est découpé dans un film puis appliqué à la presse chaude. Idéal pour les gros aplats de couleur et les petites séries." },
        { n: "02", title: "Broderie", text: "Un rendu texturé et durable, parfait pour les logos et les finitions premium sur polos, vestes et casquettes." },
        { n: "03", title: "Impression numérique", text: "Pour les visuels complexes et les dégradés, directement sur le textile." }
      ],
      // À propos
      values: [
        { n: "01", title: "Transparence", text: "Un devis clair, un délai annoncé et respecté, aucune surprise à la livraison." },
        { n: "02", title: "Exigence", text: "Chaque pièce est contrôlée avant expédition : matière, coupe, marquage." },
        { n: "03", title: "Proximité", text: "Un interlocuteur unique du premier échange jusqu'au retour terrain de vos équipes." }
      ],
      method: [
        { n: "01", title: "Échange initial", text: "Nous cadrons le besoin : type de textile, quantité, délai, budget et identité visuelle." },
        { n: "02", title: "Proposition & design", text: "Nous vous soumettons une direction visuelle et un devis détaillé pour validation." },
        { n: "03", title: "Production", text: "Flocage, broderie ou sublimation selon la technique la plus adaptée à votre projet." },
        { n: "04", title: "Contrôle & livraison", text: "Chaque pièce est vérifiée avant expédition, avec suivi jusqu'à réception." }
      ],
      // Devis
      defaultType: sport ? "Sport & sublimation (maillots, tenues d'équipe)" : "",
      defaultProduct: sport ? `Maillots ${sport}` : "",
      stepsNav: [["1","Vous"],["2","Projet"],["3","Envoi"]].map(([n,label]) => ({ n, label, href: `#fs-${n}` })),
      sent: this.state.sent, hasError: !!this.state.error, error: this.state.error, copyStatus: this.state.copyStatus,
      filesLabel: this.state.files.length ? this.state.files.join(", ") : "PDF, PNG, JPG, SVG, ZIP — 10 Mo max par fichier",
      onFiles: (e) => this.setState({ files: Array.from(e.target.files).map(f => f.name) }),
      copyRecap: async () => { try { await navigator.clipboard.writeText(this.state.recap); this.setState({ copyStatus: "Copié !" }); } catch { this.setState({ copyStatus: "Copie impossible — sélectionnez le texte manuellement." }); } },
      submit: (e) => {
        e.preventDefault();
        const form = e.target;
        const missing = Array.from(form.querySelectorAll("[required]")).filter(el => el.type === "checkbox" ? !el.checked : !el.value.trim());
        if (missing.length) { this.setState({ error: "Merci de compléter les champs obligatoires (*) avant d'envoyer.", sent: false }); missing[0].focus(); return; }
        const f = new FormData(form);
        const linesOut = fields.map(([k, l]) => f.get(k) ? `${l} : ${f.get(k)}` : null).filter(Boolean);
        if (this.state.files.length) linesOut.push(`\nFichiers à joindre : ${this.state.files.join(", ")}`);
        const recap = linesOut.join("\n");
        window.location.href = `mailto:jules.frescaline@gmail.com?subject=${encodeURIComponent("Demande de devis FreshMerch — " + f.get("prenom") + " " + f.get("nom"))}&body=${encodeURIComponent(recap)}`;
        this.setState({ sent: true, error: "", recap });
      }
    };
  }
}
