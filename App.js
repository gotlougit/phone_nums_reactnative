import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import React, { useState } from 'react';

//only popular suffices are supported for now
let suffices = ["paytm","upi","ybl","apl","okaxis","okbizaxis","okhdfcbank","okicici",
"oksbi","waaxis","wahdfcbank","waicici","wasbi","freecharge","payzapp"];

let answer = "";

const lookUpVPA = async (vpa, refresh) => {
	console.log("making request for vpa: " + vpa);
	return fetch('https://upibankvalidator.com/api/upiValidation?upi=' + vpa, 
		{method: 'POST', body: JSON.stringify({upi: vpa})})
		.then((response) => response.json())
		.then((json) => {
			if (json.isUpiRegistered) {
				if (!answer) {
					answer = (json.name);
					refresh();
				}
				return;
			} else {
				throw "not found";
			}
		})
		.catch((error) => {
			console.error(error);
		});
};

const lookUpNumber = async (number, refresh) => {
	if (answer) {
		answer = "";
	}
	const vpalist = new Array();
	for (s in suffices) {
		vpalist.push(lookUpVPA(number + "@" + suffices[s], refresh));
	}
	Promise.any(vpalist).then(() => console.log(answer));
};

export default function App() {
	const [text, setText] = useState('');
	const [_, setValue] = useState();
	const refresh = () => {
		setValue({});
	};
	return (
		<View style={styles.container}>
			<Text style={{fontSize: 30}}>Phone Number Lookup</Text>
			<TextInput autoComplete='tel-national' keyboardType='phone-pad' textContentType='telephoneNumber' maxLength={10} style={{height: 40}} placeholder="Enter phone number" onChangeText={newText => setText(newText)} defaultValue={text} />
			<Text>{answer}</Text>
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
