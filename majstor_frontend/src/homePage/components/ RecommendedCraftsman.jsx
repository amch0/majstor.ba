import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";
import alternativeImage from "../../images/alternativaUser.png";
import { useNavigate } from "react-router-dom";
import { VscLocation } from "react-icons/vsc";
import { HiOutlinePhone } from "react-icons/hi";
import { FaStar } from "react-icons/fa";

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

const RecommendedCraftsman = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/users?page=1&pageSize=100&rating=4.5"
        );
        const data = response.data;
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mb-5 mt-5 ">
      <h1 className="font-bold  text-xl">Recommended Craftsman</h1>
      {users.map((user) => (
        <Card key={user.id} className="max-w-[300px] mt-6 max-sm:mx-auto">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                // color="primary"
                src={
                  user.profile_picture
                    ? `http://localhost:8080${user.profile_picture}`
                    : alternativeImage
                }
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {`${user.name} ${user.surname}`}
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  <p> {user.type}</p>
                </h5>
              </div>
            </div>
            <Button
              color="primary"
              radius="full"
              size="sm"
              variant="flat"
              onPress={() => navigate(`/userId/${user.id}`)}
            >
              Profile
            </Button>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            <div className="flex items-center">{renderStars(user.rating)}</div>
          </CardBody>

          <CardFooter className="gap-3">
            <div className="flex gap-1">
              <HiOutlinePhone className=" text-blue-400 mt-[2px]" />
              <p className=" text-default-400 text-small font-semibold">
                {user.phone_number}
              </p>
            </div>
            <div className="flex gap-1">
              <VscLocation className=" text-blue-400 mt-[2px]" />
              <p className="text-default-400 text-small font-bold">
                {user.location}
              </p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RecommendedCraftsman;
