import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import { basket as Basket }  from './basket';

Basket.clear();
Basket.require({ url: 'robot_one.js', execute: false, key: 'snippet_one'})
.then(() => {
  const var1 = Basket.get('snippet_one').data;
  console.log(var1.length);
  return Basket.require({ url: 'robot_two.js', execute: false, key: 'snippet_two'})
})
.then(() => {
  const var2 = Basket.get('snippet_two').data;
  console.log(var2);
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
