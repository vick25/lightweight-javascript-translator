/**
 * @author codingsamuel
 * @license MIT
 * @version 2.1.1
 * @copyright codingsamuel 2019
 */
class LwcTranslator {

  /**
   * @param {Object} settings
   * @param {string} settings.querySelector
   * @param {string} settings.translationSettings
   * @param {string} settings.translationFolder
   * @param {string} settings.initialLanguageCode
   * @param {boolean} settings.autoTranslate
   * @param {Function} settings.onTranslationSettingsLoaded
   * @param {Function} settings.onTranslationLoaded
   * @param {Function} settings.onError
   * @param {Object} settings.store
   * @param {boolean} settings.store.useCustom
   * @param {String} settings.store.key
   * @param {String} settings.store.mode
   * @param {Object} settings.store.customCallback
   * @param {Function} settings.store.customCallback.get
   * @param {Function} settings.store.customCallback.set
   */
  constructor(settings) {
    this.settings = {
      querySelector: settings.querySelector || 'html',
      translationSettings: settings.translationSettings || '/assets/config/translations.json',
      translationFolder: settings.translationFolder || '/assets/config/translations/',
      initialLanguageCode: settings.initialLanguageCode || 'en-GB',
      autoTranslate: settings.autoTranslate || false,
      onTranslationSettingsLoaded: settings.onTranslationSettingsLoaded || function () {},
      onTranslationLoaded: settings.onTranslationLoaded || function () {},
      onError: settings.onError || function () {},
      store: { useCustom: Boolean, key: String, mode: String, customCallback: { get: Function, set: Function } }
    }

    if (settings.store)
      this.settings.store = {
        useCustom: settings.store.useCustom || false,
        key: settings.store.key || "currLang",
        mode: settings.store.mode || "localStorage",
        customCallback: settings.store.customCallback ? {
          get: settings.store.customCallback.get || function() {}, set: settings.store.customCallback.set || function() {}
        } : { get: function() {}, set: function() {} }
      };
    else this.settings.store = { useCustom: false, key: "currLang", mode: "localStorage", customCallback: { get: function() {}, set: function() {} } };
    this.init();
  }

  _contains(word) {
    try {
      var elements = document.querySelectorAll('*');
      return Array.prototype.filter.call(elements, function(element){
        return RegExp(word).test(element.textContent);
      });
    } catch(ex) {
      this.settings.onError.call(this._handleError(e));
    }
  }

  _replaceAll(text, search, replacement) {
    try {
      return text.split(search).join(replacement);
    } catch (ex) {
      this.settings.onError.call(this._handleError(ex));
    }
  }

  _prepareRequest(path) {
    try {
      let req = new XMLHttpRequest();
      req.open("GET", path);
      req.send();
      return req;
    } catch (ex) {
      this.settings.onError.call(this, this._handleError(ex));
    }
  }

  _handleError(err) {
    try {

      let error = {
        originalError: Object,
        handleError: String,
        errorCode: Number
      }

      if (typeof err === "string") {
        error.originalError = err;
        error.handleError = err;
        error.errorCode = 400;
      } else if (typeof err === "object") {
        error.originalError = err;
        if (err.message) {
          error.handleError = err.message;
          error.errorCode = 400;
        } else if (err.status && err.response) {
          error.handleError = err.responseText;
          error.errorCode = err.status;  
        } else {
          error.handleError = err;
          error.errorCode = 400;
        }
      }

      return error;
    } catch(e) {
      console.error(e);
    }
  }

  _loadTranslationFile(dir, file) {
    try {
      let lang = this.getCurrentLanguage();
      let availableTranslations = file.translations || [];
      let availableTranslation = availableTranslations.filter(e => e === lang.langCode)[0];
      
      if (!availableTranslation) this.settings.onError.call(this, this._handleError('No translation found for page [' + file.dir + "]!"));
      else {
        let req = this._prepareRequest(this.settings.translationFolder + dir + "/" + file.dir + "/" + lang.langCode + ".json");
        req.onreadystatechange = (e) => {
          if (req.readyState === 4 && req.status === 200) {
            let translatedPage = JSON.parse(req.responseText);
            let content = translatedPage.content;
            this.translate(content);
            this.settings.onTranslationLoaded.call(this, translatedPage);
          } else if (req.readyState === 4) {
            this.settings.onError.call(this, this._handleError(req));
          }
        }
      }
    } catch(ex) {
      this.settings.onError.call(this, this._handleError(ex));
    }
  }

  _loadTranslations(json, page, currPage) {
    try {
      let pagesDir = json.pagesDir || "pages";
      let partialsDir = json.partialsDir || "partials";
      let partials = json.partials || [];
      let pagePartials = page.partials || [];
      
      let checkPartials = function() {
        let prts = [];
        pagePartials.forEach((e, i) => {
          let part = partials.filter(p => p.dir === e)[0];
          if (part) prts.push(part);
        });
        return prts;
      }
      
      let partialsToLoad = checkPartials();
      
      if (partialsToLoad.length != pagePartials.length)
        this.settings.onError.call(this, this._handleError('Not all Partials for the page [' + currPage + '] were found. Please check your settings file!'));
      else {
        for (let i = 0; i < partialsToLoad.length; i++)
          this._loadTranslationFile(partialsDir, partialsToLoad[i]);
      }

      this._loadTranslationFile(pagesDir, page);
    } catch (ex) {
      this.settings.onError.call(this, this._handleError(ex));
    }
  }

  setRegex(regex) {
    this._regex = regex;
  }

  getRegex() {
    return this._regex;
  }

  setSupportedLanguages(supportedLanguages) {
    this._supportedLanguages = supportedLanguages;
  }

  getSupportedLanguages() {
    return this._supportedLanguages;
  }

  setCurrentLanguage(langCode) {
    if (!this.settings.store.useCustom) {
      let def = { name: "English", langShort: "en", langCode: "en-GB" };
      let item = JSON.stringify(this.getSupportedLanguages() ? (this.getSupportedLanguages().filter(e => e.langCode === langCode)[0] || def) : def);

      switch(this.settings.store.mode) {
        case "localStorage":
          window.localStorage.setItem(this.settings.store.key, item);
          break;
        case "cookie":
          document.cookie = this.settings.store.key + "=" + item + ";path=/";
          break;
      }
      
    } else {
      this.settings.store.customCallback.set.call(this, langCode);
    }
  }

  getCurrentLanguage() {
    let item;
    if (!this.settings.store.useCustom) {
      switch (this.settings.store.mode) {
        case "localStorage":
          item = window.localStorage.getItem(this.settings.store.key)
          break;
        case "cookie":
          let cookies = document.cookie.split(";");
          cookies.forEach((cookie, i) => {
            let val = cookie.split("=");
            if (val[0] === this.settings.store.key) item = val[1]
          });
          break;
      }
      return item ? JSON.parse(item) : null;
    } else {
      return this.settings.store.customCallback.get.call(this);
    }
  }

  getCurrentPage() {
    var path = window.location.pathname;
    path = path.replace(/\.[^/.]+$/, "");
    path = path.substring(1, path.length);
    return path;
  }

  setTranslationSettings(settings) {
    this._translationSettings = settings;
  }

  getTranslationsSettings() {
    return this._translationSettings;
  }

  init() {
    try {
      let settings = this.settings;
      this.loadSettings(settings.translationSettings);
    } catch(ex) {
      this.settings.onError.call(this, this._handleError(ex));
    }
  }

  loadSettings(path) {
    try {
      let reqSettings = this._prepareRequest(path);
      reqSettings.onreadystatechange = (e) => {
        if (reqSettings.readyState === 4 && reqSettings.status === 200) {
          let json = JSON.parse(reqSettings.responseText);
          this.setSupportedLanguages(json.supported);
          this.setRegex(json.regex || "\\{\\{(.*?)\\}\\}");
          this.setTranslationSettings(json);
          
          if (!this.getCurrentLanguage())
            this.setCurrentLanguage(this.settings.initialLanguageCode);

          let currPage = this.getCurrentPage();
          
          if (this.settings.autoTranslate){
            console.warn("Auto translate is still in beta, because it still can't recognize the correct path. Please use load the translation manually in the onTranslationSettingsLoad callback.");
            this.load(currPage);
          }

          this.settings.onTranslationSettingsLoaded.call(this, json);
        } else if (reqSettings.readyState === 4) {
          this.settings.onError.call(this, this._handleError(reqSettings));
        }
      }
    } catch(ex) {
      this.settings.onError.call(this, this._handleError(ex));
    }
  }

  load(currPage) {
    try {
      let translationSettings = this.getTranslationsSettings();
      let page = translationSettings.pages.filter(e => e.dir === currPage)[0];
      if (page) this._loadTranslations(translationSettings, page, currPage);
      else this.settings.onError.call(this, this._handleError('Page ['+currPage+'] not found in settings!'));      
    } catch (ex) {
      this.settings.onError.call(this, this._handleError(ex));
    }
  }

  translate(content) {
    try {
      let lang = this.getCurrentLanguage();
      
      if (!content) this.settings.onError.call(this, this._handleError('translation content is not defined. Please check your translation file for [' + lang.langCode + ".json]"));
      else {
        let html = document.querySelector(this.settings.querySelector);
        document.querySelector('html').setAttribute("lang", lang.langShort);

        let regex = new RegExp(this.getRegex(), "g");
        let items = html.innerHTML.match(regex);
        
        if (items) {
          items.forEach((e, i) => {
            let arr = this._contains(e);
            let el = arr[arr.length - 1];
            regex = new RegExp(this.getRegex(), "g");
            let text = regex.exec(e);
            
            if (el && text) {
              let breaks = text[1].split('.');
              let replacement = content;
  
              breaks.forEach(b => {
                if (replacement[b]) replacement = replacement[b];
              });
              
              if (typeof replacement === "string")
                el.innerHTML = this._replaceAll(el.innerHTML, e, replacement);
            } else {
              this.settings.onError.call(this, this._handleError("Could not translate [" + e + "]"));
            }
          });
        }
      }

    } catch(ex) {
      this.settings.onError.call(this, this._handleError(ex));
    }
  }

}