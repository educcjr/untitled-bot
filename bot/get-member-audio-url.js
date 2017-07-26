

module.exports = (id) => {
  const members = {
    murilo: {id: '7393', url: 'members_sounds/murilo.mp3'},
    renan: {id: '2588', url: 'members_sounds/renan.mp3'},
    vitor: {id: '2932', url: 'members_sounds/vitor.mp3'},
    dodo: {id: '3489', url: 'members_sounds/dodo.mp3'},
    gus: {id: '9982', url: 'members_sounds/gus.mp3'},
    eduardo: {id: '3306', url: 'members_sounds/eduardo.mp3'},
    ruedo: {id: '3719', url: 'members_sounds/ruedo.mp3'},
    joao: {id: '8854', url: 'members_sounds/joao.mp3'},
    patrick: {id: '9384', url: 'members_sounds/patrick.mp3'}
  };

  switch(id) {
    case members.murilo.id:
      return members.murilo.url;
    case members.renan.id:
      return members.renan.url;
    case members.dodo.id:
      return members.dodo.url;
    case members.gus.id:
      return members.gus.url;
    case members.eduardo.id:
      return members.eduardo.url;
    case members.patrick.id:
      return members.patrickgus.url;
    case members.joao.id:
      return members.joao.url;
    case members.ruedo.id:
      return members.ruedo.url;
    case members.vitor.id:
      return members.vitor.url;
    default:
      return undefined;
  }
}