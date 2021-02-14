<?php
/**
 * La configuration de base de votre installation WordPress.
 *
 * Ce fichier contient les réglages de configuration suivants : réglages MySQL,
 * préfixe de table, clés secrètes, langue utilisée, et ABSPATH.
 * Vous pouvez en savoir plus à leur sujet en allant sur
 * {@link http://codex.wordpress.org/fr:Modifier_wp-config.php Modifier
 * wp-config.php}. C’est votre hébergeur qui doit vous donner vos
 * codes MySQL.
 *
 * Ce fichier est utilisé par le script de création de wp-config.php pendant
 * le processus d’installation. Vous n’avez pas à utiliser le site web, vous
 * pouvez simplement renommer ce fichier en "wp-config.php" et remplir les
 * valeurs.
 *
 * @package WordPress
 */

// ** Réglages MySQL - Votre hébergeur doit vous fournir ces informations. ** //
/** Nom de la base de données de WordPress. */
define( 'DB_NAME', 'food' );

/** Utilisateur de la base de données MySQL. */
define( 'DB_USER', 'root' );

/** Mot de passe de la base de données MySQL. */
define( 'DB_PASSWORD', '' );

/** Adresse de l’hébergement MySQL. */
define( 'DB_HOST', 'localhost' );

/** Jeu de caractères à utiliser par la base de données lors de la création des tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** Type de collation de la base de données.
  * N’y touchez que si vous savez ce que vous faites.
  */
define('DB_COLLATE', '');

/**#@+
 * Clés uniques d’authentification et salage.
 *
 * Remplacez les valeurs par défaut par des phrases uniques !
 * Vous pouvez générer des phrases aléatoires en utilisant
 * {@link https://api.wordpress.org/secret-key/1.1/salt/ le service de clefs secrètes de WordPress.org}.
 * Vous pouvez modifier ces phrases à n’importe quel moment, afin d’invalider tous les cookies existants.
 * Cela forcera également tous les utilisateurs à se reconnecter.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'roeN,#89PZ8?OfbI47wb?V{yK{@QiDkj||ef@SoQV&t1OhgI,){ka5_~`V^,xTpy' );
define( 'SECURE_AUTH_KEY',  'nI{O%4+1=..SnNshMdd(T,x=I=y-=Z^SP~i,T*6/voI AJ<R@2j~KQ~Gg,WOWyJ^' );
define( 'LOGGED_IN_KEY',    '6Xu(M/=NYbT&_>->X&a]JimQQ`164Em1..T`K$Wb$nsXpZ(F$~Q>m_anj 5w.E&6' );
define( 'NONCE_KEY',        '5w(vLSRlm7Wu>3Ys0m7_z7KOTwzC8%nMX_Fgx`D):uI6>{([3bq9N1H#xhE~vwv,' );
define( 'AUTH_SALT',        'k4+qn~7eCC#dt`!Q}O.>WQ[|ADQ-xH%=#VeN1 4/ct3n{u]M@5A^t%*nhYb!iABF' );
define( 'SECURE_AUTH_SALT', ';ZK gDUg-6@I+w)*>BncKY{6IbbvmL62I}viJ?bpmT}hV/Gd#KD)6b/ovs46W^C7' );
define( 'LOGGED_IN_SALT',   'RPTWYFZr?n*Q}J`_u1R?sb2W qN zyh&S`K:4KBUCF>qCyUcMTT#=.sEYt/d6P W' );
define( 'NONCE_SALT',       'DS#r>IOIQ5#a0;Zp~w%Rj[U9*>]k@t~C}PT;p||UJl/S7WV<,<Y4ldMjS@Q*HS_?' );
/**#@-*/

/**
 * Préfixe de base de données pour les tables de WordPress.
 *
 * Vous pouvez installer plusieurs WordPress sur une seule base de données
 * si vous leur donnez chacune un préfixe unique.
 * N’utilisez que des chiffres, des lettres non-accentuées, et des caractères soulignés !
 */
$table_prefix = 'wp_';

/**
 * Pour les développeurs : le mode déboguage de WordPress.
 *
 * En passant la valeur suivante à "true", vous activez l’affichage des
 * notifications d’erreurs pendant vos essais.
 * Il est fortemment recommandé que les développeurs d’extensions et
 * de thèmes se servent de WP_DEBUG dans leur environnement de
 * développement.
 *
 * Pour plus d’information sur les autres constantes qui peuvent être utilisées
 * pour le déboguage, rendez-vous sur le Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* C’est tout, ne touchez pas à ce qui suit ! Bonne publication. */

/** Chemin absolu vers le dossier de WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Réglage des variables de WordPress et de ses fichiers inclus. */
require_once(ABSPATH . 'wp-settings.php');
