
/*-----------------------------------------------------------------------------*/
/*                    SIMPLE:  IPS STATISTIC                                   */
/*                    VERSION: 1.0                                             */
/*                    AUTHORS: Copyright (©) 2024 USSR                         */
/*                    TEAM:    CHAIM, ZEEV                                     */
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
if (typeof Z == "undefined" || !Z) { var Z = {}; }

Z.D = {
    isMobile: false
    , deviceDetector: ''
    , Loader: '<div id="d_loader" class="loader"><div class="inner one"></div><div class="inner two"></div><div class="inner three"></div></div>'
    , BODY: document.getElementsByTagName('body')[0]
    , HEADER: ''
    , NAV: ''
    , MAIN: ''
    , UrlParams: new URLSearchParams(window.location.search.toLowerCase())
    , Title: ''
    , TitleLoadInterval: ''
    , Keys: {
        HOME: { 'u':'data/home.txt',d:[] }
    }
};

Z.C = {
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
        Z.C.rem('d_popup_main_loading');
        let _e = document.createElement("DIV");
        _e.id = 'd_popup_main_loading';
        _e.style.zIndex = "400000000000000000";
        Z.C.setElemAfterElem(_e, Z.D.BODY.lastChild, () => {
            if (!isWithoutLoader) {
                _e.innerHTML = Z.D.Loader;
                Z.C.titleLoadingOn();
            }
            else {
                _e.style.backgroundColor = 'unset';
            }
        });
    }
    , offLoading: () => {
        Z.C.rem('d_popup_main_loading');
        Z.C.titleLoadingOff();
    }
    , onLoadingMain: (isWithoutLoader) => {
        Z.C.rem('d_popup_main_loading');
        let _e = document.createElement("DIV");
        _e.id = 'd_popup_main_loading';
        _e.style.backgroundColor = 'unset';
        _e.style.zIndex = "400000000000000000";
        Z.C.setElemAfterElem(_e, Z.D.MAIN.lastChild, () => {
            _e.innerHTML = Z.D.Loader;
        });
    }
    , offLoadingMain: () => {
        Z.C.rem('d_popup_main_loading');
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
        Z.D.Title = document.title;
        Z.D.TitleLoadInterval = setInterval(() => { document.title = Z.D.Title + ' ' + _glyphs[_i++ % _glyphs.length]; }, 240);
    }
    , titleLoadingOff: () => {
        document.title = Z.D.Title;
        clearInterval(Z.D.TitleLoadInterval);
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
};

Z.U = {
    home: (cb) => {
        Z.D.BODY.innerHTML = '<header></header><nav></nav><main></main>';
        Z.D.HEADER = document.getElementsByTagName('header')[0];
        Z.D.NAV = document.getElementsByTagName('nav')[0];
        Z.D.MAIN = document.getElementsByTagName('main')[0];

        let _setHeader = (cb) => {
            let _h = '';
            _h += '<div id="form_caption">';
            _h += '     <div class="first_line">SmarToper</div>';
            _h += '     <div class="second_line">be wise, do smart</div>';
            _h += '</div>';
            _h += '<div id="form_search" class1="form_search">';
            _h += '     <div class="d-form-search-wrap">';
            _h += '         <div id="d_search" class="d-search-wrap he1">';
            _h += '                 <div class="new-form he1" onclick="Z.MET.editForm(null);"><div class="new">חדש</div></div>';
            _h += '                 <div class="search"><input id="txtSearchExistForms" type="text" placeholder="נא להזין שם טופס קיים" autofocus /></div>';
            _h += '                 <div id="btnSearchExistFormsClear" class="btnX btnX_Disabled"></div>';
            _h += '         </div>';
            _h += '     </div>';
            _h += '</div>';

            Z.D.HEADER.innerHTML = _h;
            if (cb != undefined) { cb(); }
        }
        let _getHomeData = (cbSuc, cbErr) => {
            //let _url = document.location.origin + Z.DEC.UrlSys + Z.D.Keys.HOME.u;
            if (Z.D.Keys.HOME.d.length === 0) {
                Z.C.get(Z.D.Keys.HOME.u, (data) => {
                    let _res, _d;
                    if (typeof data === 'string') {
                        if ((data !== undefined) && (data !== null)) {
                            if (data.length > 0) {
                                _d = data.trim();
                                _res = JSON.parse('[' + _d.substring(0, _d.length - 1) + ']');
                                Z.D.Keys.HOME.d = _res;
                                if (cbSuc != undefined) { cbSuc(Z.D.Keys.HOME.d); }
                            }
                        }
                    }
                }, (error) => {
                    if (cbErr != undefined) { cbErr(error); }
                });
            }
            else {
                if (cbSuc != undefined) { cbSuc(Z.D.Keys.HOME.d); }
            }
        }
        _setHeader(() => { });
        Z.C.onLoading();
        //return;
        _getHomeData((data) => {
            debugger
            setTimeout(() => {
                Z.C.offLoading();
                document.getElementById('form_search').className = 'form_search';
                //Z.U.setHeaderForData();
                Z.D.HEADER.className = 'header-data';
                Z.D.MAIN.className = 'main-home';
                Z.U.main(data, () => { });
            }, 2000)
        });
        if (cb != undefined) { cb(); }
    }
    , setHeaderForData: (cb) => {
        let _h = '';
        Z.D.HEADER.className = 'header-logo-out';
        //_h += '<div id="form_caption">';
        //_h += '     <div class="first_line">SmartShopper</div>';
        //_h += '     <div class="second_line">be wise, buy smart</div>';
        //_h += '</div>';
        setTimeout(() => {
            _h += '<div class="form_search">';
            _h += '    <div class="d-form-search-wrap">';
            _h += '    <div id="d_search" class="d-search-wrap he1">';
            _h += '         <div class="new-form he1" onclick="Z.MET.editForm(null);"><div class="new">חדש</div></div>';
            _h += '         <div class="search"><input id="txtSearchExistForms" type="text" placeholder="נא להזין שם טופס קיים" autofocus /></div>';
            _h += '         <div id="btnSearchExistFormsClear" class="btnX btnX_Disabled"></div>';
            _h += '    </div>';
            _h += '</div>';
            _h += '</div>';

            Z.D.HEADER.className = 'header-data';
            Z.D.HEADER.innerHTML = _h;
            if (cb != undefined) { cb(); }
        }, 2000)
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
            Z.C.setElemAfterElem(_e, Z.D.BODY.lastChild, () => {
                let _sviva = document.getElementById('d_sviva');
                _sviva.style.display = 'none';
                _sviva.innerText = _t;
                _sviva.style.display = 'block';
            });
        }
    }
    , main: (data, cb) => {
        debugger
        let _h = ''
            , _str = ''
           , _txtSearch = ''//document.getElementById('txtSearchExistForms')
            ;
        Z.D.MAIN.innerHTML = '<i></i>';

        if ((_txtSearch !== "") && (!data.some(item => { return (item.Name.indexOf(_txtSearch) !== -1); }))) {
            //--FORM NOT EXIST
            _h += '<div class="d-no-forms">לא נמצאו טפסים בשם זה</div>';
        }
        else {
            //--FORM EXIST
            debugger
            _h += '<div class="d-path"></div>';
            data.forEach((elem, i) => {
                debugger
                if (_txtSearch === "") {
                    //_h += '<div class="d_small_box">';
                    //_h += '     <div>' + elem.n + '</div>';
                    //_h += '     <div>' + elem.Name + '</div>';
                    //_h += '</div>';
                    _h += '<div class="card is-loading">';
                    _h += '   <div class="image"></div>';
                    _h += '   <div class="content">';
                    _h += '       <h2></h2>';
                    _h += '       <p></p>';
                    _h += '   </div>';
                    _h += '</div>';
                }
                else {
                    if (elem.Name.indexOf(_txtSearch) !== -1) {
                        _str = Z.C.highlightStr(elem.Name, _txtSearch.value);
                        _h += '<div class="d_small_box" onclick="Z.MET.editForm(' + elem.FormID + ')">';
                        _h += '     <div>' + elem.FormID + '</div>';
                        _h += '     <div>' + _str + '</div>';
                        _h += '</div>';
                    }
                }
            });
            _h += '<div class="d-path"></div>';
        }
        Z.D.MAIN.innerHTML = _h;
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
                        if (typeof window.orientation !== 'undefined') {
                            Z.D.isMobile = true;
                        }
                    })();

                    Z.U.home(() => {
                        //Z.U.env();
                    });
                })();
            }
        };
    })();
    start.onDOMStart();
})();
