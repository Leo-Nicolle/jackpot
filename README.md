# notes pour Rupy:

Il y a deux programmes à part entière: butcher qui lit l'osc, les points et les images de la kinect et cylinder qui affiche les trois cylindres, les fait tourner.

Cylinder n'est pas finit mais tu peux essayer  de le lancer quand meme, voir si on a pas de problèmes.

## Set-up
Tu vas avoir besoin de

- nodejs
- npm
- git bash

### installation

ouvres git bash et fais

```
cd Documents/
git clone https://github.com/LeoNicolle/jackpot.git
cd jackpot
git checkout -b rupy
```
Là tu as cloné le dossier et fait une branche git dans laquelle tu peux faire toutes les modifs que tu veux.

***Facultatif***

Il faudra surement que tu te fasses une clé RSA pour push tes modifs sur le server:
```
ssh-keygen
```
Ensuite, il faudra que tu m'envoies ta clé ssh:
```
cat ~/.ssh/id_rsa.pub
```
Pour que je te donne les droits de push.

***suite des opérations***

Maintenant que tu as ta branche et tout, il faut que tu installes les node_modules necessaires au lancement de l'appli:
```
cd butcher
npm install
```

npm va télécharger dans *node_modules/* tout ce dont a besoin l'appli pour tourner.
Comme on fait tourner tout ça sur un port http, il faut creer un serveur(c'est hyper simple)

```
python -m SimpleHTTPServer 3000
```

Si tout va bien, tu devrais pouvoir accéder à ton dossier *butcher/* depuis ton navigateur à l'adresse ***localhost:3000***

Maintenant on va demander à node d'executer le code:

```
node index
```

Et si tout se passe bien, node va te dire qu'il te manque les images (j'ai pas push les images sur le git, c'est un peu lourd. peut etre que je le ferai)



### Comment marche butcher:

Le butcher va lancer osc-communication, qui écoute sur le port 10000 pour les joints de la kinect et sur le port 10001 pour la commande "start".
Quand tu envoies n'importe quel message sur le port 10001, le butcher va lire dans le dossier

***INPUT_IMAGES_DIR*** du fichier *readFromStream*, donc il faut que tu ecrives les images dans ce dossier.

Attention, la derniere fois, tes images etaient nomées TDMovieOut.X.jpg, si ce n'est plus le cas, faut changer la valeur dans la fonction ***loadimage***


Voilà !!! 
