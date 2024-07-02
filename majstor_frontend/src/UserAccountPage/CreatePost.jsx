// CreatePost.jsx

import React, { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import Service from "../UserAccountPage/components/service";
import { MdCancel } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { Toaster, toast } from "sonner";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userDetails, setUserDetails] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  const [images, setImages] = useState([]);
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;
    console.log("Selected Files:", selectedFiles);

    setImages((prevImages) => {
      const newImages = [...prevImages, ...Array.from(selectedFiles)];
      console.log("New Images:", newImages);
      return newImages;
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleServiceChange = (value) => {
    setSelectedService(value);
    console.log("Selected Service:", value);
  };

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  const handleCreatePost = async () => {
    if (!title || !price || !content || !selectedService) {
      toast.error("Please provide all required fields", {
        duration: 3000,
      });
      return;
    }
    const loadingToastId = toast.loading("Creating post");
    try {
      const response = await axios.get(`http://localhost:8080/users/by-token`, {
        headers: { Authorization: `${token}` },
      });
      setUserDetails(response.data);
      console.log("Token:", response.data);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("service", [...selectedService]);
      formData.append("price", price);
      formData.append("content", content);

      for (let i = 0; i < images.length; i++) {
        formData.append("workPictures", images[i]);
      }

      // Log FormData entries
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Make a request to create a post
      const createPostResponse = await axios.post(
        "http://localhost:8080/post/create-post",
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(createPostResponse.data);
      toast.success("Post created successfully", {
        duration: 3000,
      });
      toast.dismiss(loadingToastId);

      // Check if the response contains the images
      if (createPostResponse.data && createPostResponse.data.images) {
        console.log("Images in the response:", createPostResponse.data.images);
      }

      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Button onPress={onOpen} size="sm" color="primary">
        Create Post
      </Button>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onClose}
        isDismissable={false}
        placement={"top"}
        style={{ overflowY: "auto", marginBottom: 20 }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center text-3xl m2-4">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <form className="p-2" onSubmit={handleCreatePost}>
                  <label>
                    <p className="mt-2 text-lg">Title:</p>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    <p className="mt-2 text-lg">Service:</p>

                    <Service
                      selectedService={selectedService}
                      onServiceChange={handleServiceChange}
                    />
                  </label>
                  <label>
                    <p className="mt-2 text-lg">Price:</p>
                    <Input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </label>
                  <label>
                    <p className="mt-2 text-lg">Content:</p>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </label>

                  <div>
                    <div className="text-center mt-5 font-semibold text-2xl">
                      Upload Pictures
                    </div>
                    <div className="flex flex-wrap mt-7">
                      {images.map((file, index) => (
                        <div key={index} className="relative mr-4 mb-4">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded"
                            className=" object-cover rounded image-with-border"
                            style={{ width: "130px", height: "130px" }}
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 p-1 rounded-full"
                          >
                            <MdCancel />
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={handleImageClick}
                        className={`bg-gray-300 rounded-md flex items-center justify-center cursor-pointer ${
                          images.length === 0 ? "image-with-border" : ""
                        }`}
                        style={{ width: "130px", height: "130px" }}
                      >
                        {images.length === 0 ? (
                          <FaPlus className="text-gray-600 text-2xl" />
                        ) : (
                          <div className="text-gray-600 text-2xl">+</div>
                        )}
                        <input
                          type="file"
                          ref={inputRef}
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                          multiple
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleCreatePost}>
                  Create Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
