import React, { useReducer, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, StatusBar, Text, Switch, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './data/translations';
import StartScreen from './components/StartScreen';
import LifeCounter from './components/LifeCounter';

const initialCounters = count => Array(count).fill(null).map(() => ({
  life: 20, poison: 0, commanderDamage: 0, color: '#ddd'
}));

function reducer(state, action) {
  switch (action.type) {
    case 'CHANGE': {
      const { index, field, delta } = action.payload;
      const newCounters = state.counters.map((c, i) =>
        i === index ? { ...c, [field]: c[field] + delta } : c
      );
      const history = state.history.slice(0, state.pointer+1).concat([newCounters]);
      return { counters: newCounters, history, pointer: state.pointer+1 };
    }
    case 'COLOR': {
      const { index, color } = action.payload;
      const newCounters = state.counters.map((c, i) =>
        i === index ? { ...c, color } : c
      );
      const history = state.history.slice(0, state.pointer+1).concat([newCounters]);
      return { counters: newCounters, history, pointer: state.pointer+1 };
    }
    case 'UNDO':
      if(state.pointer<=0) return state;
      return { counters: state.history[state.pointer-1], history: state.history, pointer: state.pointer-1 };
    case 'REDO':
      if(state.pointer>=state.history.length-1) return state;
      return { counters: state.history[state.pointer+1], history: state.history, pointer: state.pointer+1 };
    case 'LOAD':
      return { ...state, counters: action.payload };
    default:
      return state;
  }
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showStart, setShowStart] = useState(true);
  const [numPlayers, setNumPlayers] = useState(4);

  const [state, dispatch] = useReducer(reducer, {
    counters: initialCounters(numPlayers),
    history: [initialCounters(numPlayers)],
    pointer: 0
  });

  // Load preferences and counters
  useEffect(() => {
    AsyncStorage.getItem('settings').then(json => {
      if(json) {
        const { dark, lang, players, counters } = JSON.parse(json);
        setDarkMode(dark);
        setLanguage(lang);
        setNumPlayers(players);
        if(counters) dispatch({ type: 'LOAD', payload: counters });
        setShowStart(false);
      }
    });
  }, []);

  // Persist settings
  useEffect(() => {
    AsyncStorage.setItem('settings', JSON.stringify({
      dark: darkMode, lang: language, players: numPlayers, counters: state.counters
    }));
  }, [darkMode, language, numPlayers, state.counters]);

  const theme = {
    background: darkMode ? '#1a1a1a' : '#f2f2f2',
    text: darkMode ? '#fff' : '#000'
  };

  const startGame = players => {
    setNumPlayers(players);
    dispatch({ type: 'LOAD', payload: initialCounters(players) });
    setShowStart(false);
  };

  const toggleLang = () => {
    const newLang = language==='en'?'es':'en';
    i18n.locale = newLang;
    setLanguage(newLang);
  };

  if(showStart) {
    return <StartScreen onStart={startGame} theme={theme} />;
  }

  return (
    <>
      <StatusBar barStyle={darkMode?'light-content':'dark-content'} />
      <SafeAreaView style={[styles.container,{backgroundColor:theme.background}]}>
        <View style={styles.header}>
          <Text style={[styles.title,{color:theme.text}]}>{i18n.t('title')}</Text>
          <View style={styles.toolsRow}>
            <TouchableOpacity onPress={()=>dispatch({type:'UNDO'})}><Text style={{color:theme.text}}>{i18n.t('undo')}</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>dispatch({type:'REDO'})}><Text style={{color:theme.text}}>{i18n.t('redo')}</Text></TouchableOpacity>
            <TouchableOpacity onPress={toggleLang}><Text style={{color:theme.text}}>{language.toUpperCase()}</Text></TouchableOpacity>
            <View style={styles.switchRow}><Text style={{color:theme.text}}>{i18n.t('dark')}</Text><Switch value={darkMode} onValueChange={setDarkMode} /></View>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          {state.counters.map((c,i)=>(
            <LifeCounter key={i} index={i+1} theme={theme} life={c.life} poison={c.poison} commanderDamage={c.commanderDamage} color={c.color} dispatch={dispatch} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container:{flex:1},
  header:{padding:16},
  title:{fontSize:24,fontWeight:'bold',marginBottom:8},
  toolsRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  switchRow:{flexDirection:'row',alignItems:'center'},
  scroll:{padding:16}
});
