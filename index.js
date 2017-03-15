'use strict';

const parser = require('fast-html-parser'),
	  fs 	 = require('fs'),
	  wilddog= require('wilddog');

const html = fs.readFileSync('bookmarks.html', 'utf-8');

// console.log(html);
const root = parser.parse(html);

let links = root.querySelectorAll('A');
let regx = /^href="([\S]+)"$/gi;

let bookmarks = [];
for(let l of links){
	let attrs = l.rawAttrs.split(' ');
	let title = l.childNodes.shift().rawText;
	for(let a of attrs){
		let res = regx.exec(a);
		if(res){
			let url = res.pop();
			if(url.toLowerCase().indexOf('http') === 0){
				// console.log(res);
				bookmarks.push({
					title: title,
					url: url,
					date: Date.now(),
					tagId: ""
				});
			}
		}
	}
}

const config = {
	syncURL: "https://xkfront-5220.wilddogio.com"
};
wilddog.initializeApp(config);
let ref = wilddog.sync().ref();

for(let b of bookmarks){
	ref.child('bookmarks').push(b, err=>console.log(err));
}