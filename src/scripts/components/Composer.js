import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import BookSelector from "./BookSelector";

import {
  fetchBooks,
  updateDraftContent,
  createNote
} from "../actions/composer";

class Composer extends React.Component {
  componentDidMount() {
    const { settings, doFetchBooks } = this.props;
    const { apiKey } = settings;

    doFetchBooks(apiKey);
  }

  handleSubmit = e => {
    e.preventDefault();

    const { doCreateNote, settings, draft } = this.props;

    doCreateNote(settings.apiKey, "js", draft.content);
  };

  render() {
    const { books, draft, doUpdateDraftContent } = this.props;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <BookSelector books={books.items} />

          <textarea
            onChange={e => {
              const val = e.target.value;

              doUpdateDraftContent(val);
            }}
            value={draft.content}
          />

          <input type="submit" value="Save" />
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    books: state.composer.books,
    draft: state.composer.draft,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doFetchBooks: fetchBooks,
        doUpdateDraftContent: updateDraftContent,
        doCreateNote: createNote
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Composer);
