import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../data/translations';

export default function StartScreen({ onStart, theme }) {
  const [players, setPlayers] = useState(4);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{i18n.t('selectPlayers')}</Text>
      <View style={styles.row}>
        {[2,3,4,5,6].map(n => (
          <TouchableOpacity 
            key={n} 
            onPress={() => setPlayers(n)} 
            style={[styles.btn, players === n && { borderColor: theme.text }]}>
            <Text style={{ color: theme.text }}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={() => onStart(players)} style={styles.startBtn}>
        <Text style={{ color: '#fff' }}>{i18n.t('players')}: {players}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, justifyContent:'center', alignItems:'center'},
  title: {fontSize:24, marginBottom:16},
  row: {flexDirection:'row', marginBottom:24},
  btn: {
    padding:12, margin:4, borderWidth:2, borderRadius:8
  },
  startBtn: {
    padding:12, backgroundColor:'#007AFF', borderRadius:8
  }
});
