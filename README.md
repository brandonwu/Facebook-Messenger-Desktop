# Messenger for Desktop
**If you like this fork, please consider giving me a star!**

Bring [messenger.com](https://messenger.com) to your OS X, Windows or Linux desktop. Built with [NW.js](http://nwjs.io/). Not affiliated with Facebook.

![Cross-platform screenshot](screenshot.png)

## Official Features Supported

* Sounds *(can be disabled in settings)*
* Desktop notifications *(enable them in settings)*
* Voice and video calls

## Extras

* System tray icon
* Special badge icon when new unread messages
* Auto-launch on OS startup
* Chrome notifications
* Three themes to choose from: Dark, Mosaic, and Midnight
* Proxy support
* Open links in browser or new window
* Preferences when the right-clicking the tray icon (Linux/Windows)
* Don't send read receipts/typing notifications
* Keyboard shortcuts for nearly everything - press `Ctrl+/` to see the list once you've downloaded it
* Cool frameless look with window controls integrated
* (in progress) Inline image expansion - hover or click on image links to open them quickly in Messenger

## Build

### Pre-requisites

    # install gulp
    npm install -g gulp

    # install dependencies
    npm install

* **wine**: If you're on OS X/Linux and want to build for Windows, you need [Wine](http://winehq.org/) installed. Wine is required in order
to set the correct icon for the exe. If you don't have Wine, you can comment out the `winIco` field in `gulpfile`.
* **makensis**: Required by the `pack:win32` task in `gulpfile` to create the Windows installer.
* [**fpm**](https://github.com/jordansissel/fpm): Required by the `pack:linux{32|64}:{deb|rpm}` tasks in `gulpfile` to create the linux installers.

Quick install on OS X:

    brew install wine makensis
    sudo gem install fpm

### OS X: pack the app in a .dmg

    gulp pack:osx64

### Windows: create the installer

    gulp pack:win32

### Linux 32/64-bit: pack the app in a .deb or .rpm

    gulp pack:linux{32|64}:{deb|rpm}

The output is in `./dist`. Take a look in `gulpfile.coffee` for additional tasks.

**TIP**: use `gulp build:win32 --noicon` to quickly build the Windows app without the icon.

**TIP**: for OS X, use the `run:osx64` task to build the app and run it immediately.

**TIP**: to be able to play MP3 and H264, you need to replace the ffmpeg lib in NWJS with the one provided in this repository: https://github.com/iteufel/nwjs-ffmpeg-prebuilt/. The best way is to copy-paste it in the corresponding NWJS package (located in the cache) before building the software.

## Debugging

With the move to nw.js 0.14.x, Messenger for Desktop now runs as a Chrome Extension. Node and WebKit run in two different contexts. When debugging
with DevTools, files that are `required()`'d will not be visible when running normally.

Start Messenger for Desktop with `--remote-debugging-port=9999`. Then navigate to `http://localhost:9999/`. This will allow debugging of other contexts.
Node runs on the background page, WebKit runs in the App page. You will need to set breakpoints in both if you wish to debug across them.

## Contributions

All contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/brandonwu/Facebook-Messenger-Desktop/issues).

## License

The MIT License (MIT)

Copyright (c) 2016 Alexandru Rosianu (Original developer) & Emile Fugulin (Maintainer)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
