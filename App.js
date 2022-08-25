import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, Linking } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//only popular suffices are supported for now
let suffices = ["paytm","upi","ybl","apl","waaxis","wahdfcbank","waicici","wasbi","freecharge","payzapp"];

let name = "";
let stats = "";
const Stack = createNativeStackNavigator();

//makes an async request to the external API
const lookUpVPA = async (vpa) => {
	if (name) {
		throw "Already fulfilled!";
	}
	return fetch('https://upibankvalidator.com/api/upiValidation?upi=' + vpa, 
		{method: 'POST', body: JSON.stringify({upi: vpa})})
		.then((response) => response.json())
		.then((json) => {
			console.log(json);
			if (json.isUpiRegistered) {
				return json.name;
			} else {
				throw "Not found";
			}
		})
		.catch((error) => {
			console.error(error);
		});
};

function isNumber(number) {
	if (number.length != 10) {
		return false;
	}
	return true;
}

//go through each possible VPA, push it to an array and then execute all requests
const lookUpNumber = async (number, refresh) => {
	if (name) {
		name = "";
	}
	if (!isNumber(number)) {
		stats = "Error! Enter 10 digit Indian phone number!";
		refresh();
		return;
	}
	const vpalist = new Array();
	for (s in suffices) {
		vpalist.push(lookUpVPA(number + "@" + suffices[s]));
	}
	Promise.all(vpalist).then((returnval) => showName(returnval, refresh));
};

//go through each request's result and stop if we find a name
const showName = (resultArr, refresh) => {
	for (r in resultArr) {
		console.log(resultArr[r]);
		if (resultArr[r]) {
			name = resultArr[r];
			stats = "Found result!";
			refresh();
			return;
		}
	}
	stats = "Name not found!";
	refresh();
};

//simple function to make the answer titlecase
const titlecase = (string) => {
	if (string == "" || string == undefined) {
		return;
	}
	let words = string.split(" ");
	console.log(words);
	let newstr = "";
	for (w in words) {
		if (words[w] == "") {
			continue;
		}
		words[w] = words[w].toLowerCase();
		words[w][0].toUpperCase();
		newstr += words[w][0].toUpperCase() + words[w].slice(1) + " ";
		console.log("newstr: ", newstr);
	}
	console.log("newstr: ", newstr);
	return newstr;
};

function openInWhatsApp(number, refresh) {
	if (!isNumber(number)) {
		stats = "Error! Enter 10 digit Indian phone number!";
		refresh();
		return;
	}
	let url = "whatsapp://send?phone=91" +
		number;
        Linking.openURL(url)
        .catch(() => {
			console.log("WhatsApp not installed?");
        });
};

function MainScreen() {
	const [text, setText] = useState('');
	const [_, setValue] = useState();
	const refresh = () => {
		name = titlecase(name);
		setValue({});
	};
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Phone Number Lookup</Text>
			<TextInput autoComplete='tel-national' keyboardType='phone-pad' textContentType='telephoneNumber' maxLength={10} style={styles.input} placeholder="Enter phone number" onChangeText={newText => setText(newText)} defaultValue={text} />
			<Text>{name}</Text>
			<Button style={styles.button} title='Look It Up' onPress={() => lookUpNumber(text, refresh)}/>
			<Button style={styles.button} title='Open in WhatsApp' onPress={() => openInWhatsApp(text, refresh)}/>
			<Text>{stats}</Text>
			<StatusBar style="auto" />
		</View>
		);

}

//main function
export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Lookup" component={MainScreen} />
			</Stack.Navigator>
		</NavigationContainer>
		);
}

//style sheet
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	heading: {
		fontSize: 30,
	},
	button: {
		borderRadius: 25,
		alignItems: "center",
	},
	input: {
		height: 40,
		textAlign: 'center',
	},
});
