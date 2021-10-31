import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import moment from "moment";
import "moment/locale/pt-br";

import commonStyles from "../commonStyles";
import todayImage from "../../assets/imgs/today.jpg";
import Bill from "../components/Bill";

import { CheckBox } from "react-native-elements";
import AddBill from "./AddBill";
import { Ionicons } from "@expo/vector-icons";
import { createIconSetFromFontello } from "react-native-vector-icons";

const initialState = {
  showDoneBills: true,
  showAddBill: false,
  visibleBills: [],
  bills: [
    
  ],
};

export default class BillList extends Component {
  state = {
    ...initialState,
  };

  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem("billsState");
    const state = JSON.parse(stateString) || initialState;
    this.setState(state, this.filterBills);
  };

  toggleFilter = () => {
    this.setState(
      { showDoneBills: !this.state.showDoneBills },
      this.filterBills
    );
  };

  filterBills = () => {
    let visibleBills = null;
    if (this.state.showDoneBills) {
      visibleBills = [...this.state.bills];
    } else {
      const pending = (bill) => bill.paidAt === null;
      visibleBills = this.state.bills.filter(pending);
    }

    this.setState({ visibleBills });
    AsyncStorage.setItem("billsState", JSON.stringify(this.state));
  };

  toggleBill = (billId) => {
    const bills = [...this.state.bills];
    bills.forEach((bill) => {
      if (bill.id === billId) {
        bill.paidAt = bill.paidAt ? null : new Date();
      }
    });

    this.setState({ bills }, this.filterBills);
  };

  deleteBill = (id) => {
    const bills = this.state.bills.filter((bill) => bill.id !== id);
    this.setState({ bills }, this.filterBills);
  };

  addBill = (newBill) => {
    if (!newBill.desc || !newBill.desc.trim()) {
      Alert.alert("Dados inválidos", "Descrição não informada");
      return;
    }
    const bills = [...this.state.bills];
    bills.push({
      id: Math.random(),
      desc: newBill.desc,
      date: newBill.date,
      paidAt: null,
    });
    this.setState({ bills, showAddBill: false }, this.filterBills);
  };

  render() {
    const mesDesc = moment().locale("pt-br").format("MMMM YYYY").capitalize();;
    return (
      <View style={styles.container}>
        <AddBill
          isVisible={this.state.showAddBill}
          onCancel={() => this.setState({ showAddBill: false })}
          onSave={this.addBill}
        />
        <ImageBackground style={styles.titleContainer} source={todayImage}>
          <CheckBox
            containerStyle={{
              alignItems: "flex-end",
              backgroundColor: "transparent",
              borderWidth: 0,
            }}
            checked={this.state.showDoneBills}
            // title="Mostrar concluídas"
            checkedColor="#fff"
            uncheckedColor="#ccc"
            onPress={() => {
              this.toggleFilter();
            }}
          ></CheckBox>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{mesDesc}</Text>
            <Text style={styles.subtitle}>Contas do mês</Text>
          </View>
        </ImageBackground>
        <View style={styles.billList}>
          <FlatList
            data={this.state.visibleBills}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Bill
                {...item}
                onToggleBill={this.toggleBill}
                onDelete={this.deleteBill}
              />
            )}
          ></FlatList>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => this.setState({ showAddBill: true })}
        >
          <Ionicons
            name="add-circle"
            size={70}
            color={commonStyles.colors.today}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF5733",
  },
  titleContainer: {
    flex: 2,
    backgroundColor: "#aa1",
  },
  titleBar: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 8,
  },
  billList: {
    flex: 8,
    backgroundColor: commonStyles.colors.ouro,
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 44,
    color: commonStyles.colors.secondary,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.secondary,
  },
  addButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 70,
    height: 70,
    //borderRadius: 25,
    //backgroundColor: commonStyles.colors.today,
    justifyContent: "center",
    alignItems: "center",
  },
});
