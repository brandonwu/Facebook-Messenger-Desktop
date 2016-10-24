/*
 * Slightly modified from Allen Guo's messenger-shortcuts; GPLv2 licensed
 * Source: https://github.com/guoguo12/messenger-shortcuts
 */

HELP_HTML = "\
<b>Ctrl+N</b> &ndash; Compose [n]ew message<br>\
<b>Ctrl+L</b> &ndash; Search conversation [l]ist<br>\
<b>Ctrl+I</b> &ndash; Toggle conversation [i]nfo<br>\
<b>Ctrl+F</b> &ndash; [F]ind in conversation history<br>\
<b>Ctrl+G</b> &ndash; [G]o up in history search results<br>\
<b>Ctrl+Shift+G</b> &ndash; [G]o down in history search results<br>\
<b>Ctrl+D</b> &ndash; Open the context menu for the current conversation<br>\
<b>Ctrl+P</b> &ndash; Open the Messenger settings menu<br>\
<b>Ctrl+G, E, S</b> &ndash; Send a GIF, emoji, or sticker<br>\
<b>Ctrl+Enter</b> &ndash; Send a like<br>\
<b>Ctrl+M</b> &ndash; [M]ute conversation<br><br>\
<b>Ctrl+Space</b> &ndash; Jump to the first conversation with unread messages<br>\
<b>Ctrl+<i>n</i></b> &ndash; Jump to conversation <i>n</i>-th from top<br>\
<b>Ctrl+Tab</b>/<b>Ctrl+Shift+Tab</b> &ndash; Jump to conversation one above/below<br>\
<b>Ctrl+/</b> &ndash; Display this help dialog<br>\
"

/** Helper functions **/

function getByAttr(doc, tag, attr, value) {
  return doc.querySelector(tag + '[' + attr + '="' + value + '"]');
}

/** Functionality **/

function contextForMessage(doc, index) {
  doc.querySelectorAll('div[aria-label="Conversations"]')[index].click();
}

function jumpToMessage(doc, index) {
  doc.querySelectorAll('div[aria-label="Conversations"] a')[index].click();
}

function verticalJump(doc, isUp) {
  jumpToMessage(doc, getCurrentConversationIndex(doc) + (isUp ? -1 : 1));
}

function selectFirstSearchResult(doc) {
  var first = doc.querySelector('span[role="search"] a');
  if (first) {
    first.click();
    // focus message input afterwards in case the user already has that chat open
    focusMessageInput(doc);
  }
}

function compose(doc) {
  getByAttr(doc, 'a', 'title', 'New Message').click();
}

function toggleInfo(doc) {
  getByAttr(doc, 'a', 'title', 'Conversation Information').click();
}

function mute(doc) {
  getByAttr(doc, 'input', 'type', 'checkbox').click();
}

function getSearchBar(doc) {
  return getByAttr(doc, 'input', 'placeholder', 'Search for people and groups');
}

function focusSearchBar(doc) {
  getSearchBar(doc).focus();
}

function focusMessageInput(doc) {
  //if (doc.activeElement.placeholder == "Search messages") {
  if (doc.getElementsByClassName('_33p7').length != 0) {//If search is open, close it.
    clickConvSearch(doc);
  }
  doc.querySelector('div[role="main"] div[role="textbox"]').click();
}

function getCurrentConversationIndex(doc) {
  var conversations = doc.querySelectorAll('[aria-label="Conversation List"] li');

  for (var i = 0; i < conversations.length; i++) {
    if (conversations[i].getAttribute('aria-relevant') && !conversations[i].getAttribute('aria-live')) {
      return i;
    }
  }
}

function jumpToNewestWithUnread(doc) {
  var i = getNewestConversationWithUnread(doc);
  if (i != null) {
    jumpToMessage(doc, i);
  }
}

function getNewestConversationWithUnread(doc) {
  var conversations = doc.querySelectorAll('[aria-label="Conversation List"] li');

  for (var i = 0; i < conversations.length; i++) {
    if (conversations[i].getAttribute('aria-live')) {
      return i;
    }
  }

  return null;
}

function getCurrentConversationContextMenu(doc) {
  doc.querySelectorAll('div.contentAfter div[aria-label="Conversation actions"]')[getCurrentConversationIndex(doc)].click();
  // doc.querySelector('a[role="menuitem"] span span').click();
}

function openHelp(doc) {
  mute(doc);
  setTimeout(function() {
    doc.querySelector('div[role="dialog"] h2').innerHTML = "Keyboard Shortcuts for Messenger";
    doc.querySelector('div[role="dialog"] h2~div').innerHTML = HELP_HTML;
    doc.querySelector('div[role="dialog"] h2~div~div').remove();
  }, 100);
}

function settingsMenu(doc) {
  getByAttr(doc, 'a', 'aria-label', 'Settings, privacy policy, help and more').click();
}

function clickConvSearch(doc) {
  doc.getElementsByClassName('_3szq')[3].click();
}

function searchConversation(doc) {
  if (doc.getElementsByClassName('_30vt').length != 0) {
    var a = getByAttr(doc, 'input', 'placeholder', 'Search messages');
    if (doc.activeElement.placeholder == 'Search messages') {
      focusMessageInput(doc);
    } else {
      a.focus();
    }
  } else {
    clickConvSearch(doc);
  }
}

function prevConvSearchResult(doc) {
  if (doc.getElementsByClassName('_3jv8').length != 0) {// "n of n results" text
    getByAttr(doc, 'button', 'aria-label', 'Previous result').click();
  } else {
    getByAttr(doc, 'a', 'title', 'Choose a gif or sticker').click();
  }
}

function nextConvSearchResult(doc) {
  if (doc.getElementsByClassName('_3jv8').length != 0) {
    getByAttr(doc, 'button', 'aria-label', 'Next result').click();
  }
}

module.exports = {
  inject: function(doc) {
    doc.body.onkeydown = function(event) {
      // Escape key
      if (event.keyCode === 27) {
        focusMessageInput(doc);
      }

      if (event.keyCode == 13 && doc.activeElement === getSearchBar(doc)) {
        // we're going to change the input, so throw away this keypress
        event.preventDefault();
        selectFirstSearchResult(doc);
        return;
      }

      // Only combinations of the form Ctrl+<key> are accepted
      if (!(event.ctrlKey)) {
        return;
      }

      // Number keys
      if (event.keyCode >= 49 && event.keyCode <= 57) {
        jumpToMessage(doc, event.keyCode - 49);
      }

      // Other keys
      switch (event.keyCode) {
          case 32:  // space
              jumpToNewestWithUnread(doc);
          break;
          // case 82:  // R
          //     window.reload();
          // break;
          case 13:  // Enter
              getByAttr(doc, 'a', 'aria-label', "Send a Like").click();
          break;
          case 80:  // P
              settingsMenu(doc);
          break;
          case 69:  // E
              getByAttr(doc, 'a', 'title', 'Choose an emoji').click();
          break;
          case 71:  // G
              if (event.shiftKey) { // ctrl+shift+g
                nextConvSearchResult(doc);
              } else {
                prevConvSearchResult(doc);
              }
          break;
          case 70:  // F
              searchConversation(doc);
          break;
          case 83:  // S
              getByAttr(doc, 'a', 'title', 'Choose a sticker').click();
          break;
          case 68:  // D
              getCurrentConversationContextMenu(doc);
          break;
          case 78:  // N
              compose(doc);
          break;
          case 73:  // I
            toggleInfo(doc);
          break;
          case 77:  // M
              mute(doc);
          break;
          case 76:  // L
              focusSearchBar(doc);
          break;
          case 9: // tab
              if (event.shiftKey) { // ctrl+shift+tab
                verticalJump(doc, true);
              } else {
                verticalJump(doc, false);
              }
          break;
          case 38: // up arrow
              verticalJump(doc, true);
          break;
          case 40: // down arrow
              verticalJump(doc, false);
          break;
          case 191: // Fwd. slash
              openHelp(doc);
          break;
          // default:
          //   focusMessageInput(doc);
      }
    }
  }
}
