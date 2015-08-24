# The highlight text component for Riot.js

## Installation
	npm ins --save-dev riot-hi-text

## Examples
### Basic

Import script, the standalone script files are in the `dist` .
```html
<script src="riot.hi-text.js"></script>
```
Webpack or Browserify:

```js
require('riot-hi-text')
```

Create tags

```html
<hi-text>
	Hello highlight text!!!!
</hi-text>
```

```js
require('riot-hi-text')

var hiTextTags = riot.mount('hi-text')
hiTextTags.forEach(function(tag){
	tag.setHighlight('h')
})
```

yield: 
every `h` will warp with `<span class="highlight">`

```html
<hi-text>
	<span class="highlight">H</span>ello <span class="highlight">h</span>ig<span class="highlight">h</span>lig<span class="highlight">h</span>t text!!!!
</hi-text>
```

## Dynamic
```html
<app>
	<hi-text>{text}</hi-text>
	this.tags['hi-text'].text = 'hello hi text!!'
</app>
```


## Options

`opts['class-name']`

Custom class name, default is `highlight`

```html
<hi-text class-name="my-highlight"></hi-text>
```

`opts['case-sensitive'] `

Match word with case sensitive. default is `false`

```html
<hi-text case-sensitive="true"></hi-text>
```
equal to
```html
<hi-text case-sensitive></hi-text>
```

## API

### setHighlight(word, [case_sensitive = false])
Set highlight with `word`

### clean()
Clean all highlight.

### hasMatched
`true` or `false`, change everytime after invoking  `setHighlight()`


## Asynchronous
```html
<app>
	<h1-text>{text}</h1-text>

	var tag = this

	$.ajax({
		url: '/api/case'
	})
	.done(function(data){
		tag.tags['h1-text'].text =  data
		tag.tags['h1-text'].update()
		tag.tags['h1-text'].setHeightlight('hi')
	})
</app>
```


## With chain
The API all return tag instance itself, so you can chain the method
```js
tag
	.clean()
	.setHighlight('Hi')
```