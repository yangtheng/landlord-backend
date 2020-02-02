const shuffleDeckInto3Piles = () => {
  let deck = [];
  const types = ['3','4','5','6','7','8','9','T','J','Q','K','A','2'];
  const suit = ['h','s','c','d'];
  for (var i = 0; i < types.length; i++) {
    for (var j = 0; j < suit.length; j++) {
      deck.push({
        type: types[i],
        suit: suit[j],
        image: `images/${types[i]}${suit[j]}.svg`,
      });
    }
  }
  deck = [
    ...deck,
    {
      type: 'Joker',
      suit: 'black',
      image: `images/black_joker.svg`,
    },
    {
      type: 'Joker',
      suit: 'red',
      image: `images/red_joker.svg`,
    },
  ];

  const shuffledDeck = shuffle(deck);
  return [
    sort(shuffledDeck.slice(0, 17), types),
    sort(shuffledDeck.slice(17, 34), types),
    sort(shuffledDeck.slice(34, 51), types),
  ];
};

const shuffle = (deck) => {
  for (var i = deck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
  return deck;
}

const sort = (cards, types) => {
  cards.sort((a, b) => {
    if (a.suit === 'red' && b.suit === 'black') return 1;
    if (a.suit === 'black' && b.suit === 'red') return -1;
    if (a.type === 'Joker') return 1;
    if (b.type === 'Joker') return -1;
    if (a.type === b.type) return 0;
    if (types.indexOf(a.type) > types.indexOf(b.type)) return 1;
    if (types.indexOf(a.type) < types.indexOf(b.type)) return -1;
  })
  return cards;
}

module.exports = { shuffleDeckInto3Piles };
