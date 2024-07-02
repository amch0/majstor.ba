import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  useDisclosure,
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
} from "@nextui-org/react";
import alternativeImage from "../images/alternativaUser.png";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import CraftsmanReview from "./components/craftsmanReview";
import UseScrollToTop from "./components/scrollToTop";
import { VscLocation, VscTools } from "react-icons/vsc";
import { HiOutlinePhone, HiOutlineTag } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { Toaster, toast } from "sonner";
import SendRequest from "./components/sendRequest";
import DeletePost from "./components/deletePost";
import DeleteComment from "./components/deleteComment";

const PostDetails = ({ navigate }) => {
  // UseScrollToTop();
  const { postId } = useParams();
  const [postDetails, setPostDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [otherPosts, setOtherPosts] = useState([]);
  const [craftsmanRequestButton, setCraftsmanRequestButton] = useState(false);
  const [craftsmanRequestMessage, setCraftsmanRequestMessage] = useState("");
  const [craftsmanReview, setCraftsmanReview] = useState(false);
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [isCommentOwner, setIsCommentOwner] = useState(false);

  //authorization for comments and requests
  useEffect(() => {
    const checkAuthorization = async () => {
      // Check if there is a token in local storage
      const token = localStorage.getItem("token");

      if (!token) {
        setCraftsmanRequestMessage(
          "Please log in as client to request this craftsman."
        );
        return;
      }

      // Token present, fetch user info
      try {
        const userResponse = await axios.get(
          "http://localhost:8080/users/by-token",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        // Check user type from response
        if (userResponse.data.type !== "client") {
          // User is not a client
          setCraftsmanRequestMessage(
            "Please log in as client to request this craftsman."
          );
          return;
        }

        // User is a client, fetch request information
        const response = await axios.get(
          `http://localhost:8080/request/user-post?post_id=${postId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (
          !response.data.request ||
          Object.keys(response.data.request).length === 0
        ) {
          // No request found, display the request button
          setCraftsmanRequestButton(true);
        } else if (!response.data.request.allowed) {
          // Request found but not allowed
          setCraftsmanRequestMessage(
            "Status: Waiting for craftsman to approve your request."
          );
        } else {
          // Request allowed
          setCraftsmanReview(true);
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
      }
    };

    checkAuthorization();
  }, [postId]);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/post`, {
          params: { post_id: postId },
        });
        setPostDetails(response.data.posts[0]);
        const userId = response.data.posts[0].user_id;
        const userResponse = await axios.get(
          `http://localhost:8080/users/${userId}`
        );
        setUserDetails(userResponse.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
        navigate("/");
      }
    };

    fetchPostDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [postId, navigate]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/comment/${postId}`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    const fetchOtherPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/post/?pageSize=10&page=1"
        );
        setOtherPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching other posts:", error);
      }
    };

    fetchOtherPosts();
  }, []);

  // delete post authorization
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token || !postDetails) {
        return;
      }

      try {
        const userResponse = await axios.get(
          "http://localhost:8080/users/by-token",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        // Check if the user is the owner of the post
        if (userResponse.data.id === postDetails.user_id) {
          setIsPostOwner(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [postDetails]);

  const images = postDetails
    ? postDetails.work_pictures.map((picture) => ({
        original: `http://localhost:8080${picture}`,
        thumbnail: `http://localhost:8080${picture}`,
        renderItem: () => (
          <img
            src={`http://localhost:8080${picture}`}
            alt=""
            className="rounded-lg object-contain h-74 w-full"
          />
        ),
      }))
    : [];
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  };

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
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderCommentCard = (comment) => (
    <Card key={comment.comment_id} className="mb-3">
      <CardHeader className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Avatar
            src={`http://localhost:8080${comment.profile_picture}`}
            alt={`${comment.name} ${comment.surname}`}
            isBordered
            radius="full"
            size="md"
          />
          <Link key={comment.comment_id} to={`/userId/${comment.user_id}`}>
            <div className="ml-3">
              <p className="text-md font-bold">{`${comment.name} ${comment.surname}`}</p>
              <p className="text-small">{formatTime(comment.created_at)}</p>
            </div>
          </Link>
        </div>

        {/* Container for the button */}
        {/* <div className="flex items-center">
          <div className="md:mr-4" style={{ marginRight: "20px" }}>
            <DeleteComment commentId={comment.comment_id} />
          </div>
        </div> */}
      </CardHeader>
      <CardBody>
        <p>{comment.comment}</p>
        <div className="flex mt-2">{renderStars(comment.rating)}</div>
      </CardBody>
    </Card>
  );

  return (
    <div className="flex md:flex-row flex-col mx-auto my-4 max-w-7xl h-screen">
      <div className="md:w-1/4  top-4 p-4">
        <Toaster richColors position="top-right" />
        {userDetails && (
          <Link to={`/userId/${userDetails.id}`}>
            <Card className=" top-4 pt-3">
              <CardHeader>
                <div className="flex items-center justify-center">
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src={
                      userDetails.profile_picture
                        ? `http://localhost:8080${userDetails.profile_picture}`
                        : alternativeImage
                    }
                  />
                  <div className="flex item-center ml-3">
                    {renderStars(userDetails.rating)}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {`${userDetails.name} ${userDetails.surname}`}
                  </h4>
                  <div className="flex gap-1 items-center">
                    <HiOutlinePhone className="text-blue-400" />
                    <p className="text-default-400 text-small font-semibold">
                      {userDetails.phone_number}
                    </p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <VscLocation className="text-blue-400" />
                    <p className="text-default-400 text-small font-bold">
                      {userDetails.location}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        )}
        {/* Button for Post Owner */}

        {isPostOwner && <DeletePost postId={postId} />}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {postDetails ? (
          <>
            <Card className="mb-4">
              <CardBody>
                <Gallery
                  items={images}
                  showThumbnails={true}
                  useBrowserFullscreen={true}
                />
              </CardBody>
            </Card>
            <div className="bg-gray-100 p-3 rounded-lg shadow mb-4">
              <h1 className="text-center text-4xl font-bold text-black-600 uppercase">
                {postDetails.title}
              </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 flex items-center p-4 bg-white shadow-md rounded-lg">
                <VscTools className="text-xl text-blue-500 mr-2" />
                <div>
                  <h5 className="text-md font-semibold">Service</h5>
                  <p>{postDetails.service}</p>
                </div>
              </div>
              <div className="flex-1 flex items-center p-4 bg-white shadow-md rounded-lg">
                <HiOutlineTag className="text-xl text-green-500 mr-2" />
                <div>
                  <h5 className="text-md font-semibold">Price</h5>
                  <p>{postDetails.price}</p>
                </div>
              </div>
              <div className="flex-1 flex items-center p-4 bg-white shadow-md rounded-lg">
                <AiOutlineCalendar className="text-xl text-red-500 mr-2" />
                <div>
                  <h5 className="text-md font-semibold">Date Posted</h5>
                  <p>
                    {new Date(postDetails.created_at).toLocaleDateString()}
                  </p>{" "}
                </div>
              </div>
            </div>

            <Card>
              <CardBody>
                <b>Detailed Description: {postDetails.content}</b>
              </CardBody>
            </Card>

            {/* Comments Section */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2">Reviews:</h2>
              {comments.length > 0 ? (
                // <div className="flex flex-row gap-10">
                //   {comments.slice(0, 3).map(renderCommentCard)}
                // </div>
                <div className="flex flex-col gap-4">
                  {comments.slice(0, 3).map((comment) => (
                    <div key={comment.comment_id} className="w-full">
                      {renderCommentCard(comment)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-lg italic text-gray-500">
                  No reviews yet
                </p>
              )}
              {comments.length > 3 && (
                <div className="mt-4">
                  <Button onPress={onOpen}>Show All Reviews</Button>
                </div>
              )}

              <Modal isOpen={isOpen} onClose={onClose} overlay="blur">
                <ModalContent style={{ maxHeight: "80vh", overflowY: "auto" }}>
                  <ModalHeader>All Reviews</ModalHeader>
                  <ModalBody>{comments.map(renderCommentCard)}</ModalBody>
                  <ModalFooter>
                    <Button auto flat color="error" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
            <div style={{ position: "relative", marginTop: "30px" }}>
              {craftsmanRequestButton && <SendRequest postId={postId} />}

              {!craftsmanReview && craftsmanRequestMessage && (
                <>
                  <Card className="mb-4">
                    <CardBody>
                      <b className="text-center text-lg italic text-gray-500 ">
                        {craftsmanRequestMessage}
                      </b>
                    </CardBody>
                  </Card>
                </>
              )}

              {craftsmanReview && <CraftsmanReview postId={postId} />}
            </div>
            {/* Other Services Section */}
            <div className="w-full px-4 md:px-0">
              <h2 className="text-2xl font-bold mb-4">Other Services</h2>
              <div style={gridStyle}>
                {Array.isArray(otherPosts) &&
                  otherPosts.slice(0, 6).map((post, index) => (
                    <Link key={index} to={`/post/${post.post_id}`}>
                      <Card className="py-3 m-1 mt-3 max-sm:mx-auto">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                          <h4 className="text-large uppercase font-bold">
                            {post.title}
                          </h4>
                          <small className="text-default-500">
                            {post.service}
                          </small>
                          <p className="font-semibold text-large">
                            Price: {post.price}
                          </p>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                          {post.work_pictures &&
                            post.work_pictures.length > 0 && (
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
                  ))}
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
