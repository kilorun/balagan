
/*-----------------------------------------------------------------------------*/
/*                    SIMPLE:  IPS TOPARIO                                     */
/*                    VERSION: 1.0                                             */
/*                    AUTHORS: Copyright (©) 2025 USSR                         */
/*                    TEAM:    ZEEV                                            */
/*                    Z.D:     Z.DEC                                           */
/*                    Z.C:     Z.COM                                           */
/*                    Z.U:     Z.UTILS                                         */
/*-----------------------------------------------------------------------------*/
/*  Shop: 0 { Travel: 1 | Music: 2 | Movies: 3 | Massage: 4 }                  */
/*  Travel: 1 { Music: 2 | Movies: 3 | Massage: 4 }                            */
/*  Music: 2 { Bands: 0 | Singers: 1 }                                         */
/*  Movies: 3 { Massage: 4 }                                                   */
/*  Massage: 4 {}                                                              */
/*-----------------------------------------------------------------------------*/

'use strict';
if (typeof z == "undefined" || !z) { var z = {}; }

z.D = {
    Loader: '<div id="d_loader" class="loader"><div class="inner one"></div><div class="inner two"></div><div class="inner three"></div></div>'
    , BODY: document.getElementsByTagName('body')[0]
    , Title: ''
    , TitleLoadInterval: ''
    , Keys: {
        HOME: { 'u':'data/home.txt',d:[] }
    }
};

z.C = {
    rem: (idnt) => {
        let _elem = document.getElementById(idnt);
        if (_elem !== null) {
            let _e = document.getElementById(idnt);
            _e.parentElement.removeChild(_e);
        }
    }
    , isEmptyObject: (val) => {
        let _isEmpty = (obj) => {
            for (const prop in obj) {
                if (Object.hasOwn(obj, prop)) {
                    return false;
                }
            }
            return true;
        }
        if (val == null) {
            // null or undefined
            return false;
        }
        if (typeof val !== 'object') {
            // boolean, number, string, function, etc.
            return false;
        }

        const proto = Object.getPrototypeOf(val);

        // consider `Object.create(null)`, commonly used as a safe map
        // before `Map` support, an empty object as well as `{}`
        if (proto !== null && proto !== Object.prototype) {
            return false;
        }
        return _isEmpty(val);
    }
    , setElemAfterElem: (newElem, targetElem, cb) => {
        let _parent = targetElem.parentNode;
        if (_parent.lastchild == targetElem) {
            _parent.appendChild(newElem);
        } else {
            _parent.insertBefore(newElem, targetElem.nextSibling);
        }
        if (cb != undefined) { cb(); };
    }
    , onLoading: (isWithoutLoader) => {
        z.C.rem('d_popup_main_loading');
        let _e = document.createElement("DIV");
        _e.id = 'd_popup_main_loading';
        _e.style.zIndex = "400000000000000000";
        z.C.setElemAfterElem(_e, z.D.BODY.lastChild, () => {
            if (!isWithoutLoader) {
                _e.innerHTML = z.D.Loader;
                z.C.titleLoadingOn();
            }
            else {
                _e.style.backgroundColor = 'unset';
            }
        });
    }
    , offLoading: () => {
        z.C.rem('d_popup_main_loading');
        z.C.titleLoadingOff();
    }
    , onLoadingMain: (isWithoutLoader) => {
        z.C.rem('d_popup_main_loading');
        let _e = document.createElement("DIV");
        _e.id = 'd_popup_main_loading';
        _e.style.backgroundColor = 'unset';
        _e.style.zIndex = "400000000000000000";
        z.C.setElemAfterElem(_e, z.D.MAIN.lastChild, () => {
            _e.innerHTML = z.D.Loader;
        });
    }
    , offLoadingMain: () => {
        z.C.rem('d_popup_main_loading');
    }
    , lockScroll: () => {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = 'var(--scrollbar-compensation)';
        document.body.dataset.scrollLock = 'true';
    }
    , unlockScroll: () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        delete document.body.dataset.scrollLock;
    }
    , titleLoadingOn: () => {
        let _glyphs = ['☱', '☲', '☴'], _i = 0;
        z.D.Title = document.title;
        z.D.TitleLoadInterval = setInterval(() => { document.title = z.D.Title + ' ' + _glyphs[_i++ % _glyphs.length]; }, 240);
    }
    , titleLoadingOff: () => {
        document.title = z.D.Title;
        clearInterval(z.D.TitleLoadInterval);
    }
    , highlightStr: (str, sub) => {
        if ((str === null) || (str === undefined) || (str === "")) { return ''; }
        let _res = str;
        let _index = str.toLocaleLowerCase().indexOf(sub.toLocaleLowerCase());
        if (_index >= 0) {
            _res = '<span>' + str.substring(0, _index).replaceAll(' ', '&nbsp;') + '</span>' + '<span class="highlight">' + str.substring(_index, _index + sub.length).replaceAll(' ', '&nbsp;') + '</span>' + '<span>' + str.substring(_index + sub.length).replaceAll(' ', '&nbsp;') + '</span>';
        }
        return _res;
    }
    , get: (url, cbSuc, cbErr) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                if (cbSuc != undefined) { cbSuc(data); }
            }).catch((error) => {
                if (cbErr != undefined) { cbErr(error); }
            });
    }
    , env: () => {
        let _t = '';
        if (window.location.href.toLowerCase().indexOf('//localhost') != -1) {
            _t = 'LOC';
        }
        else if (window.location.href.toLowerCase().split('-')[0].indexOf('dev') != -1) {
            _t = 'DEV';
        }
        else if (window.location.href.toLowerCase().split('-')[0].indexOf('test') != -1) {
            _t = 'TEST';
        }
        else if (window.location.href.toLowerCase().split('-')[0].indexOf('lrn') != -1) {
            _t = 'LRN';
        }

        if (_t !== '') {
            let _e = document.createElement("DIV");
            _e.id = 'd_sviva';
            z.C.setElemAfterElem(_e, z.D.BODY.lastChild, () => {
                let _sviva = document.getElementById('d_sviva');
                _sviva.style.display = 'none';
                _sviva.innerText = _t;
                _sviva.style.display = 'block';
            });
        }
    }
    , waitForImageToLoad: (imageElement) =>{
        return new Promise(resolve=>{imageElement.onload = resolve})
    }
};

z.U = {
    home: (cb) => {
        let _home = (cb) => {
            let _h = '';
            z.D.BODY.innerHTML = '<div id="d_menu"></div>';
            if (cb != undefined) { cb(); }
        }

        let _getHomeData = (cbSuc, cbErr) => {
            //let _url = document.location.origin + Z.DEC.UrlSys + Z.D.Keys.HOME.u;
            if (z.D.Keys.HOME.d.length === 0) {
                z.C.get(z.D.Keys.HOME.u, (data) => {
                    let _res, _d;
                    if (typeof data === 'string') {
                        if ((data !== undefined) && (data !== null)) {
                            if (data.length > 0) {
                                _d = data.trim();
                                _res = JSON.parse('[' + _d.substring(0, _d.length - 1) + ']');
                                z.D.Keys.HOME.d = _res;
                                if (cbSuc != undefined) { cbSuc(z.D.Keys.HOME.d); }
                            }
                        }
                    }
                }, (error) => {
                    if (cbErr != undefined) { cbErr(error); }
                });
            }
            else {
                if (cbSuc != undefined) { cbSuc(z.D.Keys.HOME.d); }
            }
        }
        _home(() => { 
            z.C.onLoading();
            //debugger
            _getHomeData((data) => {
                //debugger
                z.C.offLoading();
                z.U.main(data, () => { });
            });
            
            if (cb != undefined) { cb(); }
        });
    }
    , main: (data, cb) => {
        //debugger
        let _h = ''
            , _str = ''
            , _txtSearch = ''//document.getElementById('txtSearchExistForms')
            , _e
            , _i
            , _tmp = ''
            ;

            let _domCard = (e, cb) => {
                let _h = '';
                _h += '<div id="d_image__' + e.a + '__' + e.b + '" class="image"></div>';
                _h += '<div class="content">';
                _h += '     <h2>' + e.b + '</h2>';
                _h += '</div>';
                if (cb != undefined) { cb(_h); }
            }
    
            _tmp += '   <div class="image"></div>';
            _tmp += '   <div class="content">';
            _tmp += '       <h2></h2>';
            _tmp += '       <p></p>';
            _tmp += '   </div>';

        if ((_txtSearch !== "") && (!data.some(item => { return (item.Name.indexOf(_txtSearch) !== -1); }))) {
            //--FORM NOT EXIST
            z.D.BODY.style.alignItems = 'center';
            _h += '<div class="d-no-res"></div>';
        }
        
        else {
            //--FORM EXIST
            z.D.BODY.innerHTML = '<div class="d-path"></div>';
            //_h += '<div class="d-path"></div>';
            data.forEach((elem, i) => {
                if (_txtSearch === "") {
/*
                    _h += '<div class="card is-loading">';
                    _h += '   <div class="image"></div>';
                    _h += '   <div class="content">';
                    _h += '       <h2></h2>';
                    _h += '       <p></p>';
                    _h += '   </div>';
                    _h += '</div>';
                    */

                    _e = document.createElement("DIV");
                    _e.id = 'd_card__' + elem.a + '__' + elem.b;
                    
                    _i = new Image();
                    _i.setAttribute('a', elem.a);
                    _i.setAttribute('b', elem.b);
                    _i.src = elem.p[0].s;
                    
                    z.C.waitForImageToLoad(_i).then(()=>{
                        // Image have loaded.
                        debugger
                        let _a = _i.getAttribute('a');
                        let _b = _i.getAttribute('b');
                        //let __e = document.getElementById(__id);
                        document.getElementById('d_card__' + _a + '__' + _b).className = 'card end-loading';
                        document.getElementById('d_image__' + _a + '__' + _b).style.backgroundImage = 'url(' + _i.src + ')';
                    });
                    _e.className = 'card is-loading';
                    _domCard(elem, (dom)=>{
                        _e.innerHTML = dom;
                    });
                    z.C.setElemAfterElem(_e, z.D.BODY.lastChild, () => {
                    });
                }
                else {
                    if (elem.Name.indexOf(_txtSearch) !== -1) {
                        _str = z.C.highlightStr(elem.Name, _txtSearch.value);
                        _h += '<div class="d_small_box" onclick="Z.MET.editForm(' + elem.FormID + ')">';
                        _h += '     <div>' + elem.FormID + '</div>';
                        _h += '     <div>' + _str + '</div>';
                        _h += '</div>';
                    }
                }
            });
            //_h += '<div class="d-path"></div>';
            _e = document.createElement("DIV");
            _e.className = 'd-path';
            z.C.setElemAfterElem(_e, z.D.BODY.lastChild, () => { });

        }
        
        //Z.D.BODY.innerHTML = _h;
        if (cb != undefined) { cb(); }
    }
};

(() => {
    let start = (() => { 
        return {
            onDOMStart: () => {
                (() => {
                    (() => {
                        const _scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
                        document.body.style.setProperty('--scrollbar-compensation', `${_scrollBarCompensation}px`);
                    })();

                    z.U.home(() => {
                        //Z.C.env();
                    });
                })();
            }
        };
    })();
    start.onDOMStart();
})();
