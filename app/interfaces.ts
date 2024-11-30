export interface ScryfallCard {
  object: "card"
  id: string
  oracle_id: string
  multiverse_ids?: number[]
  name: string
  lang: string
  released_at: string
  uri: string
  scryfall_uri: string
  layout: string
  highres_image: boolean
  image_uris?: {
    small: string
    normal: string
    large: string
    png: string
    art_crop: string
    border_crop: string
  }
  mana_cost?: string
  cmc: number
  type_line: string
  oracle_text?: string
  power?: string
  toughness?: string
  loyalty?: string
  colors?: string[]
  color_identity: string[]
  keywords: string[]
  legalities: {
    standard: string
    future: string
    historic: string
    modern: string
    pioneer: string
    legacy: string
    pauper: string
    vintage: string
    penny: string
    commander: string
    brawl: string
    historicbrawl: string
    alchemy: string
    paupercommander: string
    duel: string
    oldschool: string
    premodern: string
  }
  set: string
  set_name: string
  rarity: string
  flavor_text?: string
  artist?: string
  border_color: string
  frame: string
  frame_effects?: string[]
  full_art: boolean
  textless: boolean
  booster: boolean
  story_spotlight: boolean
  edhrec_rank?: number
  related_uris?: {
    gatherer: string
    tcgplayer_infinite_articles: string
    tcgplayer_infinite_decks: string
    edhrec: string
  }
  all_parts?: {
    object: string
    id: string
    component: string
    name: string
    type_line: string
    uri: string
  }[]
  card_faces?: {
    object: "card_face"
    name: string
    mana_cost: string
    type_line: string
    oracle_text: string
    colors?: string[]
    flavor_text?: string
    artist?: string
    illustration_id?: string
    image_uris?: {
      small: string
      normal: string
      large: string
      png: string
      art_crop: string
      border_crop: string
    }
  }[]
}

export interface ICard extends ScryfallCard {
    quantity: number
    isDoubleSide: boolean
}
