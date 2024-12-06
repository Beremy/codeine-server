-- MariaDB dump 10.19  Distrib 10.11.7-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: hostomytho_bdd
-- ------------------------------------------------------
-- Server version	10.11.7-MariaDB-3+b1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `picto` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `lib` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievements`
--

LOCK TABLES `achievements` WRITE;
/*!40000 ALTER TABLE `achievements` DISABLE KEYS */;
INSERT INTO `achievements` VALUES (2,'Apprenti','Atteindre 100 points de réputation.','badge','','SimpleLineIcons'),(3,'Confirmé','Atteindre 500 points de réputation.','badge','gold','SimpleLineIcons'),(4,'Expert','Atteindre 1000 points de réputation.','bronze_medal','','image'),(5,'Maître','Atteindre 5000 points de réputation.','silver_medal','','image'),(6,'Légende','Atteindre 10000 points de réputation.','gold_medal','','image'),(7,'De mauvais à bon chasseur','Capturer son premier criminel.','police-badge','','MaterialCommunityIcons'),(8,'Chasseur de vilains','Capturer 3 criminels.','police-badge','darkgrey','MaterialCommunityIcons'),(9,'Super chasseur','Capturer 6 criminels.','police-badge','gold','MaterialCommunityIcons'),(10,'La terreur des gros méchants','Capturer 9 criminels.','pokeball','#FF0000','MaterialCommunityIcons'),(15,'Fidèle au poste','Jouer à l\'application pendant 7 jours consécutifs.','controller-record','mediumseagreen','Entypo'),(16,'Joueur en perle','Jouer à l\'application pendant 30 jours consécutifs.','controller-record','#71BEF7','Entypo'),(17,'Joueur de diamant','Jouer à l\'application pendant 60 jours consécutifs.','diamond','#71BEF7','FontAwesome'),(18,'Fondateur','Avoir participé à la Beta de l\'application.','construct','slategray','Ionicons'),(19,'Hackeur','Avoir trouvé et signalé un bug dans l\'application.','bug','#FF0000',NULL),(22,'Employé modèle','Figurer parmi les 3 meilleurs enquêteurs du mois.','trophy-award','gold','MaterialCommunityIcons'),(23,'Star du moment','Finir 1er à un classement mensuel.','ios-trophy-sharp','gold','Ionicons'),(24,'Oiseau de nuit','Jouer à l\'application entre minuit et 4 heures du matin.','weather-night','slategray','MaterialCommunityIcons'),(28,'On l\'appelle l\'inspecteur Cordula','Débloquer tous les éléments d\'apparence.','tshirt','slateblue','FontAwesome5'),(29,'Chercheur','Trouver un élément caché.','magnifying-glass','slategray','Entypo');
/*!40000 ALTER TABLE `achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `criminals`
--

DROP TABLE IF EXISTS `criminals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `criminals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `imageId` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  `descriptionArrest` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `criminals`
--

LOCK TABLES `criminals` WRITE;
/*!40000 ALTER TABLE `criminals` DISABLE KEYS */;
INSERT INTO `criminals` VALUES (1,'Igor Nyborg','1','Igor n\'est pas spécialement connu pour sa vivacité d\'esprit. Cleptomane depuis sa tendre enfance, il sévit depuis des années, volant dans des magasins, cambriolant les habitants de son village, et dérobant même dans l’hôpital qui est proche de chez lui. Malgré sa maladresse, il n\'y a jamais de preuves concrètes ni d\'évidences suffisantes pour l\'arrêter.\n\nUn jour, incapable de résister à ses pulsions, il enfile une cagoule et cambriole sa propre maison, emportant tous ses biens de valeur et son argent. Puis, il rentre chez lui comme si de rien n\'était. Le lendemain, à son réveil et découvrant la disparition de ses affaires, il est pris de panique et appelle la police pour signaler le cambriolage.\n\nLorsque les enquêteurs commencent à le suspecter, Igor, pris de peur, s\'enfuit et trouve refuge dans l\'endroit le plus proche : l\'hôpital.\n\nLes semaines passent sans que l\'on puisse retrouver sa trace.\n\nCependant, grâce à vos efforts, les indices recueillis mènent l\'enquête vers le service des urgences dentaires, où de nombreuses anomalies sont notées. Un individu, dont les poches débordent de purée, laissant des traînées dans les couloirs, attire l\'attention. Igor, qui n\'a pas pu s\'empêcher de dérober toute la purée prévue pour le déjeuner, l\'a dissimulée dans ses vêtements. Alourdi par son butin, il ne peut fuir et est arrêté sans difficulté.','Votre première prise ! Bravo ! Il s\'agit d\'Igor Nybord, pas le plus grand criminel du pays, mais c\'est un très bon début ! Il est désormais derrière les barreaux, et nous en avons plus appris sur lui.'),(2,'Priscille Groné','2','Priscille Groné, dotée d\'un odorat incroyable, a développé des goûts pour le moins... originaux. Son obsession ? Les chaussures et leur potentiel olfactif inexploité. Priscille est convaincue que chaque paire de chaussures porte en elle l\'essence de son propriétaire, et elle se donne pour mission de capturer cette essence pour la transformer en parfum.\n\nLe hic, c\'est que les habitants de son village tiennent à leurs chaussures et ne sont pas prêts à sacrifier leur confort pour les expérimentations olfactives de Priscille. De plus, les parfums qu\'elle crée, loin des effluves de roses ou de jasmin, propagent des odeurs si piquantes qu\'elles font fuir les touristes.\n\nLa patience des citadins atteint ses limites lorsque Priscille dérobe la paire de bottes fétiche du maire, ce qui donne lieu à un parfum si puissant qu\'il forme un nuage au-dessus de la ville, bloquant le soleil pendant trois jours.\n\nEffrayée par la colère grandissante de ses voisins, Priscille s\'enfuit et se réfugie dans l\'endroit le plus improbable pour une parfumeuse : l\'hôpital local, où les désinfectants et les antiseptiques masquent toutes les autres odeurs. Malgré cela, elle s\'installe pour continuer ses expérimentations.\n\nVos recherches vous permettent de cibler le bâtiment de la maintenance. Il vous suffit ensuite de suivre les odeurs pour la retrouver, et vous n\'avez plus le moindre doute.','Votre intuition a porté ses fruits ; Priscille Groné était bien à l\'endroit que vous pensiez, et vous avez trouvé sa cachette.'),(3,'Mourad Shamarwa','3','Mourad Shamarwa, avec ses Lunettes rondes et son air bonhomme, n\'est pas le genre de personnage que l\'on imagine au cœur d\'un scandale. Originaire d\'un petit village, Mourad a toujours rêvé de partager les saveurs de son enfance avec le monde. C\'est ainsi qu\'il ouvre \"Cébon Chémoi\", un restaurant qui promet des shawarmas si délicieux qu\'ils feraient fondre les cœurs les plus endurcis.\n\nMais Mourad n\'est pas seulement un fin cuisinier, il est aussi un malin commerçant, à la limite de la légalité. Pour attirer les foules et se démarquer de la concurrence, il a recours à une tactique audacieuse : des épices rares et illégales, censées décupler les saveurs de ses plats. Ces épices, pourtant interdites, provoquent un effet secondaire inattendu : elles rendent ses clients presque instantanément dépendants.\n\nTrès vite, \"Cébon Chémoi\" devient le restaurant le plus prisé de la région. Les habitants y affluent, et même des touristes viennent de loin pour goûter à ses fameux shawarmas. Mais cette popularité soudaine attire aussi l\'attention des autorités sanitaires, intriguées par le phénomène.\n\nUn jour, une descente surprise des inspecteurs découvre la cache secrète d\'épices de Mourad. Pris de panique, il s\'enfuit avant d\'être arrêté, laissant derrière lui un restaurant en ébullition et des clients en manque de leur dose quotidienne de shawarma.\nMourad trouve refuge dans l\'endroit le moins attendu pour un restaurateur en cavale : l\'hôpital local. Avec son talent pour se fondre dans la masse, il se fait passer pour un infirmier, cachant ses épices dans des fioles de médicaments.\n\nLes semaines passent sans que Mourad ne soit retrouvé. Cependant, grâce à votre persévérance, des indices commencent à émerger. Des patients de certaines ailes de l\'hôpital se plaignent de vertiges et d\'envies de plats inhabituels. En suivant cette piste, vous parvenez à cibler vos recherches vers le service de réapprovisionnement des stocks. Là, entre des cartons de fournitures médicales, vous trouvez Mourad, en train de préparer une petite sauce au curry.\n\nVotre flair et votre détermination payent : Mourad Shawarma, le restaurateur fugitif, est arrêté sur place. Il se rend sans résistance, emportant avec lui les secrets de ses épices illicites.','Attrappé ! Mourad Shamarwa se cachait dans le service réapprovisionnement, déguisé en infirmier. Il n\'a opposé aucune resistance pendant son arrestation.'),(4,'René Duplantin','4','René Duplantin est célèbre pour transformer n\'importe quelle situation en bagarre. C\'est sa grande passion. Un regard de travers ? La bagarre. Quelqu\'un qui chante faux ? La bagarre. Quelqu\'un qui respire trop fort ? La bagarre. Un mur mal crépi ? Il se met à taper très fort contre ce mur. Le gros problème, c\'est qu\'il n\'hésite pas à s\'attaquer aux plus faibles ; un jour, un car rempli de personnes âgées, ayant un pot d\'échappement qui faisait un peu trop de bruit, est attaqué par René, qui agresse chaque passager, faisant plusieurs malheureuses victimes.\n\nComprenant que cette fois, il a peut-être un peu dépassé les limites de l\'acceptable, René s\'enfuit. Connaissant l\'hôpital comme sa poche, grâce aux nombreuses visites précédentes résultant de ses altercations, il décide que c\'est l\'endroit idéal pour se cacher. Là, il sait naviguer parmi les couloirs, se fondre parmi les patients, et surtout, il connaît chaque recoin où se dissimuler.\n\nEn analysant les textes des patients, vous finissez par repérer une forte récurrence de récits de bagarres. En remontant les pistes, vous tombez face à face avec ce grand costaud, aux poings gonflés.\n\nSans l\'ombre d\'un doute sur son identité, vous l\'interpellez, et René, réalisant qu\'il est repéré, s\'élance sur vous. Un échange de violents coups s\'ensuit, mais, maîtrisant parfaitement les coups de boule, vous prenez l\'ascendant. Selon votre récit, l\'altercation se passe ainsi :\n\n\"Paaf ! Paf ! Coup de boule. Il me dit : \'Qu\'est-ce qu\'il y a ?\' Je lui dis : \'Comment ça, qu\'est-ce qu\'il y a ?\' Paaf ! Coup de boule ! Coup de boule de nouveau ! Je lui dis : \'Quoi ?\' Il me regarde, coup de boule, et paf coup de boule.\"\n\nKO après tous ces coups, vous lui passez les menottes et le mettez hors d\'état de nuire derrière les barreaux.','Arrestation musclée. Ce criminel est un violent et ne s\'est pas laissé faire, mais c\'est bon, il est sous les barreaux.'),(5,'Gervais Visqueux','5','Gervais Visqueux est un cybercriminel notoire, un véritable geek qui passe le plus clair de son temps devant ses ordinateurs. Maître de la dissimulation numérique, il pirate des photos compromettantes, comme celles de gens nus, qu\'il conserve pour son plaisir malsain mais aussi pour pratiquer le rançonnage. Membre actif de groupes sordides qui s\'échangent de sombres clichés, il sévit depuis des années grâce à son extrême discrétion et ses compétences en sécurité informatique. Utilisant des VPN et d\'autres outils, il reste insaisissable.\n\nToutefois, un pseudo commence à se faire connaître dans les cercles de la cybercriminalité : \"XXjaimelacreme26XX\". La police anti-cybercriminalité, après des mois d\'enquête, commence à faire le lien entre ce pseudonyme et les activités de Gervais. Se sentant de plus en plus ciblé et localisé par les forces de l\'ordre, il doit abandonner son appartement en catastrophe.\n\nÀ la recherche d\'un réseau internet puissant, de données sensibles à exploiter, et ayant une attirance particulière et malsaine pour les gens en blouse d\'hôpital, Gervais trouve refuge ici. Il se dissimule dans une cave sombre où il installe son matériel pour exploiter le réseau de l\'hôpital à des fins malveillantes, et continuer ses trafics d\'images.\n\nPour se nourrir et manger autre chose que des rats, Gervais sort de sa cachette de temps en temps, se faisant passer pour un patient afin d\'obtenir un repas. Changeant d\'identité à chaque fois qu\'il est consulté par un médecin, vous avez du mal à le localiser. Mais en trouvant un compte rendu parlant d\'un \"Geaime Lacraime\", vous faites le lien et courez dans la chambre d\'où vient le compte rendu.\n\nNe s\'y attendant pas et surpris, il reste figé, et vous pouvez l\'embarquer facilement.','Bien joué ! Il s\'agit cette fois d\'un cyber-criminel qui était en cavale depuis plusieurs années.'),(6,'Ryme Tranber','9','Ryme, un citoyen autrefois modèle, avait l\'habitude de se balader dans les parcs de sa ville. Un jour, alors que le soleil brillait, il s\'habille, et bien que montrer ses petits mollets à tout le monde le gêne un peu, il enfile son short et part faire le tour de son parc favori. Une petite fille, en le croisant, le montre du doigt et dit : \"Oh regardez, il a des toutes petites jambes.\" Ryme, bouche bée, rentre chez lui, ruminant et ressassant la scène. \n\nPendant plusieurs jours, il reste enfermé chez lui, laissant la colère monter en lui. Finalement, après 35 jours, il sort et décide d\'empêcher l\'humanité de porter des shorts. Si lui ne peut pas montrer ses mollets tranquillement, personne ne le pourra. \n\nIl commence par aller dans tous les magasins de vêtements de sa ville, où il coud des rallonges sur tous les shorts. Il va ensuite dans la rue et tague les jambes des passants portant des shorts. Voyant que les rallonges sont arrachées et la peinture retirée, il passe à l\'étape supérieure et cible le problème à la source : les usines de shorts. \n\nAprès avoir préparé des litres d\'explosifs artisanaux, il s\'infiltre et les place dans différentes infrastructures clés dans la fabrication de vêtements. Près de 14 usines sont complètement détruites, causant des millions de dégâts et mettant des milliers de personnes sans emploi. \n\nAyant besoin de graisse humaine pour concevoir son explosif, Ryme traîne régulièrement dans les hôpitaux pour en récupérer, en drainant directement des patients. \nDe nombreux compte-rendus médicaux de patients, perdant énormément de poids, vous ont mis la puce à l\'oreille. Vous parvenez à localiser un secteur particulièrement pris pour cible et, un soir, vous le surprenez en train de prélever de la graisse à l\'aide d\'une seringue, dans la cuisse d\'un patient endormi. \n\nRyme, après avoir tenté de vous faire glisser en lançant de la graisse à vos pieds, mais sans succès, finit par accepter la sentence et vous suit en prison. ','Une nouvelle prise ! Vous avez repéré Ryme en train de prélever de la grasse humaine sur des patients. Lisez son histoire pour comprendre pourquoi.'),(7,'La Bouchère de Bah Horbair','6','Bravo enquêteur, vous avez attrapé Monique, la Bouchère de Bah Horbair. Si son regard livide et ses mains toujours ensanglantées ont toujours suscité l’inquiétude de la population, ses crimes ont mis du temps avant d’être élucidés. \n\nMonique n’est pas qu’une simple bouchère. Derrière son comptoir, elle dissimule un commerce des plus macabres. Sous couvert de son métier, Monique fait partie d\'un énorme réseau de trafic d\'organes et de disparitions mystérieuses. Elle propose régulièrement à des clients de venir visiter son arrière-boutique, et, une fois le dos tourné, leur assène un violent coup de hachoir sur le cou. Utilisant ses compétences de bouchère, elle découpe ensuite ses victimes, et transfère la viande humaine en la dissimulant parmi les carcasses d\'animaux dans son établissement. Les parties les plus rares, comme les cœurs ou les reins, sont vendues au marché noir à des groupes proches de la mafia, tandis que la chair est vendue, soit dans sa boutique, soit aux restaurants de sa région.\n\nPour alimenter ses trafics criminels, Monique s\'introduit régulièrement dans les hôpitaux. Elle vole des organes et des membres sur les cadavres, utilisant ses connaissances anatomiques pour prélever avec précision tout ce dont elle a besoin. Elle parvient à se fondre dans le personnel hospitalier, se faisant passer pour une aide-soignante. Ses crimes sont si bien orchestrés que les disparitions et vols d\'organes passent souvent inaperçus, classés comme erreurs médicales ou simples accidents.\n\nVous remarquez une récurrence de patients, dans le secteur de la chirurgie, qui se réveillent avec des entailles et des cicatrices inexpliquées sur le ventre. En fouillant dans les affaires des employés de ce secteur, vous tombez sur un sac contenant un livre d’étranges recettes, incluant des plats sinistres comme le \"Pâté aux Lorrains\" et la \"Quiche humaine\". Sur la première page du livre, on peut lire : \"À BBH, Mon étoile, mon silence parfait.\" Le livre appartient bien à Monique, la Bouchère de Bah Horbair.\n\nVous vous cachez dans une armoire et surveillez le sac. Puis, au bout de plusieurs heures, vous apercevez Monique arriver et fouiller dans le sac. Vous sortez de votre cachette et l\'interpellez. Avec ses mains ensanglantées et un cœur encore chaud dans une poche, elle n’a pas d’autre choix que de se rendre et de subir son juste sort.','Les apparitions inexpliquées de cicatrices sur des patients vous ont mis sur la bonne piste. La Bouchère de Bah Horbair est désormais derrière les barreaux.'),(8,'Pablo Corleone','7','Pablo Corleone est le descendant direct de Pablo Escobar et de la famille Corleone, un croisement explosif entre ces deux dynasties criminelles. Chef d’un cartel de drogue tentaculaire, il règne sur un empire qui s\'étend de l\'Amérique latine jusqu\'aux ruelles sombres des grandes capitales européennes. S\'inspirant des tactiques de ses ancêtres, Pablo a su allier cruauté et stratégie pour bâtir son empire.\n\nSon cartel inonde les rues de cocaïne et d’autres drogues puissantes, tout en maintenant une apparence respectable. Dans les coulisses, il emploie la terreur et la corruption pour garder son emprise : juges soudoyés, politiciens à sa solde, et un réseau de violence qui touche chaque recoin du pays. Contrairement à Escobar, il a appris des erreurs de ses modèles et sait qu’il vaut mieux se fondre dans l’ombre, plutôt que d\'exhiber ses richesses et son pouvoir.\n\nCependant, comme tout empire criminel, le sien finit par montrer des failles. Une série d’arrestations parmi ses lieutenants met à jour des pans entiers de son réseau. La police commence à resserrer l’étau autour de Pablo. Ses entrepôts sont saisis, et plusieurs de ses comptes bancaires secrets gelés. Sentant que le piège se referme sur lui, Pablo doit faire un choix : rester et se battre jusqu’à la fin, ou disparaître temporairement, le temps de préparer un retour triomphal.\n\nDans un ultime acte de survie, il décide de se cacher là où personne ne penserait à le chercher : un hôpital d\'une ville moyenne. Utilisant une blessure par balle, qu\'il a lui-même orchestrée lors d\'une fusillade simulée avec ses propres hommes, il se fait admettre en urgence. Une fois à l\'intérieur, il compte se faire passer pour un patient ordinaire, sous une fausse identité, en attendant que les choses se calment. Son plan est simple : profiter de l’anonymat des couloirs blancs, tout en utilisant les connexions du cartel pour reprendre le contrôle depuis l’ombre.\n\nCependant, ses habitudes criminelles ne tardent pas à le trahir. Des messages interceptés par la police montrent que des ordres sont donnés depuis l\'intérieur même de l’hôpital, avec des instructions précises pour réorganiser son réseau. De plus, des gardes du corps, de gros costauds tatoués, déguisés en personnel hospitalier, commencent à éveiller les soupçons du personnel médical.\n\nVos enquêtes minutieuses et l\'analyse des documents hospitaliers révèlent des incohérences dans les dossiers de certains patients. Il s\'agit de membres du cartel que Pablo fait entrer à l\'hôpital avec de faux symptômes et de fausses identités. En remontant ces indices, vous découvrez à quel point l\'hôpital est infiltré par ses complices et des personnes corrompues.\n\nGrâce à vos qualités et votre persévérance, vous parvenez à localiser la chambre où il se cache.\n\nEtant toujours entouré de ses associés, vous attendez le bon moment. Un soir, alors qu\'il sort de sa chambre pour aller aux toilettes, vous lui sautez dessus et l\'immobilisez grâce à une prise de jujitsu. Coincé, Pablo tente de négocier sa sortie, fidèle à sa réputation de manipulateur. Mais cette fois, face à quelqu\'un d\'inébranlable, ses mots ne suffisent pas à le sauver. Vous l\'emmenez derrière les barreaux, brisant toute la structure du cartel. Ses autres associés sont arrêtés dans la foulée.','Très grosse prise : vous arrêtez le chef d\'un cartel mondial de la drogue ! Vous devenez vraiment balèze comme enquêteur !'),(9,'Friedrich Schnozzlestein','8','Friedrich Schnozzlestein, un être aussi brillant que dangereux, est devenu une véritable menace pour le monde. Misanthrope psychopathe, il nourrit une haine profonde envers l’humanité, particulièrement envers ceux qui ne viennent pas de son village natal et qui mesurent moins d\'1m80. Friedrich ne voit qu\'une solution pour \"purifier\" le monde de ces \"indésirables\" : les éliminer.\n\nDans sa maison de campagne, Friedrich crée un petit laboratoire et met au point un robot d\'une grande sophistication. Non content de créer une simple machine, il intègre une intelligence artificielle qu\'il programme pour penser exactement comme lui : haineuse, impitoyable, et déterminée à accomplir sa mission d\'extermination. Ce robot apprend à concevoir d\'autres robots à son image, augmentant leur nombre de manière exponentielle, créant ainsi une armée entière. Ces machines, entièrement autonomes, ont pour but d’envahir des villes et même des petits pays, détruisant tous ceux qui ne correspondent pas aux critères de Friedrich.\n\nMais la haine de Friedrich ne s\'arrête pas là. En plus de vouloir exterminer les \"moins d\'1m80\", il voue une obsession étrange aux Cheveux roux. Les robots ont pour mission de capturer chaque personne rousse qu\'ils trouvent et de la ramener à leur maître, pour des expériences dont le monde n’ose même pas imaginer la nature.\n\nL\'armée de Friedrich est divisée en deux branches : une première composée de robots soldats, chargés d\'envahir et de capturer les roux, et une seconde dédiée uniquement à la production d\'autres robots, ainsi qu\'à la collecte de matériaux et de données. Ces derniers infiltrent des établissements publics et des entreprises, se fondant parmi les humains pour récupérer des informations sensibles et du matériel nécessaire à la construction de nouvelles unités. Pour la collecte de données, les robots interceptent des informations réelles et en génèrent de nouvelles pour remplacer les vraies. Cela permet de manipuler les systèmes et créer une sorte de chaos contrôlable.\n\nMalgré leur redoutable efficacité à générer de fausses données et des rapports médicaux falsifiés, les robots de Friedrich rencontrent quelques lacunes dans la rédaction de textes médicaux, en raison d’un manque de corpus adapté. Certaines incohérences, extrêmement subtiles, commencent à apparaître. Grâce à vos analyses et compétences hors du commun, vous parvenez à en identifier plusieurs et à remonter jusqu’à une source inconnue dans l’hôpital. En suivant les adresses IP d’où proviennent ces rapports, vous découvrez que ce \"médecin\" est en réalité un robot espion, caché dans la salle serveur de l’hôpital, chargé de fausser les diagnostics afin de maltraiter les individus ciblés par Friedrich.\n\nAprès l’avoir localisé et grâce à vos compétences exceptionnelles en hacking, vous réussissez à pirater le robot espion et insérez des données vous faisant passer pour une personne rousse, sachant que cela vous mènera directement à la cachette de Schnozzlestein.\n\nLe plan fonctionne à la perfection. Le robot vous capture et vous traversez plusieurs pays, embarqué dans un convoi de machines, en route vers le repaire de Friedrich. Vous voyagez en silence, vous infiltrant de plus en plus profondément dans l\'empire de robots qu\'il a construit. À chaque étape, vous collectez des informations et observez leur organisation jusqu\'à atteindre enfin la base souterraine de Friedrich.\n\nFace à lui, dans son laboratoire, Friedrich vous déVisages avec mépris, pensant avoir capturé une autre victime rousse. C’est alors que vous déclenchez le second virus que vous avez intégré dans le système du robot espion, lui faisant croire que Friedrich lui-même est un roux. Le robot se précipite alors vers lui et l’immobilise.\n\nVous en profitez pour utiliser votre prise préférée de jujitsu, consistant à mettre un doigt dans le nez de la victime, ce qui le soumet efficacement et le force à désactiver ses robots.\n\nL’armée de robots désormais hors d’état de nuire, Friedrich n\'a plus aucun pouvoir. Il est capturé et livré à la justice internationale, sauvant ainsi des millions de vies.','Votre infiltration réussie vous permet d’arrêter Friedrich Schnozzlestein, l\'homme derrière une armée de robots. Grâce à votre expertise, vous avez non seulement mis fin à ses plans de domination, mais sauvé d\'innombrables vies à travers le monde.');
/*!40000 ALTER TABLE `criminals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `error_types`
--

DROP TABLE IF EXISTS `error_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `error_types` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `error_types`
--

LOCK TABLES `error_types` WRITE;
/*!40000 ALTER TABLE `error_types` DISABLE KEYS */;
INSERT INTO `error_types` VALUES (1,'Français',NULL),(2,'Médicale',NULL),(3,'Répétition',NULL),(4,'Autre',NULL),(10,'Pas d\'erreur',NULL);
/*!40000 ALTER TABLE `error_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friends` (
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`friend_id`),
  KEY `friends_ibfk_2` (`friend_id`),
  CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'MythoNo'),(2,'MythoOuPas'),(3,'MythoTypo');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_text_rating`
--

DROP TABLE IF EXISTS `group_text_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_text_rating` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text_id` int(11) NOT NULL,
  `sentence_positions` varchar(255) NOT NULL,
  `average_plausibility` int(11) DEFAULT NULL,
  `votes_count` int(11) DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `text_id` (`text_id`),
  CONSTRAINT `group_text_rating_ibfk_1` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=546 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message_contact`
--

DROP TABLE IF EXISTS `message_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message_contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `message_contact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message_menu`
--

DROP TABLE IF EXISTS `message_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_menu` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `message_type` enum('home_not_connected','home_connected') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_menu`
--

LOCK TABLES `message_menu` WRITE;
/*!40000 ALTER TABLE `message_menu` DISABLE KEYS */;
INSERT INTO `message_menu` VALUES (1,'','Bienvenue, enquêteur. Vous avez été mandaté pour démasquer des criminels cachés dans notre hôpital. Pour ce faire, plusieurs mini-jeux vous sont proposés dans lesquels vous devrez déceler des anomalies et effectuer diverses annotations.\n\nHostoMytho est un \"jeu ayant un but\", développé dans le cadre d\'un projet de recherche. Les données produites par ces mini-jeux seront récupérées et serviront à la science. Plus d\'infos sur la page À Propos.\n\nCréez un compte si vous souhaitez vous lancer à l\'aventure, ça ne prend que quelques secondes !',1,'home_not_connected'),(2,'Les règles de MythoNo ont été un peu modifiées. Refaites le tutoriel pour les découvrir.','Examinez des dossiers patients, décelez des anomalies ou des incohérences et annotez-les afin de démasquer les criminels déguisés en médecins qui les ont rédigés, ou en patients qui s\'inventent des symptômes. Vous pourrez ainsi augmenter vos chances de les capturer.  \n \nDans les différents mini-jeux, la plupart du temps, vous ne recevrez pas d\'indication sur l\'exactitude de vos réponses. Parfois, nous insérerons des textes pièges pour tester vos compétences et vérifier votre fiabilité. L\'hôpital regorge de menteurs, et il est difficile de savoir à qui se fier ! ',1,'home_connected');
/*!40000 ALTER TABLE `message_menu` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `monthly_winners`
--

DROP TABLE IF EXISTS `monthly_winners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `monthly_winners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `ranking` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_monthly_winners_1_idx` (`user_id`),
  CONSTRAINT `fk_monthly_winners_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `referral`
--

DROP TABLE IF EXISTS `referral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `referral` (
  `referrer_id` int(11) NOT NULL,
  `referred_id` int(11) NOT NULL,
  PRIMARY KEY (`referrer_id`,`referred_id`),
  KEY `referral_ibfk_2` (`referred_id`),
  CONSTRAINT `referral_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `referral_ibfk_2` FOREIGN KEY (`referred_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_refresh_tokens_1_idx` (`user_id`),
  CONSTRAINT `fk_refresh_tokens_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sentences`
--

DROP TABLE IF EXISTS `sentences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sentences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `text_id` (`text_id`),
  CONSTRAINT `sentences_ibfk_1` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6620 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `skins`
--

DROP TABLE IF EXISTS `skins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` enum('veste','Chapeaux','Lunettes','Cheveux','Visages','Accessoires') NOT NULL,
  `gender` enum('homme','femme','unisexe') NOT NULL,
  `rarity` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=236 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skins`
--

LOCK TABLES `skins` WRITE;
/*!40000 ALTER TABLE `skins` DISABLE KEYS */;
INSERT INTO `skins` VALUES (157,'Chapeau','Chapeaux','unisexe',1,'hat_1'),(158,'Chapeau','Chapeaux','unisexe',1,'hat_2'),(159,'Chapeau','Chapeaux','unisexe',1,'hat_3'),(160,'Chapeau','Chapeaux','unisexe',1,'hat_4'),(161,'Chapeau','Chapeaux','unisexe',1,'hat_5'),(162,'Chapeau','Chapeaux','unisexe',1,'hat_6'),(163,'Chapeau','Chapeaux','unisexe',1,'hat_7'),(164,'Chapeau','Chapeaux','unisexe',3,'hat_8'),(165,'Chapeau','Chapeaux','homme',1,'hat_man_1'),(166,'Chapeau','Chapeaux','femme',1,'hat_woman_1'),(167,'Visage','Visages','unisexe',1,'face_1'),(168,'Visage','Visages','unisexe',1,'face_2'),(169,'Visage','Visages','unisexe',1,'face_3'),(170,'Visage','Visages','homme',3,'face_man_1'),(171,'Visage','Visages','homme',3,'face_man_2'),(172,'Visage','Visages','homme',3,'face_man_3'),(173,'Visage','Visages','homme',1,'face_man_4'),(174,'Visage','Visages','homme',1,'face_man_5'),(175,'Visage','Visages','homme',1,'face_man_6'),(176,'Visage','Visages','homme',1,'face_man_7'),(177,'Visage','Visages','homme',1,'face_man_8'),(178,'Visage','Visages','homme',1,'face_man_9'),(179,'Visage','Visages','homme',1,'face_man_10'),(180,'Visage','Visages','homme',1,'face_man_11'),(181,'Visage','Visages','homme',1,'face_man_12'),(182,'Visage','Visages','homme',1,'face_man_13'),(183,'Visage','Visages','homme',1,'face_man_14'),(184,'Visage','Visages','homme',5,'face_man_15'),(185,'Visage','Visages','homme',5,'face_man_16'),(186,'Visage','Visages','homme',1,'face_man_17'),(187,'Visage','Visages','femme',3,'face_woman_1'),(188,'Visage','Visages','femme',3,'face_woman_2'),(189,'Visage','Visages','femme',3,'face_woman_3'),(190,'Visage','Visages','femme',1,'face_woman_4'),(191,'Visage','Visages','femme',1,'face_woman_5'),(192,'Visage','Visages','femme',1,'face_woman_6'),(193,'Visage','Visages','femme',1,'face_woman_7'),(194,'Visage','Visages','femme',1,'face_woman_8'),(195,'Visage','Visages','femme',1,'face_woman_9'),(196,'Visage','Visages','femme',1,'face_woman_10'),(197,'Visage','Visages','femme',1,'face_woman_11'),(198,'Visage','Visages','femme',1,'face_woman_12'),(199,'Visage','Visages','femme',1,'face_woman_13'),(200,'Visage','Visages','femme',5,'face_woman_14'),(201,'Chapeau','Chapeaux','femme',3,'hat_woman_2'),(202,'Veste','veste','homme',2,'jacket_man_1'),(203,'Veste','veste','homme',2,'jacket_man_2'),(204,'Veste','veste','homme',2,'jacket_man_3'),(205,'Veste','veste','homme',2,'jacket_man_4'),(206,'Veste','veste','homme',7,'jacket_man_5'),(207,'Veste','veste','homme',7,'jacket_man_6'),(208,'Veste','veste','femme',2,'jacket_woman_1'),(209,'Veste','veste','femme',2,'jacket_woman_2'),(210,'Veste','veste','femme',2,'jacket_woman_3'),(211,'Veste','veste','femme',2,'jacket_woman_4'),(212,'Veste','veste','femme',2,'jacket_woman_5'),(213,'Veste','veste','femme',7,'jacket_woman_6'),(214,'Veste','veste','femme',7,'jacket_woman_7'),(215,'Cheveux','Cheveux','homme',1,'hair_man_1'),(216,'Cheveux','Cheveux','homme',1,'hair_man_2'),(217,'Cheveux','Cheveux','homme',1,'hair_man_3'),(218,'Cheveux','Cheveux','homme',1,'hair_man_4'),(219,'Cheveux','Cheveux','homme',1,'hair_man_5'),(220,'Cheveux','Cheveux','homme',1,'hair_man_6'),(221,'Cheveux','Cheveux','femme',1,'hair_woman_1'),(222,'Cheveux','Cheveux','femme',1,'hair_woman_2'),(223,'Cheveux','Cheveux','femme',1,'hair_woman_3'),(224,'Cheveux','Cheveux','femme',1,'hair_woman_4'),(225,'Cheveux','Cheveux','femme',1,'hair_woman_5'),(226,'Cheveux','Cheveux','femme',1,'hair_woman_6'),(227,'Cheveux','Cheveux','femme',1,'hair_woman_7'),(228,'Cheveux','Cheveux','femme',1,'hair_woman_8'),(229,'Stéthoscope','Accessoires','homme',7,'Accessoires_man'),(230,'Stéthoscope','Accessoires','femme',7,'Accessoires_woman'),(231,'Lunettes','Lunettes','unisexe',1,'glasses_1'),(232,'Lunettes','Lunettes','unisexe',1,'glasses_2'),(233,'Lunettes','Lunettes','unisexe',1,'glasses_3'),(234,'Lunettes','Lunettes','unisexe',1,'glasses_4'),(235,'Lunettes','Lunettes','unisexe',1,'glasses_5');
/*!40000 ALTER TABLE `skins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_plausibility_errors`
--

DROP TABLE IF EXISTS `test_plausibility_errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test_plausibility_errors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text_id` int(11) NOT NULL,
  `word_positions` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `text_id` (`text_id`),
  CONSTRAINT `test_plausibility_errors_ibfk_1` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_specifications`
--

DROP TABLE IF EXISTS `test_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test_specifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text_id` int(11) NOT NULL,
  `type` enum('hypothesis','condition','negation') DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `word_positions` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_test_specifications_1_idx` (`text_id`),
  CONSTRAINT `fk_test_specifications_1` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `texts`
--

DROP TABLE IF EXISTS `texts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `texts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nb_of_treatments` int(11) DEFAULT 0,
  `num` varchar(45) NOT NULL,
  `content` text NOT NULL,
  `origin` enum('synthétique','réel - vrai','réel - faux') NOT NULL DEFAULT 'synthétique',
  `is_plausibility_test` tinyint(4) DEFAULT 0,
  `test_plausibility` decimal(5,2) DEFAULT NULL,
  `reason_for_rate` longtext DEFAULT NULL,
  `is_hypothesis_specification_test` tinyint(4) DEFAULT 0,
  `is_condition_specification_test` tinyint(4) DEFAULT 0,
  `is_negation_specification_test` tinyint(4) DEFAULT 0,
  `is_active` tinyint(4) DEFAULT 1,
  `length` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=441 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `themes`
--

DROP TABLE IF EXISTS `themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `themes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text_id` int(11) DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `is_punctuation` tinyint(4) DEFAULT 0,
  `sentence_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tokens_1_idx` (`text_id`),
  KEY `fk_tokens_2_idx` (`sentence_id`),
  CONSTRAINT `fk_tokens_1` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tokens_2` FOREIGN KEY (`sentence_id`) REFERENCES `sentences` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=172977 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `treatment_counts`
--

DROP TABLE IF EXISTS `treatment_counts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `treatment_counts` (
  `text_id` int(11) NOT NULL,
  `total_treatments` bigint(21) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_achievement`
--

DROP TABLE IF EXISTS `user_achievement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_achievement` (
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `notified` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`user_id`,`achievement_id`),
  KEY `user_achievement_ibfk_2` (`achievement_id`),
  CONSTRAINT `user_achievement_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_achievement_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_comment_votes`
--

DROP TABLE IF EXISTS `user_comment_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_comment_votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `comment_id` int(11) NOT NULL,
  `vote_type` tinyint(1) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `user_comment_votes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_comment_votes_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `user_comments_group_text_rating` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_comments_group_text_rating`
--

DROP TABLE IF EXISTS `user_comments_group_text_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_comments_group_text_rating` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `group_id` int(11) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `user_comments_group_text_rating_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_comments_group_text_rating_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group_text_rating` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_criminals`
--

DROP TABLE IF EXISTS `user_criminals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_criminals` (
  `user_id` int(11) NOT NULL,
  `criminal_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`criminal_id`),
  KEY `fk_user_criminals_1` (`criminal_id`),
  CONSTRAINT `fk_user_criminals_1` FOREIGN KEY (`criminal_id`) REFERENCES `criminals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_criminals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_error_details`
--

DROP TABLE IF EXISTS `user_error_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_error_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `text_id` int(11) DEFAULT NULL,
  `word_positions` longtext DEFAULT NULL,
  `vote_weight` int(11) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `is_test` tinyint(4) DEFAULT NULL,
  `test_error_type_id` int(11) DEFAULT NULL,
  `created_at` varchar(45) DEFAULT NULL,
  `reason_for_rate` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_error_details_2_idx` (`text_id`),
  KEY `fk_user_error_details_3_idx` (`test_error_type_id`),
  KEY `fk_user_error_details_1_idx` (`user_id`),
  CONSTRAINT `fk_user_error_details_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `fk_user_error_details_2` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_error_details_3` FOREIGN KEY (`test_error_type_id`) REFERENCES `error_types` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=524 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_game_texts`
--

DROP TABLE IF EXISTS `user_game_texts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_game_texts` (
  `user_id` int(11) NOT NULL,
  `text_id` int(11) NOT NULL,
  `game_type` enum('hypothesis','condition','negation','plausibility','link_entity') NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`text_id`),
  KEY `text_id` (`text_id`),
  CONSTRAINT `user_game_texts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_game_texts_ibfk_2` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_played_errors`
--

DROP TABLE IF EXISTS `user_played_errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_played_errors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_error_details_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_played_errors_1_idx` (`user_id`),
  KEY `fk_user_played_errors_2_idx` (`user_error_details_id`),
  CONSTRAINT `fk_user_played_errors_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `fk_user_played_errors_2` FOREIGN KEY (`user_error_details_id`) REFERENCES `user_error_details` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_sentence_specification`
--

DROP TABLE IF EXISTS `user_sentence_specification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_sentence_specification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `text_id` int(11) NOT NULL,
  `type` enum('hypothesis','condition','negation') NOT NULL,
  `content` longtext DEFAULT NULL,
  `word_positions` longtext NOT NULL,
  `specification_weight` int(11) DEFAULT 0,
  `created_at` varchar(45) DEFAULT 'CURRENT_TIMESTAMP',
  PRIMARY KEY (`id`),
  KEY `fk_user_sentence_type_1_idx` (`text_id`),
  KEY `fk_user_sentence_specification_1_idx` (`user_id`),
  CONSTRAINT `fk_user_sentence_specification_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `fk_user_sentence_specification_2` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1389 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_skin`
--

DROP TABLE IF EXISTS `user_skin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_skin` (
  `user_id` int(11) NOT NULL,
  `skin_id` int(11) NOT NULL,
  `equipped` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`user_id`,`skin_id`),
  KEY `user_skin_ibfk_2` (`skin_id`),
  CONSTRAINT `user_skin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_skin_ibfk_2` FOREIGN KEY (`skin_id`) REFERENCES `skins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_text_rating`
--

DROP TABLE IF EXISTS `user_text_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_text_rating` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `text_id` int(11) NOT NULL,
  `plausibility` decimal(5,2) NOT NULL,
  `vote_weight` int(11) DEFAULT NULL,
  `sentence_positions` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_text_rating_1_idx` (`user_id`),
  KEY `fk_user_text_rating_2` (`text_id`),
  KEY `fk_user_text_rating_3_idx` (`group_id`),
  CONSTRAINT `fk_user_text_rating_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `fk_user_text_rating_2` FOREIGN KEY (`text_id`) REFERENCES `texts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_text_rating_3` FOREIGN KEY (`group_id`) REFERENCES `group_text_rating` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2082 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_tutorials`
--

DROP TABLE IF EXISTS `user_tutorials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_tutorials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `completed` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_user_tutorials_1_idx` (`user_id`),
  KEY `fk_user_tutorials_2_idx` (`game_id`),
  CONSTRAINT `fk_user_tutorials_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_tutorials_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_typing_errors`
--

DROP TABLE IF EXISTS `user_typing_errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_typing_errors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_error_details_id` int(11) DEFAULT NULL,
  `error_type_id` int(11) DEFAULT NULL,
  `created_at` varchar(45) DEFAULT 'CURRENT_TIMESTAMP',
  PRIMARY KEY (`id`),
  KEY `fk_user_typing_responses_1_idx` (`user_id`),
  KEY `fk_user_typing_responses_3_idx` (`error_type_id`),
  KEY `fk_user_typing_errors_1_idx` (`user_error_details_id`),
  CONSTRAINT `fk_user_typing_errors_1` FOREIGN KEY (`user_error_details_id`) REFERENCES `user_error_details` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_typing_responses_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `fk_user_typing_responses_3` FOREIGN KEY (`error_type_id`) REFERENCES `error_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('inconnu','medecin','autre') NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `monthly_points` int(11) DEFAULT 0,
  `trust_index` tinyint(1) DEFAULT 50,
  `notifications_enabled` tinyint(1) DEFAULT 1,
  `gender` enum('homme','femme') NOT NULL DEFAULT 'homme',
  `created_at` varchar(45) DEFAULT current_timestamp(),
  `color_skin` enum('clear','medium','dark') DEFAULT 'medium',
  `tutorial_progress` tinyint(4) DEFAULT 0,
  `moderator` tinyint(4) NOT NULL DEFAULT 0,
  `catch_probability` int(11) DEFAULT 0,
  `consecutiveDaysPlayed` int(11) DEFAULT 0,
  `lastPlayedDate` varchar(45) DEFAULT NULL,
  `coeffMulti` decimal(2,1) DEFAULT 1.0,
  `nb_first_monthly` tinyint(4) DEFAULT 0,
  `message_read` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (27,'Azerty','$2a$10$Kqe6GBnkCwr6z/naurNieejfcc8M.0Fm5iDytyr/cvAnjw0he5bcu','autre','',0,0,90,1,'homme','2023-07-13 11:28:00','medium',11,1,50,3,'2024-11-20',1,1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variables`
--


DROP TABLE IF EXISTS `variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` int(11) NOT NULL,
  `default_value` int(11) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_UNIQUE` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variables`
--

LOCK TABLES `variables` WRITE;
/*!40000 ALTER TABLE `variables` DISABLE KEYS */;
INSERT INTO `variables` VALUES (1,'base_points_earned_mythooupas',14,14,'Base de points gagnés dans MythoOuPas. Avoir trouvé la bonne plausibilité et les bonnes erreurs font gagner 2 points en plus.'),(2,'base_points_earned_mythono',5,5,'Base de points gagnés dans MythoNo.'),(3,'base_points_earned_mythotypo',3,3,'Base de points gagnés dans MythoTypo.'),(7,'base_catchability_mythooupas',5,5,'Points de probabilité d\'arrestation gagnés dans MythoOuPas.'),(8,'base_catchability_mythono',3,3,'Points de probabilité d\'arrestation gagnés dans MythoNo.'),(9,'base_catchability_mythotypo',3,3,'Points de probabilité d\'arrestation gagnés dans MythoTypo.'),(10,'text_length_in_game',110,110,'Limitation en nombre de tokens de la longueur de textes affichés dans les jeux. ATTENTION : changer cette longueur fera qu\'on ne pourra plus comparer les réponses des joueurs avec celles déjà données avant la modification, car les ensembles de phrases composant les réponses n\'auront pour la plupart plus la même longueur.'),(14,'percentage_test_mythooupas',25,25,'Pourcentage de chance de tomber sur un texte de contrôle dans MythoOuPas.'),(15,'percentage_test_mythono',30,30,'Pourcentage de chance de tomber sur un texte de contrôle dans MythoNo.'),(16,'percentage_test_mythotypo',30,30,'Pourcentage de chance de tomber sur un texte de contrôle dans MythoTypo.'),(21,'text_already_treated_mythooupas',20,20,'Pourcentage de chance de tomber sur un texte déjà traité par au moins un autre joueur dans MythoOuPas.'),(22,'text_already_treated_mythono',20,20,'Pourcentage de chance de tomber sur un texte déjà traité par au moins un autre joueur dans MythoNo.'),(23,'text_already_treated_mythotypo',20,20,'Pourcentage de chance de tomber sur un texte déjà traité par au moins un autre joueur dans MythoTypo.');
/*!40000 ALTER TABLE `variables` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-28 15:23:21
