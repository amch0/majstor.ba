import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import backgroundProfile from "../assets/profilebackground.jpg";
import alternativeImage from "../images/alternativaUser.png";
import { Card, CardHeader, CardBody, Image, Badge } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import DeleteAcc from "./DeleteAcc";
import Requests from "./Requests";
import { NotificationIcon } from "./NotificationIcon";

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
    <Link to={`/post/${post.post_id}`} className="">
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

const UserAccountPage = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();
  const [userRequests, setUserRequests] = useState([]);

  const isSmallScreen = useMediaQuery("(max-width: 48em)");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If token is not present, navigate to "/login"
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        // Fetch user details
        const response = await axios.get(
          `http://localhost:8080/users/by-token`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setUserDetails(response.data);

        // Fetch user posts
        const postsResponse = await axios.get(
          `http://localhost:8080/post?user_id=${response.data.id}&pageSize=100&page=1`
        );
        const postsData = postsResponse.data.posts;
        setUserPosts(postsData);

        // Fetch user requests
        const requestsResponse = await axios.get(
          `http://localhost:8080/request/userRequests`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        const requestsData = requestsResponse.data.requests;
        setUserRequests(requestsData);
      } catch (error) {
        console.error(
          "Error fetching user details, posts, or requests:",
          error
        );
        // Remove token from localStorage if there's an error
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [userId, navigate]);

  const isCraftsmanWithPendingRequests =
    userDetails?.type === "craftsman" &&
    userRequests.some((request) => request.allowed === null);

  const isClientWithApprovedRequests =
    userDetails?.type === "client" &&
    userRequests.some((request) => request.allowed === true);

  const shouldShowBadge =
    isCraftsmanWithPendingRequests || isClientWithApprovedRequests;

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
                    <>
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
                      <CreatePost />
                    </>
                  )}

                  {/* <div className="mt-4"> */}
                  {shouldShowBadge && (
                    <Badge
                      isOneChar
                      content={<NotificationIcon size={12} />}
                      color="danger"
                      shape="circle"
                      placement="top-right"
                    >
                      <Requests />
                    </Badge>
                  )}
                  {!shouldShowBadge && <Requests />}
                  {/* </div> */}
                  <DeleteAcc />
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

export default UserAccountPage;
