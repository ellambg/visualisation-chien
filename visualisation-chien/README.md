# 🐾 Visualisation de données — Chiens Abandonnés

> Projet VisualDon · HEIG-VD 2025 · Ella Maiburg

Site web de type **scrollytelling** pour sensibiliser au phénomène des animaux abandonnés,
avec un focus progressif sur les chiens en Suisse.

---

## Structure du projet

```
visualisation-chien/
├── index.html              # Page principale (scrollytelling)
├── css/
│   └── style.css           # Styles globaux, thème dark, animations
├── js/
│   ├── app.js              # Orchestrateur principal
│   ├── map.js              # Cartes (D3 + Leaflet)
│   └── charts.js           # Visualisations (D3 : points, barres, timeline, donut)
├── data/
│   └── data.json           # Toutes les données (monde, Europe, Suisse, refuges, social)
└── images/
    └── (wireframe, captures...)
```

---

## Librairies utilisées

| Librairie | Version | Usage |
|-----------|---------|-------|
| D3.js     | v7      | Cartes choroplèthes, graphiques, animations |
| TopoJSON  | v3      | Géodonnées monde / Europe |
| Leaflet   | v1.9.4  | Carte interactive Suisse + refuges |

Toutes les librairies sont chargées via CDN — aucun bundler requis.

---

## Lancer le projet

```bash
# Cloner le dépôt
git clone https://github.com/ellambg/visualisation-chien.git
cd visualisation-chien

# Lancer un serveur local (requis pour fetch les fichiers)
npx serve .
# ou
python3 -m http.server 8080
```

Ouvrir [http://localhost:8080](http://localhost:8080) dans le navigateur.

> ⚠️ Un serveur HTTP local est nécessaire à cause des appels `fetch()` vers `data/data.json`
> et les GeoJSON des cartes. L'ouverture directe du fichier `index.html` ne fonctionnera pas.

---

## Sections de la visualisation

1. **Hero** — Titre et stat d'accroche (200 millions de chiens errants)
2. **Monde** — Carte mondiale avec localisation de la Suisse
3. **Europe** — Choroplèthe des chiens errants par pays (survol interactif)
4. **Suisse** — Carte Leaflet par canton (bulles proportionnelles)
5. **Points animés** — Nuage → diagramme en bâton (Canvas + D3)
6. **Statistiques** — Bâtons par canton + donut des types d'admission
7. **Timeline** — Évolution annuelle 2018–2023
8. **Réseaux sociaux** — Grille illustrative (TikTok / Instagram)
9. **Refuges** — Recherche par code postal + carte Leaflet
10. **Méthode** — Transparence sur les sources

---

## Sources des données

- **PSA / STS** — Protection Suisse des Animaux · statistiques des refuges affiliés
- **OMS** — Estimation des chiens errants mondiaux (via ONG)
- **RTS** — Contextualisation médiatique suisse
- **Shelter Animals Count** — Comparaisons internationales
- **OpenStreetMap** — Géodonnées cartographiques

---

## À faire / pistes d'amélioration

- [ ] Intégrer les vraies données PSA au format CSV
- [ ] Ajouter les géodonnées officielles des cantons suisses (GeoJSON)
- [ ] Embed réel de vidéos TikTok / Instagram via oEmbed
- [ ] Mode mobile optimisé
- [ ] Export PDF / partage des statistiques

---

## Remarque sur les données

Les données dans `data/data.json` sont partiellement simulées pour les besoins
du prototype. Les ordres de grandeur sont basés sur les sources réelles (PSA, OMS)
mais les valeurs cantonales détaillées sont des estimations proportionnelles.
