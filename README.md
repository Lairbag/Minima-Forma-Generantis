# Minima-Forma-Generantis

Simple générateur de miniature papier pour jeux de rôle (jdr).
*La description du projet sera en français et en anglais.*
L'objectif du projet est de simplifier la préparation d'une partie de jdr en automatisant la création de miniatures en papier.
Il y a encore pas mal de boulot et plusieurs bogues à corriger mais c'est déjà fonctionnel.
Je vous conseil d'aller voir [Printable Heroes](https://printableheroes.com/minis) pour des miniatures papier de qualité.

Simple paper mini generator for table top RPG (ttrpg).
*The project description will be in french and in english.*
The main purpose of the project is to simplify any ttrpg session preparation by automating the paper mini creation.
There is a lot of work to do and many bugs to correct but it already work.
You should look at [Printable Heroes](https://printableheroes.com/minis) for some paper mini of quality.

# Fonctionalités - Fonctionalities

L'outil prend en entrée un image pour appliquer différentes transformations pour en faire une miniature papier.

The tool take an image and transform it into a paper mini.

## Taille de l'image - Image size
Différentes tailles sont proposée :

|Nom             |Hauteur (cm)                |Largeur (cm)    |Hauteur base (cm)                     |
|----------------|-------------------------------|-----------------------------|-----------------------------|
|Minuscule|2,425            |1,3            |1|
|Standard|8,8            |4,146            |1|
|Grand|12,16            |6,5            |1|
|Colossale|16,16            |8,3            |1,5|
|Gigantesque|19,85            |10,5            |1,5|
La taille *standard* est la taille sélectionnée par défaut.
 Les dimensions actuel sont encore à éprouver.

Many sizes are available :

|Name             |Height (cm)                |Width (cm)    |Height support (cm)                     |
|----------------|-------------------------------|-----------------------------|-----------------------------|
|Minuscule|2,425            |1,3            |1|
|Standard|8,8            |4,146            |1|
|Large|12,16            |6,5            |1|
|Colossal|16,16            |8,3            |1,5|
|Gigantic|19,85            |10,5            |1,5|
The default size is *standard*.
The actual dimensions need some refinement.
## Options

 - Base : Permet de savoir si on génère une base papier ou pas. *Ne fonctionne pas pour le moment*. 
 - Jointure horizontale : Permet de déterminer si la jointure entre la face et le dos de la miniature est horizontale ou verticale. La valeur par défaut est la *jointure horizontale*.
 - Opacité du dos : Permet de faire varier l'opacité du dos. La valeur par défaut est *50%*.
 - Couleur bordure : Permet de choisir une couleur pour la bordure de la miniature. La valeur par défaut est *noire*.
 - Couleur base : Permet de choisir une couleur pour la base. La couleur par défaut est *blanc*.
 - Nom du fichier : Le nom du fichier, initialisé par celui du fichier importé. *Impossible de l'éditer pour le moment*



 - Support : let knows if we generate some paper support. *Doesn't work for the moment*. 
 - Horizontal join : determines whether the join between the face and back of the mini is horizontal or vertical. The default value is * horizontal join *.
 - Back opacity : this option changes the opacity of the back of the mini. The default value is *50%*.
 - Border color : Set the mini border color. The default value is *black*.
 - Support color : Set the support color. The default value is *white*.
 - File name : Finale file name, initiated with the name of the imported file. *Not editable for the moment*.

# Feuille de route - Roadmap

- corriger binding base
- corriger binding nom du fichier
- corriger binding sur l'affichage de l'opacité
- bonne taille pour les miniatures
- charger l'image depuis une url
- en faire une extension ?
- accessibilité
- design
- multi langue
- détourage automatique
- minifier js
- trouver mieux que des strings pour les tailles
- importer plusieurs fichiers ? https://jsfiddle.net/AlexZeitler/fPWFd/*


- debug support binding
- debug file name binding
- debug opacity label binding 
- improve mini sizes
- Load image from an URL
- browser extension ?
- accessibility
- design
- multi languages
- Automatic clipping
- minify js
- Refacto size array : don't use strings
- import many files ? https://jsfiddle.net/AlexZeitler/fPWFd/*

# Détails techniques - Technical details
Le projet est articulé autour des technologies HTML et Javascript.
On manipule un canvas pour transformer l'image source.
La communication entre les deux se fait via le design pattern MVVM grace à [Knockout.js](https://knockoutjs.com).

 - index.html : page centrale du projet important la feuille de style, les fichiers js et affiche le formulaire de génération
 - style.css: la feuille de style du projet. C'est également dans ce fichier que toutes les tailles des miniatures et des bases sont définies.
- script/mainViewModel.js : script principale sur lequel on se base pour tout afficher. La logique de lecture de l'image est dans ce fichier.
- script/optionsViewModel.js : script contenant toute la logique sur les options du formulaire
- script/engine.js : script contenant toute la logique de transformation de l'image


The project is powered by HTML and Javascript.
We work with a canvas to transform the image.
The communication between this two technologies is done by using the design pattern MVVM with [Knockout.js](https://knockoutjs.com).

 - index.html : main page that import syle, js files and display the main form
 - style.css: project style sheet. Every mini dimensions are set up here.
- script/mainViewModel.js : main script. The import file logic is in that file.
- script/optionsViewModel.js : script with all transformations options.
- script/engine.js : script with the image transformation logic
