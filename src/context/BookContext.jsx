import { createContext, useContext, useState } from "react";

export const BooksContext = createContext(null);

export const BooksContextProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  return (
    <BooksContext.Provider value={{ books, setBooks }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => useContext(BooksContext);