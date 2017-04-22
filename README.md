# Arduino-Browser-Editor
A simple browser based IDE for Arduino based on Cylon

# Motivation
Idea is to use [Cylon](https://cylonjs.com/) which is a fantastic IOT javascript framework and put together a simple Arduino IDE which would ultimately be distributed as a Chrome App.

# Current Status
I have started this project using React and am learning it as I develop more features. Embedded text editor uses [Code Mirror](https://github.com/JedWatson/react-codemirror) and for data flow management I am experimenting with [Redux](http://redux.js.org/docs/basics/UsageWithReact.html). Since, this project would involve dynmic script loading and caching (localStorage), I decided to go with [Basket](https://addyosmani.com/basket.js/) which seems like an extremely useful tool (Big ups to AddyOsmani)!


# Goals
* Unit tests! Want to write unit tests for all components
* Wire Up Chrome API's and get initial functionality
* `Basket.js` is currently distributed on CDN and doesn't have a registry on NPM (:/) and the code is also pretty ancient. I plan to write a node module and push it to NPM.
