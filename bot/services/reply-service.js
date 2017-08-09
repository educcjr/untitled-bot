class ReplyService {
  reply ({ content, channel, author }) {
    if (!author.bot) {
      let messageContent = content.toLowerCase();

      if (messageContent.match(/rpg/g)) {
        channel.send('Ihhhh, Eduardo vai atrasar.');
      }

      if (messageContent.match(/carioca/g)) {
        channel.send('Savages.');
      }

      if (messageContent.match(/paçoca/g)) {
        channel.send('Salgada, claro.');
      }

      if (messageContent.match(/gus/g)) {
        channel.send('Esse não bate bem.');
      }

      if (messageContent.match(/dodo/g)) {
        channel.send('GULAGS WERE NECESSARY!');
      }

      if (messageContent.match(/vitão/g)) {
        channel.send('Fala baixo se não ele escuta.');
      }

      if (messageContent.match(/murilo/g)) {
        channel.send('Você quis dizer "Google"?');
      }

      if (messageContent.match(/patrick/g)) {
        channel.send('Vocês quis dizer "Como ir na balada e não gastar nada"?');
      }

      if (messageContent.match(/ruedo/g)) {
        channel.send('Pausa a partida, se não caiu ainda, provavelmente vai cair logo.');
      }

      if (messageContent.match(/renan/g)) {
        channel.send('Mete o louco que transa.');
      }

      if (messageContent.match(/selvagem/g)) {
        channel.send('Olha os caras, ofendendo os cariocas mesmo.');
      }

      if (messageContent.match(/bora ota/g)) {
        channel.send('Tem certeza que quer fazer isso?');
      }

      if (messageContent.match(/hentai/g)) {
        channel.send('De novo vendo isso, Renan?');
      }

      if (messageContent.match(/google/g)) {
        channel.send('Murilo está presente?');
      }
    }
  }
}

module.exports = ReplyService;
