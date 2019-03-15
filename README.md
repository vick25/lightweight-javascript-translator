# Lightweight JQuery Translator

A lightweight jquery translator with customizable settings and callbacks.

## Version

The latest version is 1.0.0

## Implementation

Make sure to implement JQuery first before the Lightweight JQuery Translator library.

### Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <!-- OR -->
  <!-- <script src="./assets/js/jquery-3.3.1.min.js"></script> -->

  <title></title>
</head>
<body>

  <!-- Make sure to implement this file on the very bottom of the body -->
  <script src="https://cdn.moutinho.org/lightweight-jquery-translator/@latest/lwcTranslator.min.js"></script>
  <!-- OR -->
  <!-- <script src="./assets/js/lwcTranslator.min.js"></script> -->
</body>
</html>
```

## Demo

[Demo](https://cdn.moutinho.org/lightweight-jquery-translator/example.html)

## Usage

The usage is very easy. You only need 2 Parameters to fill in order to work properly.

### HTML

```html
<!DOCTYPE html>
<html data-translation="lang" data-translation-attr="lang">
<head>
  <!-- Meta -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

  <title data-translation="title"></title>
</head>
<body>
  
  <header>
    <h1 data-translation="header.title"></h1>
  </header>

  <!-- Make sure to implement this file on the very bottom of the body -->
  <script src="https://cdn.moutinho.org/lightweight-jquery-translator/@latest/lwcTranslator.min.js"></script>
  <script>

    // Normal use
    $('html').lwcTranslator({
      languageSettingsFile: 'https://path/to/languages.json',
      languageFolderPath: 'https://path/to/languages/folder/'
    });

    // Customized use
    /* Default Values: */
    $('html').lwcTranslator({
      languageSettingsFile: 'https://path/to/languages.json', /* (REQUIRED) settings file path */
      languageFolderPath: 'https://path/to/languages/folder/', /* (REQUIRED) languages folder path */
      async: true, /* Load files asynchronous */
      attributes: {
        textTranslation: 'data-translation', /*text translation attribute*/
        attrTranslation: 'data-translation-attr' /*attribute translation attribute*/
      },
      defaultLanguage: 'en-UK', /*load default language (useable with saved language in local storage or else)*/
      paragraphSupport: true, /*Break \n line breaks inside <p></p> tags*/
      onLanguageSettingsLoaded: function(settings) { /*after load of languages settings file*/
        console.log('settings', settings);
      },
      onLanguageLoaded: function(language) { /* after load of every language*/
        console.log('language', language);
      },
      onLanguagesLoaded: function(languages) { /* after load of all languages*/
        console.log('languages', languages);
      }
    });

  </script>
</body>
</html>
```

### JSON

#### languages.json

> LwcTranslator will only use the filename. You can can edit the rest as you want to.

```json
[
  {
    "name": "English",
    "filename": "en-UK",
    "icon": "gb.svg"
  }
]
```

#### en-UK.json

> This file is used to get the translations for the site. You may use nested JSON Objects for specific translations

```json
{
  "lang": "en",
  "title": "My wonderful title",
  "header": {
    "title": "Hello World!"
  }
}
```

## Supported Browsers

* Chrome
* Firefox
* Edge
* Internet Explorer

## Changelog

### 1.0.0

Initial Release of LwcTranslator

## License

Lightweight JQuery Translator is licensed unter the [MIT License](https://github.com/codingsamuel/lightweight-jquery-translator/blob/master/LICENSE) "MIT LICENSE")
