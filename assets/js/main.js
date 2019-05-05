/// <reference path="../../dist/v2/lwcTranslator.js" />


var translator = new LwcTranslator({
  querySelector: "html",
  translationSettings: "/assets/config/languages.json",
  translationFolder: "/assets/config/languages/",
  initialLanguageCode: 'en-GB',
  onError: (err) => {
    console.log(err);
  }
});