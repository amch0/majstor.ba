import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import backgroundProfile from "../assets/profilebackground.jpg";
import alternativeImage from "../images/alternativaUser.png";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";
import { FaStar } from "react-icons/fa";
import DeleteAccountButton from "../admin/components/DeleteAccountButton";

const renderStars = (rating) => {
  const roundedRating = Math.round(rating);
  const stars = [];
  const maxRating = 5;

  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <FaStar
        key={i}
        className={i <= roundedRating ? "text-yellow-500" : "text-gray-300"}
      />
    );
  }

  return stars;
};

const UserPostCard = ({ post }) => {
  const isSmallScreen = useMediaQuery("(max-width: 48em)");
  return (
    <Link to={`/admin/post/${post.post_id}`} className="">
      <Card
        className={`py-3 ${
          isSmallScreen ? "w-full" : "w-[290px]"
        } m-1 mt-3 max-sm:mx-auto`}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="text-large uppercase font-bold">{post.title}</h4>
          <small className="text-default-500">{post.service}</small>
          <p className="font-semibold text-large">Price: {post.price}</p>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          {post.work_pictures && post.work_pictures.length > 0 && (
            <Image
              alt="Work Picture"
              className="object-cover rounded-xl"
              src={`http://localhost:8080${post.work_pictures[0]}`}
              width={270}
              style={{ height: "180px" }}
            />
          )}
        </CardBody>
      </Card>
    </Link>
  );
};

const AdminUserDetails = ({ navigate }) => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [adminToken, setAdminToken] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  const isSmallScreen = useMediaQuery("(max-width: 48em)");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/loginadmin");
          return;
        }
        const tokenResponse = await axios.get(
          "http://localhost:8080/users/by-token",
          {
            headers: { Authorization: `${token}` },
          }
        );
        if (tokenResponse.data.type !== "admin") {
          navigate(`/userId/${userId}`);
          return;
        }
        setAdminToken(tokenResponse.data);

        const userResponse = await axios.get(
          `http://localhost:8080/users/${userId}`
        );
        const userData = userResponse.data;
        setUserDetails(userData);

        const postsResponse = await axios.get(
          `http://localhost:8080/post?user_id=${userData.id}&pageSize=100&page=1`
        );
        const postsData = postsResponse.data.posts;

        setUserPosts(postsData);
      } catch (error) {
        console.error("Error fetching user details or posts:", error);
        navigate("/");
      }
    };

    fetchUserDetails();
  }, [userId, navigate]);

  return (
    <div className=" flex flex-col items-center justify-center ">
      <div
        className={`fixed top-0 left-0 w-full h-full bg-cover bg-center ${
          isSmallScreen ? "bg-no-repeat" : ""
        }`}
        style={{
          backgroundImage: isSmallScreen ? "" : `url(${backgroundProfile})`,
          opacity: 0.25,
          zIndex: -1,
        }}
      ></div>

      <div
        className={`detail bg-slate-50 p-10 rounded-lg   ${
          isSmallScreen ? "w-full" : "w-7/12"
        }`}
        style={{ marginTop: 30 }}
      >
        <div
          className={`flex flex-col ${
            isSmallScreen ? "h-full items-center" : "max-h-[500px] md:flex-row"
          } justify-center`}
        >
          <img
            style={{
              border: "1px solid black",
              width: "50%",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
            }}
            radius="full"
            size="md"
            src={
              userDetails && userDetails.profile_picture
                ? `http://localhost:8080${userDetails.profile_picture}`
                : alternativeImage
            }
            alt="Profile"
          />
          <div className={`w-full md:w-1/2 mt-4 md:mt-0 ml-8`}>
            <h1 className="font-serif mt-3 text-center md:text-left text-4xl font-bold">
              User Details
            </h1>
            {userDetails ? (
              <>
                <div className={`mt-8`}>
                  <p className={`text-xl mb-4 ${isSmallScreen ? "flex" : ""}`}>
                    <span className="font-semibold text-orange-800 mr-2">
                      Name:{" "}
                    </span>{" "}
                    <span className="">{userDetails.name}</span>
                  </p>
                  <p className={`text-xl mb-4 ${isSmallScreen ? "flex" : ""}`}>
                    <span className="font-semibold text-orange-800 mr-2">
                      Surname:{" "}
                    </span>
                    <span className="">{userDetails.surname}</span>
                  </p>
                  <p className={`text-xl mb-4 ${isSmallScreen ? "flex" : ""}`}>
                    <span className="font-semibold text-orange-800 mr-2">
                      Type:{" "}
                    </span>
                    <span className="">{userDetails.type}</span>
                  </p>
                  <p className={`text-xl mb-4 ${isSmallScreen ? "flex" : ""}`}>
                    <span className="font-semibold text-orange-800 mr-2">
                      Email:{" "}
                    </span>{" "}
                    <span className="">{userDetails.mail}</span>
                  </p>
                  <p className={`text-xl mb-4 ${isSmallScreen ? "flex" : ""}`}>
                    <span className="font-semibold text-orange-800 mr-2">
                      Phone Number:{" "}
                    </span>
                    <span className="">{userDetails.phone_number}</span>
                  </p>
                  <p className={`text-xl mb-4 ${isSmallScreen ? "flex" : ""}`}>
                    <span className="font-semibold text-orange-800 mr-2">
                      Location:{" "}
                    </span>{" "}
                    <span className="">{userDetails.location}</span>
                  </p>
                  {userDetails.type === "craftsman" && (
                    <p
                      className={`text-xl mb-4 flex items-center ${
                        isSmallScreen ? "flex" : ""
                      }`}
                    >
                      <span className="font-semibold text-orange-800 mr-2">
                        Rating:
                      </span>
                      <span className=" flex items-center">
                        {renderStars(userDetails.rating)}
                      </span>
                    </p>
                  )}
                  <div>
                    <DeleteAccountButton userDetails={userDetails} />
                  </div>
                </div>
              </>
            ) : (
              <p>Loading user details...</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-10">
        {userPosts.length > 0 ? (
          <>
            <h2 className="font-serif text-center font-bold text-4xl">
              User Posts
            </h2>
            <ul
              className={`grid ${
                isSmallScreen ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
              } gap-4 mt-10`}
            >
              {userPosts.map((post) => (
                <li key={post.post_id}>
                  <UserPostCard post={post} isSmallScreen={isSmallScreen} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetails;
