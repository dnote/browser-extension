import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classnames from "classnames";

import BookSelector from "./BookSelector";
import Error from "./Error";
import { aes256GcmEncrypt } from '../utils/crypto'
import { b64ToBuf, utf8ToBuf, bufToB64 } from '../utils/encoding'

import {
  updateDraftContent,
  createNote,
  createBook
} from "../actions/composer";
import { fetchBooks, selectBook, addBook } from "../actions/books";
import { navigate } from "../actions/location";

class Composer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contentFocused: false,
      submitting: false
    };
  }

  componentDidMount() {
    const { settings, doFetchBooks } = this.props;

    console.log('fetching...')
    doFetchBooks(settings.sessionKey, settings.cipherKey);

    this.focusInput();

    window.addEventListener("keydown", this.handleSubmitShortcut);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleSubmitShortcut);
  }

  getCurrentBook = () => {
    const { books } = this.props;

    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      if (book.selected) {
        return book;
      }
    }

    return {};
  };

  handleSubmitShortcut = e => {
    // Shift + Enter
    if (e.shiftKey && e.keyCode === 13) {
      this.handleSubmit(e);
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      doCreateNote,
      doCreateBook,
      doSelectBook,
      doUpdateDraftContent,
      doNavigate,
      settings,
      content
    } = this.props;

    this.setState({ submitting: true }, async () => {
      try {
        const currentBook = this.getCurrentBook();

        let bookUUID;
        if (currentBook.isNew) {
          const labelEnc = await aes256GcmEncrypt(b64ToBuf(settings.cipherKey), utf8ToBuf(currentBook.label))

          const resp = await doCreateBook(settings.sessionKey, bufToB64(labelEnc));
          bookUUID = resp.book.uuid
        } else {
          bookUUID = currentBook.uuid;
        }

        const contentEnc = await aes256GcmEncrypt(b64ToBuf(settings.cipherKey), utf8ToBuf(content))
        const resp = await doCreateNote(settings.sessionKey, bookUUID, bufToB64(contentEnc))

        // clear the composer state
        this.setState({ errorMsg: "", submitting: false });
        doSelectBook();
        doUpdateDraftContent("");

        // navigate
        doNavigate("/success", {
          bookName: currentBook.label,
          noteUUID: resp.result.uuid
        });
      } catch (e) {
        this.setState({ errorMsg: e.message, submitting: false });
      }
    });
  };

  focusInput = () => {
    const currentBook = this.getCurrentBook();

    if (currentBook.id) {
      this.focusContent();
    } else {
      this.focusBookSelector();
    }
  };

  focusBookSelector = () => {
    this.bookSelectorEl.focus();
  };

  focusContent = () => {
    const len = this.contentEl.value.length;

    this.contentEl.focus();
    this.contentEl.setSelectionRange(len, len);
  };

  handleContentFocus = () => {
    this.setState({ contentFocused: true });
  };

  handleContentBlur = () => {
    this.setState({ contentFocused: false });
  };

  render() {
    const {
      books,
      content,
      doUpdateDraftContent,
      doSelectBook,
      doAddBook
    } = this.props;
    const { contentFocused, errorMsg, submitting } = this.state;

    const currentBook = this.getCurrentBook();

    const currentBookUUID = currentBook.uuid;

    let submitBtnText;
    if (submitting) {
      submitBtnText = 'Saving...';
    } else {
      submitBtnText = 'Save';
    }

    return (
      <div className="composer">
        {errorMsg && <Error message={errorMsg} />}

        <form onSubmit={this.handleSubmit} className="form">
          <BookSelector
            books={books}
            currentBookUUID={currentBookUUID}
            onChange={doSelectBook}
            onBlur={this.focusContent}
            onAddBook={doAddBook}
            selectorRef={el => {
              this.bookSelectorEl = el;
            }}
          />

          <div className="content-container">
            <textarea
              className="content"
              placeholder="What did you learn?"
              onChange={e => {
                const val = e.target.value;

                doUpdateDraftContent(val);
              }}
              value={content}
              ref={el => {
                this.contentEl = el;
              }}
              onFocus={this.handleContentFocus}
              onBlur={this.handleContentBlur}
            />

            <div
              className={classnames("shortcut-hint", { shown: contentFocused })}
            >
              Shift + Enter to save
            </div>
          </div>

          <input
            type="submit"
            value={submitBtnText}
            className="submit-button"
            disabled={submitting}
          />
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    books: state.books.items,
    content: state.composer.content,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doFetchBooks: fetchBooks,
        doSelectBook: selectBook,
        doAddBook: addBook,
        doUpdateDraftContent: updateDraftContent,
        doCreateNote: createNote,
        doCreateBook: createBook,
        doNavigate: navigate
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Composer);
