import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import { basket as Basket }  from './basket';

console.log('Basket stuff',Basket);

Basket.require({ url: 'testscript.js', execute: false, key: 'snippet_one'})
.then(() => {
	console.log('default execution is disabled and fetched from localstorage');
	console.log(Basket.get('snippet_one'));
})


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
