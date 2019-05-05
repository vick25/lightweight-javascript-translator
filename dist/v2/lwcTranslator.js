/**
 * @author codingsamuel
 * @license MIT
 * @version 2.0.1
 * @copyright codingsamuel 2019
 */
class LwcTranslator {

  /**
   * @param {Object} settings
   * @param {string} settings.querySelector
   * @param {string} settings.translationSettings
   * @param {string} settings.translationFolder
   * @param {string} settings.currentLanguageKey
   * @param {string} settings.initialLanguageCode
   * @param {Function} settings.onTranslationSettingsLoaded
   * @param {Function} settings.onTranslationLoaded
   * @param {Function} settings.onError
   */
  constructor(settings) {
    this.settings = {
      querySelector: settings.querySelector || 'html',
      translationSettings: settings.translationSettings || '/assets/config/translations.json',
      translationFolder: settings.translationFolder || '/assets/config/translations/',
      currentLanguageKey: settings.currentLanguageKey || 'currLang',
      initialLanguageCode: settings.initialLanguageCode || 'en-GB',
      onTranslationSettingsLoaded: settings.onTranslationSettingsLoaded || function () {},
      onTranslationLoaded: settings.onTranslationLoaded || function () {},
      onError: settings.onError || function () {}
    }
    this.init();
  }

  _contains(word) {
    try {
      let elements = document.querySelectorAll("*");
      return [].filter.call(elements, (element) => {
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
      this.settings.onError.call(this, ex);
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
  
      if (!availableTranslation) this.settings.onError.call(this, this._handleError('No translation found for page [' + page.dir + "]!"));
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
    let def = { "name": "English", "langShort": "en", "langCode": "en-GB" };
    window.localStorage.setItem(this.settings.currentLanguageKey, JSON.stringify(
      this.getSupportedLanguages() ? (this.getSupportedLanguages().filter(e => e.langCode === langCode)[0] || def) : def
    ));
  }

  getCurrentLanguage() {
    let item = window.localStorage.getItem(this.settings.currentLanguageKey);
    return item ? JSON.parse(item) : undefined;
  }

  getCurrentPage() {
    let path = location.pathname;
    path = path.substring(1, path.lastIndexOf('.'));
    return path;
  }

  init() {
    try {
      let settings = this.settings;
      this.load(settings.translationSettings);
    } catch(ex) {
      this.settings.onError.call(this, ex);
    }
  }

  load(path) {
    try {
      let reqSettings = this._prepareRequest(path);
      reqSettings.onreadystatechange = (e) => {
        if (reqSettings.readyState === 4 && reqSettings.status === 200) {
          let json = JSON.parse(reqSettings.responseText);
          this.setSupportedLanguages(json.supported);
          this.setRegex(json.regex || "\\{\\{(.*?)\\}\\}");
          
          if (!this.getCurrentLanguage())
            this.setCurrentLanguage(this.settings.initialLanguageCode);

          let currPage = this.getCurrentPage();
          let pagesDir = json.pagesDir || "pages";
          let partialsDir = json.partialsDir || "partials";
          let pages = json.pages || [];
          let page = pages.filter(e => e.dir === currPage)[0];
          
          if (page) {
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
              for (let i = 0; i < partialsToLoad.length; i++) {
                this._loadTranslationFile(partialsDir, partialsToLoad[i]);
              }
            }

            this._loadTranslationFile(pagesDir, page);

          } else {
            this.settings.onError.call(this, this._handleError('Page ['+currPage+'] not found in settings!'));
          }

          this.settings.onTranslationSettingsLoaded.call(this, json);
        } else if (reqSettings.readyState === 4) {
          this.settings.onError.call(this, this._handleError(reqSettings));
        }
      }
    } catch(ex) {
      this.settings.onError.call(this, ex);
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

        items.forEach((e, i) => {
          regex = new RegExp(this.getRegex(), "g");
          let text = regex.exec(e);
          if (text) {
            let breaks = text[1].split('.');
            let replacement = content;

            breaks.forEach((b) => {
              replacement = replacement[b];
            });

            html.innerHTML = this._replaceAll(html.innerHTML, e, replacement); 
          }
        });
      }

    } catch(ex) {
      this.settings.onError.call(this, ex);
    }
  }

}