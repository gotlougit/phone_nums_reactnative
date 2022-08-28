# Phone Number Lookup React Native App

This is a React Native project to build an app that allows users to use the UPI system to do a lookup of Indian mobile phone numbers.

For more info on how this works, you can read [this blog post](https://gotlou.srht.site/phone-num-lookup.html).

## Usage

Right now, I don't have APKs built for direct usage, but I'll get a CI/CD pipeline up for that.

## Development Requirements

React Native, see [here](https://reactnative.dev/docs/environment-setup) on how to get React Native on your system.

Once that has been done, simply run

```
npm start
```

to start a development server, and use the Expo app, available on iOS and Android to run the code in development mode.

## Usage

Simply type in the phone number that you want to lookup as a continuous sequence of numbers (no spaces or dashes).

The phone number will be looked up using the popular suffix list. If no result is found, a corresponding message will be printed.

In the event of no result being found, you can also use the "Open In WhatsApp" button to search for the number as well. As WhatsApp is very popular in India, chances are you already have it installed and so does the other party.

## TODO

- Get an automated build system running to distribute APKs

- Add option to perform a full lookup by using every single UPI VPA possible for a phone number.

- Allow easy saving of successfully looked up phone number to contact list

- Add a dark mode

## Disclaimer

I do NOT own or operate or have anything to do with upibankvalidator.com. While they don't really get a whole lot of info about you specifically other than that you made the request using httpie and what IP address you had at the time, I don't know how they use this information. Use at your own risk, I am NOT liable for any damages.

This tool was primarily made for educational purposes.

## Acknowledgements

Thanks to [Aseem Shrey](https://aseemshrey.in/) for building a similar tool [here](https://github.com/LuD1161/upi-recon-cli), written in Go. One of the GitHub issues on that page led me to upibankvalidator.com

The suffix lists are taken from that project.

## License

This project is licensed under the GNU General Public Licence v2.
