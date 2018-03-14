import React from "react";
import { Creatable } from "react-select";
import cloneDeep from "lodash/cloneDeep";

export default class BookSelector extends React.Component {
  getCurrentBook = () => {
    const { books, currentBookId } = this.props;

    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      if (book.id === currentBookId) {
        return book;
      }
    }
  };

  generateId = label => {
    return `new-${label}`;
  };

  shouldAddOption = option => {
    const { books } = this.props;

    if (!option.isNew) {
      console.log("not new");
      return false;
    }

    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      if (book.id === option.id) {
        return false;
      }
    }

    return true;
  };

  render() {
    const {
      books,
      currentBookId,
      onBlur,
      onChange,
      onAddBook,
      selectorRef
    } = this.props;

    const currentOption = this.getCurrentBook();

    // clone the array so as not to mutate Redux state manually
    // e.g. react-select mutates options prop internally upon adding a new option
    const options = cloneDeep(books);

    return (
      <Creatable
        ref={selectorRef}
        autoBlur
        multi={false}
        value={currentOption}
        valueKey="id"
        placeholder="Choose a book"
        options={options}
        onChange={option => {
          if (!option) {
            onChange();
            return;
          }

          if (this.shouldAddOption(option)) {
            onAddBook(option);
          }

          onChange(option.id);
        }}
        onBlur={onBlur}
        newOptionCreator={({ label, labelKey, valueKey }) => {
          return {
            [labelKey]: label,
            [valueKey]: this.generateId(label),
            isNew: true
          };
        }}
        valueRenderer={option => {
          return (
            <div>
              {option.isNew && "newbook"}
              {option.label}
            </div>
          );
        }}
        promptTextCreator={label => {
          return `Add a new book ${label}`;
        }}
      />
    );
  }
}
