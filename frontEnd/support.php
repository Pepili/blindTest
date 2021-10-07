<?php
if(isset($_POST['mailform']))
{
	if(!empty($_POST['nom']) AND !empty($_POST['mail']) AND !empty($_POST['message']))
	{
		$header="MIME-Version: 1.0\r\n";
		$header.='From:"VOTRE NOM"<email-expediteur@example.org>'."\n";
		$header.='Content-Type:text/html; charset="utf-8"'."\n";
		$header.='Content-Transfer-Encoding: 8bit';

		$message='
		<html>
			<body>
				<div align="center">
					<u>Nom de l\'expéditeur :</u>'.$_POST['nom'].'<br />
					<u>Mail de l\'expéditeur :</u>'.$_POST['mail'].'<br />
					<br />
					'.nl2br($_POST['message']).'
				</div>
			</body>
		</html>
		';

		$nom = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $formcontent="De: $name \n Message: $message";
    $recipient = "lisa.genest02@gmail.com";
    $subject = "Formulaire kelZic";
    $mailheader = "De : $email \r\n";
    mail($recipient, $subject, $formcontent, $mailheader);
		$msg="Votre message a bien été envoyé !";
  }	else {
		$msg="Tous les champs doivent être complétés !";
	} 
}
?>

<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Kelzic est un blind test sur les films, séries, jeux-vidéos, dessin-animés et émissions télé
      à jouer seul ou en équipe!"
    />
    <link rel="stylesheet" href="/assets/css/style.css" />
    <link rel="stylesheet" href="/assets/css/fontawesome/css/all.min.css" />
    <title>KelZic</title>
  </head>
  <body>
    <header class="headerWelcome">
      <img class="logoGif" id="logoSupport"alt="logo" src="/assets/images/logo4.png" />
      <h1 class="titleWelcome" id="titleSupport">KelZic</h1>
    </header>
    <div class="textSupport">
      <p>
        Salut! </br> Tu peux me faire un retour ici sur tes impressions, des bugs que
        tu as pu remarquer, des idées de fonctionnalités ou encore des nouvelles
        musiques à rajouter! (en précisant sa catégorie et son titre). <br />Je compte
        sur toi pour m'aider à améliorer KelZic! <br />
      </p>
      <p id="ps">
        ps: vérifie bien que la
        musique n'est pas déjà présente avant de me la proposer
      </p>
    </div>
    <form class="supportForm" action="" method="POST">
      <label for="name">Nom *</label>
      <input type="text" class="input" name="name" id="name" value="<?php if(isset($_POST['nom'])) { echo $_POST['nom']; } ?>" placeholder="ex: John" />
      <label for="name">Email *</label>
      <input
        type="text"
        name="email"
        id="email"
        class="input"
        placeholder="ex: JohnSmith@gmail.com"
        value="<?php if(isset($_POST['mail'])) { echo $_POST['mail']; } ?>"
      />
      <label for="name">Message *</label>
      <textarea
        name="message"
        rows="10"
        cols="25"
        id="message"
        placeholder="Ecris ton message ici..."
      >
         <?php if(isset($_POST['message'])) { echo $_POST['message']; } ?>
      </textarea> <br />
      <input type="submit" value="Envoyer" class="button" id="buttonSupport" name="mailform"/>
    </form>
    <?php
		  if(isset($msg))
		  {
			  echo $msg;
		  }
		?>
  </body>
</html>
