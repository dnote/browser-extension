import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import BookSelector from "./BookSelector";

import { updateDraftContent, createNote } from "../actions/composer";
import { fetchBooks, selectBook, addBook } from "../actions/books";

class Composer extends React.Component {
  componentDidMount() {
    const { settings, doFetchBooks } = this.props;
    const { apiKey } = settings;

    doFetchBooks(apiKey);

    this.focusInput();
  }

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

  render() {
    const {
      books,
      content,
      doUpdateDraftContent,
      doSelectBook,
      doAddBook
    } = this.props;
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
          />

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
