import React from "react";

export default ({ books }) => {
  return (
    <select>
      {books.map(book => {
        return (
          <option value={book.id} key={book.id}>
            {book.label}
          </option>
        );
      })}
    </select>
  );
};
