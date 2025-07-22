import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

i18n.translations = {
  en: {
    title: 'Cartusho MTG',
    undo: 'Undo',
    redo: 'Redo',
    dark: 'Dark',
    language: 'Language',
    players: 'Players',
    selectPlayers: 'Select Players',
    player: 'Player',
    life: 'Life',
    poison: 'Poison',
    commanderDamage: 'Commander Damage',
    selectColor: 'Select Color',
    changeColor: 'Change Color'
  },
  es: {
    title: 'Cartusho MTG',
    undo: 'Deshacer',
    redo: 'Rehacer',
    dark: 'Oscuro',
    language: 'Idioma',
    players: 'Jugadores',
    selectPlayers: 'Seleccionar Jugadores',
    player: 'Jugador',
    life: 'Vida',
    poison: 'Veneno',
    commanderDamage: 'Daño Comandante',
    selectColor: 'Seleccionar Color',
    changeColor: 'Cambiar Color'
  }
};

i18n.locale = Localization.locale;
i18n.fallbacks = true;

export default i18n;
