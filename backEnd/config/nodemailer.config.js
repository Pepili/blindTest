const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "service.kelzic@gmail.com",
    pass: "D65z(b5%Y%iS",
  },
});

module.exports.sendConfirmationEmail = (name, email, id) => {
  transport.sendMail({
    from: "service.kelzic@gmail.com",
    to: email,
    subject: "Veuillez confirmer votre email",
    html: `
          <h1 class="emailTitle">Confirmation Email</h1>
          <h2 class="emailWelcome">Bienvenue ${name} !</h2>
          <p class="inscriptionTitle">Merci de t'être inscrit sur kelzic</p>
          <p>Je suis ravie de te compter parmis nous, mais il te reste une dernière petite étape...</p>
          <p>Il faut valider ton adresse mail grâçe au lien ci-dessous:</p>
          <a class="emailLink" href=http://localhost:5500/assets/html/confirmation.html?id=${id}> Coucou, c'est ici qu'il faut cliquer</a>
          <p>Ton adresse mail est très utile pour modifier ton mot de passe si tu l'oublies!</p>
          <p>Bon allez, je te laisse cliquer et profiter de Kelzic, ton blind test préféré (on me l'a dit, ne dément pas!)</p>
          <p class="kiss">Bisous ${name}</p>
    `,
  });
};

module.exports.sendChangePassword = (name, email, id) => {
  transport.sendMail({
    from: "service.kelzic@gmail.com",
    to: email,
    subject: "Changement de mot de passe",
    html: `
         <h1>Changement de Mot de passe</h1>
         <h2>Coucou ${name}</h2>
         <p>Tu as demandé à changer de mot de passe</p>
         <p>Pour ce faire, clique sur le lien ci-dessous :</p>
         <a class="emailLink" href=http://localhost:5500/assets/html/password.html?id=${id}> Coucou, c'est ici qu'il faut cliquer</a>
         <p>Bisous, Kelzic</p>
    `,
  });
};

module.exports.changeEmail = (name, email, id) => {
  transport.sendMail({
    from: "service.kelzic@gmail.com",
    to: email,
    subject: "Veuillez confirmer votre email",
    html: `
          <h1 class="emailTitle">Confirmation Email</h1>
          <h2 class="emailWelcome">Coucou ${name} !</h2>
          <p>Tu as modifié ton adresse mail</p>
          <p>Il faut maintenant la valider grâçe au lien ci-dessous:</p>
          <a class="emailLink" href=http://localhost:5500/assets/html/confirmation.html?id=${id}> Coucou, c'est ici qu'il faut cliquer</a>
          <p>Ton adresse mail est très utile pour modifier ton mot de passe si tu l'oublies!</p>
          <p>Bon allez, je te laisse cliquer et profiter de Kelzic, ton blind test préféré (on me l'a dit, ne dément pas!)</p>
          <p class="kiss">Bisous ${name}</p>
    `,
  });
};
