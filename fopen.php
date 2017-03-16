<?php

$fichier = fopen("/etc/passwd", 'r');

/* 
Anciennement avant le parametrage du serveur
Affiche le fichier passwd à l’ecran
*/
while (FALSE !== ($line = fgets($fichier)))
	echo fgets($fichier);

fclose($fichier);

/* 
Execute la fonction system et liste le repertoire home
*/
system('ls /home', $retval);

?>