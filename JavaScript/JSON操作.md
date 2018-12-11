##### JSON排序
```
export const sortJSON = (array, key, flag) => {
	const sortBy = (filed, flag, primer) => {
		flag = (flag) ? -1 : 1;
		return function (a, b) {
			a = a[filed];
			b = b[filed];
			if (typeof (primer) != 'undefined') {
				a = primer(a);
				b = primer(b);
			}
			if (a < b) { return flag * -1; }
			if (a > b) { return flag * 1; }
			return 1;
		}
	};
	return array.sort(sortBy(key, flag, parseInt));
};
```

```
const data =  [
	{b: '3', c: 'c'}, 
	{b: '1', c: 'a'},
	{b: '2', c: 'b'}
];

console.log(sortJSON(data, 'b', false));
```