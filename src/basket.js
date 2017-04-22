/*!
* basket.js
* v0.5.2 - 2015-02-07
* http://addyosmani.github.com/basket.js
* (c) Addy Osmani;  License
* Created by: Addy Osmani, Sindre Sorhus, Andrée Hansson, Mat Scales
* Contributors: Ironsjp, Mathias Bynens, Rick Waldron, Felipe Morais
* Uses rsvp.js, https://github.com/tildeio/rsvp.js
*/

import RSVP from 'rsvp';

let basket;
const head = document.head || document.getElementsByTagName('head')[0];
const storagePrefix = 'basket-';
const defaultExpiration = 5000;
const inBasket = [];

const addLocalStorage = (key, storeObj) => {
	try {
		localStorage.setItem( storagePrefix + key, JSON.stringify( storeObj ) );
		return true;
	} catch( e ) {
		if ( e.name.toUpperCase().includes('QUOTA') ) {
			let item;
			const tempScripts = [];

			for ( item in localStorage ) {
				if ( item.indexOf( storagePrefix ) === 0 ) {
					tempScripts.push( JSON.parse( localStorage[ item ] ) );
				}
			}

			if ( tempScripts.length ) {
				tempScripts.sort((a, b) => a.stamp - b.stamp);

				basket.remove( tempScripts[ 0 ].key );

				return addLocalStorage( key, storeObj );

			} else {
				// no files to remove. Larger than available quota
				return;
			}

		} else {
			// some other error
			return;
		}
	}

};

const getUrl = url => {
	const promise = new RSVP.Promise( (resolve, reject) => {

		const xhr = new XMLHttpRequest();
		xhr.open( 'GET', url );

		xhr.onreadystatechange = () => {
			if ( xhr.readyState === 4 ) {
				if ( ( xhr.status === 200 ) ||
						( ( xhr.status === 0 ) && xhr.responseText ) ) {
					resolve( {
						content: xhr.responseText,
						type: xhr.getResponseHeader('content-type')
					} );
				} else {
					reject( new Error( xhr.statusText ) );
				}
			}
		};

		// By default XHRs never timeout, and even Chrome doesn't implement the
		// spec for xhr.timeout. So we do it ourselves.
		setTimeout( () => {
			if( xhr.readyState < 4 ) {
				xhr.abort();
			}
		}, basket.timeout );

		xhr.send();
	});

	return promise;
};

const wrapStoreData = (obj, data) => {
	const now = +new Date();
	obj.data = data.content;
	obj.originalType = data.type;
	obj.type = obj.type || data.type;
	obj.skipCache = obj.skipCache || false;
	obj.stamp = now;
	obj.expire = now + ( ( obj.expire || defaultExpiration ) * 60 * 60 * 1000 );

	return obj;
};

const saveUrl = obj => getUrl( obj.url ).then( result => {
    const storeObj = wrapStoreData( obj, result );

    if (!obj.skipCache) {
        addLocalStorage( obj.key , storeObj );
    }

    return storeObj;
});

const isCacheValid = (source, obj) => !source ||
    source.expire - +new Date() < 0  ||
    obj.unique !== source.unique ||
    (basket.isValidItem && !basket.isValidItem(source, obj));

const handleStackObject = obj => {
    let source;
    let promise;
    let shouldFetch;

    if ( !obj.url ) {
		return;
	}

    obj.key =  ( obj.key || obj.url );
    source = basket.get( obj.key );

    obj.execute = obj.execute !== false;

    shouldFetch = isCacheValid(source, obj);

    if( obj.live || shouldFetch ) {
		if ( obj.unique ) {
			// set parameter to prevent browser cache
			obj.url += `${( obj.url.indexOf('?') > 0 ) ? '&' : '?'}basket-unique=${obj.unique}`;
		}
		promise = saveUrl( obj );

		if( obj.live && !shouldFetch ) {
			promise = promise
				.then( result => // If we succeed, just return the value
            // RSVP doesn't have a .fail convenience method
            result, () => source);
		}
	} else {
		source.type = obj.type || source.originalType;
		source.execute = obj.execute;
		promise = new RSVP.Promise( resolve => {
			resolve( source );
		});
	}

    return promise;
};

const injectScript = obj => {
	const script = document.createElement('script');
	script.defer = true;
	// Have to use .text, since we support IE8,
	// which won't allow appending to a script
	script.text = obj.data;
	head.appendChild( script );
};

const handlers = {
	'default': injectScript
};

const execute = obj => {
	if( obj.type && handlers[ obj.type ] ) {
		return handlers[ obj.type ]( obj );
	}

	return handlers['default']( obj ); // 'default' is a reserved word
};

const performActions = resources => resources.map( obj => {
    if( obj.execute ) {
        execute( obj );
    }

    return obj;
} );

const fetch = function() {
    let i;
    let l;
    const promises = [];

    for ( i = 0, l = arguments.length; i < l; i++ ) {
		promises.push( handleStackObject( arguments[ i ] ) );
	}

    return RSVP.all( promises );
};

const thenRequire = function() {
	const resources = fetch(...arguments);
	const promise = this.then( () => resources).then( performActions );
	promise.thenRequire = thenRequire;
	return promise;
};

const arduinoCylon = function(script_data) {

		//Remove the existing script tag
		let script_el = document.getElementById('arduinoCylonScriptCombined');
		script_el.remove(); 

		//Create new script element and set it to the script_data and append to head
		script_el = document.createElement('script');
		script_el.setAttribute("id", "arduinoCylonScriptCombined");
		script_el.defer = true;
		// Have to use .text, since we support IE8,
		// which won't allow appending to a script
		script_el.text = script_data;
		head.appendChild( script_el );
};


basket = {
	require() {
		for ( let a = 0, l = arguments.length; a < l; a++ ) {
			arguments[a].execute = arguments[a].execute !== false;
			
			if ( arguments[a].once && inBasket.includes(arguments[a].url) ) {
				arguments[a].execute = false;
			} else if ( arguments[a].execute !== false && !inBasket.includes(arguments[a].url) ) {  
				inBasket.push(arguments[a].url);
			}
		}
                    
		const promise = fetch(...arguments).then( performActions );

		promise.thenRequire = thenRequire;
		return promise;
	},

	arduinoCylon : arduinoCylon,

	remove(key) {
		localStorage.removeItem( storagePrefix + key );
		return this;
	},

	get(key) {
		const item = localStorage.getItem( storagePrefix + key );
		try	{
			return JSON.parse( item || 'false' );
		} catch( e ) {
			return false;
		}
	},

	clear(expired) {
        let item;
        let key;
        const now = +new Date();

        for ( item in localStorage ) {
			key = item.split( storagePrefix )[ 1 ];
			if ( key && ( !expired || this.get( key ).expire <= now ) ) {
				this.remove( key );
			}
		}

        return this;
    },

	isValidItem: null,

	timeout: 5000,

	addHandler(types, handler) {
		if( !Array.isArray( types ) ) {
			types = [ types ];
		}
		types.forEach( type => {
			handlers[ type ] = handler;
		});
	},

	removeHandler(types) {
		basket.addHandler( types, undefined );
	}
};

export { basket };