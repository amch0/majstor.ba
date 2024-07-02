import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "@nextui-org/react";
import alternativeImage from "../../images/alternativaUser.png";

const SearchBar = () => {
  const [searchTerms, setSearchTerms] = useState({
    name: "",
    surname: "",
  });
  const [activeSearch, setActiveSearch] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { name, surname } = searchTerms;

        if (name === "" && surname === "") {
          setActiveSearch([]);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/users?page=1&pageSize=100&name=${name}&surname=${surname}`
        );

        const data = response.data;

        setActiveSearch(data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchTerms]);

  const handleSearch = (e) => {
    const inputValues = e.target.value.split(" ");

    setSearchTerms({
      name: inputValues[0] || "",
      surname: inputValues[1] || "",
    });
  };

  const handleUserClick = (user) => {
    navigate(`/admin/userId/${user.id}`);
  };

  return (
    <form className="w-[90%] relative">
      <div className="relative">
        <input
          type="search"
          placeholder="Type Here"
          className="w-full p-4 rounded-full bg-slate-200 "
          onChange={(e) => handleSearch(e)}
        />
        <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-slate-400 rounded-full">
          <AiOutlineSearch />
        </button>
      </div>

      {activeSearch.length > 0 && (
        <div className="absolute top-20 p-4 bg-slate-200 text-black w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50">
          {activeSearch.map((s, index) => (
            <span
              key={index}
              onClick={() => handleUserClick(s)}
              className="cursor-pointer transition-all duration-300 hover:bg-gray-300"
            >
              <User
                name={`${s.name} ${s.surname}`}
                description={s.type}
                avatarProps={{
                  src: s.profile_picture
                    ? `http://localhost:8080${s.profile_picture}`
                    : alternativeImage,
                }}
              />
            </span>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
