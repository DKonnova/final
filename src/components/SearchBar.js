import React from "react";
import "./SearchBar.css";

const SearchBar = ({ value }) => {
  return (
    <input id="search-input" type="search" placeholder="Поиск" value={value} />
  );
};

export default SearchBar;
