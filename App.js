import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import React, { useState } from 'react';

//only popular suffices are supported for now
let suffices = ["paytm","upi","ybl","apl","okaxis","okbizaxis","okhdfcbank","okicici",
"oksbi","waaxis","wahdfcbank","waicici","wasbi","freecharge","payzapp"];

let name = "";

const lookUpVPA = async (vpa) => {
	return fetch('https://upibankvalidator.com/api/upiValidation?upi=' + vpa, 
		{method: 'POST', body: JSON.stringify({upi: vpa})})
		.then((response) => response.json())
		.then((json) => {
			if (json.isUpiRegistered) {
				return json.name;
			}
		})
		.catch((error) => {
			console.error(error);
		});
};

const lookUpNumber = async (number, refresh) => {
	if (number.toString().length != 10) {
		name = "Error! Enter 10 digit Indian phone number!";
		refresh();
		return;
	}
	if (name) {
		name = "";
	}
	const vpalist = new Array();
	for (s in suffices) {
		vpalist.push(lookUpVPA(number + "@" + suffices[s]));
	}
	Promise.all(vpalist).then((returnval) => showName(returnval, refresh));
};

const showName = (resultArr, refresh) => {
	for (r in resultArr) {
		if (resultArr[r]) {
			name = resultArr[r];
			refresh();
			return;
		}
	}
	name = "Name not found!";
	refresh();
};

const titlecase = (string) => {
	let words = string.split(" ");
	console.log(words);
	let newstr = "";
	for (w in words) {
		words[w] = words[w].toLowerCase();
		words[w][0].toUpperCase();
		newstr += words[w][0].toUpperCase() + words[w].slice(1) + " ";
		console.log("newstr: ", newstr);
	}
	console.log("newstr: ", newstr);
	return newstr;
};

export default function App() {
	const [text, setText] = useState('');
	const [_, setValue] = useState();
	const refresh = () => {
		name = titlecase(name);
		setValue({});
	};
	return (
		<View style={styles.container}>
			<Text style={{fontSize: 30}}>Phone Number Lookup</Text>
			<TextInput autoComplete='tel-national' keyboardType='phone-pad' textContentType='telephoneNumber' maxLength={10} style={{height: 40}} placeholder="Enter phone number" onChangeText={newText => setText(newText)} defaultValue={text} />
			<Text>{name}</Text>
			<Button title='Look It Up' onPress={() => lookUpNumber(text, refresh)}/>
			<StatusBar style="auto" />
		</View>
		);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
