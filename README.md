# Lightweight Javascript Translator

A lightweight Javascript translator with customizable settings and callbacks.

## Version

The latest version is 2.0.1

## Implementation

Make sure to implement the library on  the very bottom of the `</body>`

### Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title></title>
</head>
<body>

  <!-- Make sure to implement this file on the very bottom of the body -->
  <script src="https://cdn.moutinho.org/lightweight-javascript-translator/@latest/lwcTranslator.min.js"></script>
  <!-- OR -->
  <!-- <script src="./assets/js/lwcTranslator.min.js"></script> -->
</body>
</html>
```

## Demo

[See how this library works](https://cdn.moutinho.org/lightweight-javascript-translator/example.html)

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

    // Easy use
    new LwcTranslator({
      translationSettings: 'https://path/to/languages.json',
      translationFolder: 'https://path/to/languages/folder/'
    });

    // Customized use
    /* Default Values: */
    new LwcTranslator({
      translationSettings: '/assets/config/translations.json',  // Path to settings file
      translationFolder: '/assets/config/translations/', // Path to translations folder
      querySelector: 'html', // Selector to replace text inside
      initialLanguageCode: 'en-GB', // Initial Language value if no value is set
      currentLanguageKey: 'currLang',
      onError: function(err) {
        // Log your error
      },
      onTranslationSettingsLoaded: function(settings) {
        // Language Settings were loaded
      },
      onTranslationLoaded: function (content) {
        // A translation file for a page/partial was loaded
      }
    });

  </script>
</body>
</html>
```

### JSON

#### translations.json

> Possible structure of a translation settings file

```json
{
  "regex": "\\{\\{(.*?)\\}\\}", //Matches text inside {{textToTranslate}}
  "pagesDir": "views",  // Directory where the translation of the pages is stored
  "partialsDir": "parts", // Directory where the partials translations are stored
  "pages": [ // pages translations
    {
      "dir": "example", // Directory with the translations inside the views folder in this example
      "partials": ["navbar", "footer"], // Load extra partials
      "translations": [ // Set the available translations
        "en-GB", "pt-PT", "de-DE", "sv-SE"
      ]
    }
  ],
  "partials": [ // partials translations
    {
      "dir": "navbar",
      "translations": [
        "en-GB", "pt-PT", "de-DE", "sv-SE"
      ]
    },
    {
      "dir": "footer",
      "translations": [
        "en-GB", "pt-PT", "de-DE", "sv-SE"
      ]
    }
  ],
  "supported": [  //Supported languages
    {
      "name": "English",  //Name (not required)
      "langShort": "en",  // Language Short (required)
      "langCode": "en-GB" // Language Code (required)
    },
    {
      "name": "Svenska",
      "langShort": "sv",
      "langCode": "sv-SE"
    },
    {
      "name": "Portugues",
      "langShort": "pt",
      "langCode": "pt-PT"
    },
    {
      "name": "Deutsch",
      "langShort": "de",
      "langCode": "de-DE"
    }
  ]
}
```

#### Folder structure

* /config/translations/
  * translations/
    * views/
      * exampleView/
        * en-GB.json
        * de-DE.json
    * partials/
      * examplePartial
        * en-GB.json
        * de-DE.json
  * translations.json

#### en-GB.json

> This file is used to get the translations for the site. You may use nested JSON Objects for specific translations

```json
{
  "version": "1.0.0", // Just for debug to specify the version of the language translation
  "content": { // Your translation starts in the content object
    "title": "Hello World!",
    "header": {
      "slogan": "Lorem Ipsum."
    }
  }
}
```

## Supported Browsers

* Chrome
* Firefox
* Edge
* Internet Explorer

## Changelog

### 2.0.1

* Overall renewed library
* New features:
  * You can add a custom regex to the site def: {{text}}
  * Better Error prevention (custom Callback available)
  * Easier language load
  * More detailed and structured Language settings
  * Removed JQuery support. No extra library needed to use this translator!

### 1.0.3

* Fix translation file loading

### 1.0.2

* Fix paragraph support

### 1.0.1

* Bug Fixes
* Working on Internet Exlorer

### 1.0.0

* Initial Release of LwcTranslator

## License

Lightweight JQuery Translator is licensed unter the [MIT License](https://github.com/codingsamuel/lightweight-jquery-translator/blob/master/LICENSE)
