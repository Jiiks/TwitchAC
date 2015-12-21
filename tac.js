// ==UserScript==
// @name        Twitch Emote Autocapitalize by Jiiks | jiiks.net
// @namespace   nope
// @description Adds a toggleable button to twitch chat, when enabled lowercase emotes are automatically capitalized, get's emote data from twitchemotes.com api
// @include     http://www.twitch.tv/*
// @version     0.2
// @grant       none
// ==/UserScript==

// Load custom/subscriber emotes on line 56

var author = "jiiks";
var version = 0.2;
var chatBox = ".chat-interface .textarea-contain .ember-view .ember-text-area";
var emotes = {};
var enabled = false;
var button;

$(document).ready(function() {
    button = $('<button/>', {
        text: "TAC",
        id: "btnTac",
        class: "button glyph-only float-left",
        title: "Twitch AutoCapitalize",
        style: "display:block; width:38px; height:32px; margin-left:10px; background-color:rgba(69, 0, 0, 0.3)",
        click: function(){
        
           enabled = !enabled;
        
           if(enabled){
               $('#btnTac').css("background-color", "rgba(0, 69, 8, 0.3)");
           }else{
               $('#btnTac').css("background-color", "rgba(69, 0, 0, 0.3)");
           }
        
           $(chatBox).on("change paste keyup", function(){ 
              if(enabled == false)
                  return;
              if(Object.keys(emotes).length > 0){
                 var text = $(this).val();
                 var newText = autoCapitalize(text);
                 $(this).val(newText);
              }else{
                 console.log("Twitch Emote AC v" + version + " loading global emotes src: http://twitchemotes.com/api_cache/v2/global.json");
                 $.getJSON("http://twitchemotes.com/api_cache/v2/global.json", function(data){
                    var count = 0;
                    for(var key in data["emotes"]){
                        var k = key.toLowerCase();
                        var v = key;
                        emotes[k] = v;
                        count++;
                    }
                     
                     //Load sub/custom emotes here
                     //example: emotes['kappa'] = 'Kappa';
            
                    console.log("Twitch Emote AC v" + version + " loaded " + count + " emotes");
                    
                 });
              }
           });
        
        }
    });
    append();
});

function append() {
    setTimeout(function() {
        $('.chat-interface .chat-buttons-container').append(button);
        if(!$("#btnTac").length) {
            append();
        }
    }, 100);
}

function autoCapitalize(value){

    var newText = value;
    for(var key in emotes){
        if(!emotes.hasOwnProperty(key)){
            continue;
        }
        newText = newText.replace(new RegExp(key, "g"), emotes[key]);
    }
    
    return newText;
}

