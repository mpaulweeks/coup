coup
====

Coup sim using websockets

player:
has a int (cash)
has lst of cards (hand)
has lst of cards (discard)
void draw(Deck)
Card returnToDeck(Deck, card_id) //returns card for possible revealing
obj json()

game:
has a deck
has a list of players
obj players_json()