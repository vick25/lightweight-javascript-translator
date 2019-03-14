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
  <!-- OR -->
  <!-- <script src="./assets/js/jquery-3.3.1.min.js"></script> -->

  <title data-translation="title"></title>
</head>
<body>
  
  <header>
    <h1 data-translation="header.title"></h1>
  </header>

  <!-- Make sure to implement this file on the very bottom of the body -->
  <script src="https://cdn.moutinho.org/lightweight-jquery-translator/@latest/lwcTranslator.min.js"></script>
  <!-- OR -->
  <!-- <script src="./assets/js/lwcTranslator.min.js"></script> -->
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

## Changelog

### 1.0.0

Initial Release of LwcTranslator

## License

Lightweight JQuery Translator is licensed unter the [MIT License]([https://www.google.com](https://github.com/codingsamuel/lightweight-jquery-translator/blob/master/LICENSE) "MIT LICENSE")
