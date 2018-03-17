import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classnames from "classnames";

import BookSelector from "./BookSelector";

import { updateDraftContent, createNote } from "../actions/composer";
import { fetchBooks, selectBook, addBook } from "../actions/books";

class Composer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contentFocused: false
    };
  }

  componentDidMount() {
    const { settings, doFetchBooks } = this.props;
    const { apiKey } = settings;

    doFetchBooks(apiKey);

    this.focusInput();

    window.addEventListener("keydown", this.handleSubmitShortcut);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleSubmitShortcut);
  }

  handleSubmitShortcut = e => {
    // Shift + Enter
    if (e.shiftKey && e.keyCode === 13) {
      this.handleSubmit(e);
    }
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

  handleSubmit = e => {
    e.preventDefault();

    const { doCreateNote, settings, content } = this.props;

    const currentBook = this.getCurrentBook();

    doCreateNote(settings.apiKey, currentBook.label, content);
  };

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
    const { contentFocused } = this.state;

    const currentBook = this.getCurrentBook();

    const currentBookId = currentBook.id;

    return (
      <div className="composer">
        <form onSubmit={this.handleSubmit} className="form">
          <BookSelector
            books={books}
            currentBookId={currentBookId}
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
              Shift + Enter to submit
            </div>
          </div>

          <input type="submit" value="Write" className="submit-button" />
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
        doCreateNote: createNote
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Composer);
