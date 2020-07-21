# Styling

Utilizziamo [SASS](https://sass-lang.com/) con l'architettura, generalmente adottata per progetti di medio-grandi dimensioni, conosciuta come [7-1 pattern](https://sass-guidelin.es/#the-7-1-pattern). 

?> :open_book: &nbsp; Sass è un CSS pre-processor che, consentendo l'utilizzo di variabili, mixin, import ed altre funzionalità, rende la scrittura di codice CSS più potente. 


In pratica si hanno tutti i file parziali dentro sette cartelle differenti e un singolo file al livello root (il main.scss) che, importando il resto dei file, verrà poi compilato in un unico foglio CSS.

```
styles/
|
|– abstracts/
|   |– _functions.scss    # Sass Funzioni
|   |– _mixins.scss       # Sass Mixins
|   |– _variables.scss    # Sass Variabili
|   …                     # Etc.
|
|– base/
|   |– _base.scss         # Regole di base
|   |– _reset.scss        # Reset/normalize
|   |– _typography.scss   # Regole di tipografia
|   …                     # Etc.
|
|– components/
|   |– _accordion.scss    # Accordion
|   |– _buttons.scss      # Bottoni
|   |– _dropdown.scss     # Dropdown
|   …                     # Etc.
|
|– layout/
|   |– _header.scss       # Header
|   |– _footer.scss       # Footer
|   |– _sidebar.scss      # Sidebar
|   |– _forms.scss        # Forms
|   …                     # Etc.
|
|– pages/
|   |– _home.scss         # Stili specifici per la Home
|   |– _settings.scss     # Stili specifici per la pagina Settings
|   …                     # Etc.
|
|– themes/
|   |– _default.scss      # Tema di default
|   |– _dark.scss         # Tema dark
|   …                     # Etc.
|
|– vendors/
|   |– _bootstrap.css     # Bootstrap
|   …                     # Etc.
|
`– main.scss              # File principale
```

**Abstracts**: contiene tutti quei file che non restituiscono in output alcun CSS quando compilati.

**Base**: contiene regole di tipografia e stili di base per gli elementi HTML comunementi usati.

**Components**: contiene gli stili per i widget utilizzati dall'applicazione. E' tipicamente la cartella più corposa.

**Layout**: contiene tutto ciò che si occupa di creare il layout dell'applicazione.

**Pages**: contiene gli stili specifici alle diverse pagine dell'applicazione.

**Themes**: contiene gli stili per la creazione di temi. Non è sempre presente.

**Vendors**: contiene tutti i file che provengono da librerie e framework di terze parti.

**Main.scss**: contiene nient'altro che @import e commenti.


?> :warning: &nbsp; La cartella **Pages** è resa ridondante da Angular, poiché il framework genera dei fogli di stile per ognuno dei suoi @Component.
Anche la cartella **Vendors** è ridondante, infatti stylesheets e script esterni vanno in genere inclusi nell'angular.json.