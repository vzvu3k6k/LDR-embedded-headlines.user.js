// ==UserScript==
// @name           LDR Embedded Headlines
// @description    Embeds headline page into right pane of my feed page as iframe.
// @version        1.0
// @author         vzvu3k6k
// @match          http://reader.livedoor.com/reader/
// @namespace      http://vzvu3k6k.tk/
// @license        public domain
// ==/UserScript==

(function(){
    GM_addStyle("#embedded_headline{width: 100%; height: 100%; border: none;}");
    GM_addStyle("#right_header{height: 100%;}");

    // executed in page context
    location.href = "javascript:void (" + function(){
        const FOLDER_NAME = "ニュース";
        const OVERRIDE_HEADLINE_LINK = true; /* 左上の「ヘッドラインモード」のリンクを乗っ取るかどうか */

        Control.embedded_headline = function(){
            var r_container = document.querySelector("#right_container");
            r_container.innerHTML = '';

            var headline_frame = document.createElement("iframe");
            headline_frame.setAttribute("src", "http://reader.livedoor.com/headline/");
            headline_frame.setAttribute("id", "embedded_headline");
            headline_frame.addEventListener("load", function(){
                var w = headline_frame.contentWindow;

                /* hide header, tabs */
                var style = document.createElement("style");
                style.textContent = "#commonHeader, #contentsControlBox, .tabContainer{display: none;}";
                w.document.head.appendChild(style);

                /* select folder */
                var headlines = w.headline.headlines;
                for(var i in headlines){
                    var h = headlines[i];
                    if(h.params.folder_name == Control.embedded_headline.folder_name){
                        w.headline.select_tab("headline_tab_" + h.params.folder_id);
                        return;
                    }
                }
                message("指定されたフォルダが見つからなかった。");
            });
            r_container.appendChild(headline_frame);
        };
        Control.embedded_headline.folder_name = FOLDER_NAME;

        register_command("headline", Control.embedded_headline);

        if(OVERRIDE_HEADLINE_LINK){
          document.querySelector('a[href="/headline/"]').addEventListener("click", function(event){
              event.preventDefault();
              Control.embedded_headline();
          });
        }
    } + ')()';
})()