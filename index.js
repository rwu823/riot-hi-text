'use strict'

var escapeRegExp = require('lodash/string/escapeRegExp')

var regexpEscapes = {
    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
};

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
}

var re = ''

for(var k in stringEscapes){
    re += '\\\\' + stringEscapes[k] + '|'
}
for(var k in regexpEscapes){
    re += '\\\\' + regexpEscapes[k] + '|'
}

var tagSrc = '(<\/?[^>]+>)?'

riot.tag('hi-text', '<yield />', function (opts){
    var tag = this
    var el = this.root
    var caseSensitive = /^(true|)$/.test(opts['case-sensitive'])

    tag.resetHTML = function (){
        this._html = this.root.innerHTML

        return this
    }

    tag.setHighlight = function (word, caseSens){
        if(!tag._html) tag.resetHTML()

        if(typeof caseSens === 'undefined'){
            caseSens = caseSensitive
        }

        word = word.trim()
        tag.hasMatched = false

        var className = tag.opts['class-name'] || 'highlight'

        if(word.length > 1){
            word = escapeRegExp(word)

            word = word.match( new RegExp(`${re}\\.|.`, 'g'))

            if(!word || !tag._html) return

            // skip `<tag></tag>`
            word = tagSrc + word.join(tagSrc) + tagSrc

            var qREi = new RegExp(`(${word})`, caseSens ? '' : 'i')
            var qREig = new RegExp(qREi.source, caseSens ? 'g' : 'ig' )

            if(qREi.test(tag._html) ){
                tag.hasMatched = true
                tag.root.innerHTML = tag.root.innerHTML.replace(qREig, `<span class="${className}">$1</span>`)
            }
        }else{
            let highlight = function (rootNode){

                let wrap = function (node){
                    if(node.nodeType === 3){
                        let pos = caseSens
                            ? node.data.indexOf(word)
                            : node.data.toLowerCase().indexOf(word.toLowerCase())

                        if(pos < 0 ) return

                        let nt

                        if(pos === 0){
                            nt = node.splitText(word.length)
                        }else if(pos > 0){
                            nt = node.splitText(pos).splitText(word.length)
                        }

                        let target = nt.previousSibling

                        let span = document.createElement('span')
                        span.className = className
                        span.textContent = target.data

                        nt.parentNode.replaceChild(span, target)
                        tag.hasMatched = true
                        wrap(nt)
                    }else if(node.nodeType === 1 &&
                        node.childNodes &&
                        !(node.tagName === 'SPAN' && node.classList.contains(className)) &&
                        !/^(style|script)$/i.test(node.tagName)
                    ){
                        highlight(node)
                    }
                }

                for(let i = 0; i < rootNode.childNodes.length; ++i){
                    wrap(rootNode.childNodes[i])
                }

                return
            }

            highlight(el)
        }

        return this
    }

    tag.clean = function (){
        this.root.innerHTML = this._html
        return this
    }

    tag
        .on('mount', function (){
            tag.resetHTML()
            tag.trigger('mounted')
        })
})