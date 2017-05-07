import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import { basket as Basket }  from './basket_chrome';

Basket.clear();
console.log('Basket require call is started....');
Basket.require({ url: '/resources/robot_one.js', execute: false, key: 'snippet_one'})
.then(() => {
  console.log('Basket require call for 1 is finished....');
  console.log('====================================');
  return Basket.get('snippet_one');
  //return Basket.require({ url: '/resources/robot_two.js', execute: false, key: 'snippet_two'})
})
.then((item) => {
  console.log('Got item 1 from Basket', item);
  //const var2 = Basket.get('snippet_two').data;
  //console.log(var2);
  return Basket.require({ url: '/resources/robot_two.js', execute: false, key: 'snippet_two'})
})
.then(() => {
  console.log('Basket require call for 2 is finished....');
  console.log('====================================');
  return Basket.get('snippet_two');
})
.then((item) => {
  console.log('Got item 2 from Basket', item);
});

/*store.subscribe(() => {
   console.log('Some event took place',store.getState());
  }
)*/

ReactDOM.render(
	<Provider store={store}>
    	<App />
  	</Provider>,
	document.getElementById('root')
);
