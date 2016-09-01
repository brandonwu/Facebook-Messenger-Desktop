# Messenger for Desktop – Landing Page

Made w/ Gulp, Jade, SASS & CoffeeScript.

Build with `gulp live build`.

## Usage

1. Create this folder structure:

  ```
  mfd
  \- website
  \- gh-pages
  ```

2. Now, when you make changes inside `website`:

  ```
  ./commit.sh "Commit message"
  ```
  
  Here's what that does:

  ```
  #!/bin/bash
  git add .
  git commit -m "$1"
  gulp live build
  (cd ../gh-pages && git add . && git commit -m "$1" && git push)
  ```
  
  Basically, it builds the website and pushes it to the gh-pages branch.
