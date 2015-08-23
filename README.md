# The highlight text component for Riot.js

### Installation
	npm ins --save-dev riot-hi-text

### Examples
#### Basic

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

### Dynamic
```html
<hi-text>{text}</hi-text>
```
```js

```

### Options

**`class-name`**

Custom class name, default is `highlight`

```html
<hi-text class-name="my-highlight"></hi-text>
```


**`case-sensitive`** 

Match word with case sensitive. default is `false`

```html
<hi-text case-sensitive="true"></hi-text>
```
equal to
```html
<hi-text case-sensitive></hi-text>
```

```html
<hi-text class-name="my-highlight"></hi-text>
```
### API

#### setHighlight(word)
Set highlight with `word`

#### clean
Clean all highlight.

#### resetHTML
Sometimes we get data with asynchronous.  We should reset manual.

```js

```

### With chain
The API all return tag instance itself, so you can chain the method
```js
tag
	.clean()
	.setHighlight('Hi')
```

