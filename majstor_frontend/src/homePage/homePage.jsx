// pages/Home.jsx
import React from "react";
import Searchbar from "./components/Searcbar";
import AllPosts from "./components/AllPosts";
import RecommendedCraftsman from "./components/ RecommendedCraftsman";

const Home = () => {
  return (
    <div className="p-6 h-full">
      <div className="flex flex-col mt-4 lg:flex-row">
        <div className="lg:w-1/3 lg:pr-4">
          <Searchbar />
          <RecommendedCraftsman />
        </div>
        <div className="lg:w-2/3">
          <AllPosts />
        </div>
      </div>
    </div>
  );
};

export default Home;
