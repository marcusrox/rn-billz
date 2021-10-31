import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import commonStyles from '../commonStyles';
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment'
import 'moment/locale/pt-br'


export default props => {

    const paidOrNot = props.paidAt ? { textDecorationLine: 'line-through' } : {}
    const formatedDate = props.paidAt ? 
        moment(props.paidAt)
        .locale("pt-br")
        .format("dddd, D [de] MMMM") : 
        '(pendente)'

    const getRightContent = () => {
        return (
          <TouchableOpacity
            style={styles.swipeRight}
            activeOpacity={0.7}
            onPress={() => props.onDelete(props.id)}
          >
            <Ionicons name="trash-outline" size={22} color="#eee"></Ionicons>
          </TouchableOpacity>
        );
    }

    const getLeftContent = () => {
      return (
        <View style={styles.swipeLeft}>
          <Ionicons name="trash-outline" size={22} color="#eee"></Ionicons>
          <Text style={styles.swipeLeftText}>Excluir</Text>
        </View>
      );
    };    

    return (
      <Swipeable
        renderRightActions={getRightContent}
        renderLeftActions={getLeftContent}
        onSwipeableLeftOpen={() => props.onDelete(props.id)}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => props.onToggleBill(props.id)}
          >
            <View style={styles.checkContainer}>
              {getCheckView(props.paidAt)}
            </View>
          </TouchableWithoutFeedback>
          <View>
            <Text style={[styles.desc, paidOrNot]}>{props.desc}</Text>
            <Text style={styles.date}>{formatedDate}</Text>
            {/* <Text>{props.doneAt + ""}</Text> */}
          </View>
        </View>
      </Swipeable>
    );
}

function getCheckView(paidAt) {
  if (paidAt)
    return (
      <View style={styles.paid}>
        <Ionicons name="checkmark" size={20} color="#fff"></Ionicons>
      </View>
    );
  else
    return (
      <View style={styles.pending}>
        <Text></Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderColor: "#667",
    borderBottomWidth: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: commonStyles.colors.ouro,
  },
  checkContainer: {
    width: "20%",
    alignItems: "center", // Alinhamento do main axis
    justifyContent: "center",
  },
  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#555",
  },
  paid: {
    height: 25,
    width: 25,
    borderRadius: 13,
    //borderWidth: 1,
    backgroundColor: "#4d7031",
    alignItems: "center", // Alinhamento do main axis
    justifyContent: "center",
  },
  desc: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 15,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
  },
  swipeRight: {
    justifyContent: "center",
    alignItems: "center",
    //marginHorizontal: 12,
    width: 80,
    backgroundColor: commonStyles.colors.today,
  },
  swipeLeft: {
    flexDirection: "row",
    flex: 1, // Crescer por todo o row
    //justifyContent: "center",
    alignItems: "center",
    paddingLeft: 16,
    backgroundColor: commonStyles.colors.today,
    //width: 80,
  },
  swipeLeftText: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 12,
    color: "#fff",
    marginLeft: 6,
  },
});

