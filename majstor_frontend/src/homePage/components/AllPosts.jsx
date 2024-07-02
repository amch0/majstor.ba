import React, { useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Pagination,
} from "@nextui-org/react";
import axios from "axios";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post.post_id}`}>
      <Card className="py-3 w-[290px] m-1 mt-3 max-sm:mx-auto">
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

const AllPosts = () => {
  const isSmallScreen = useMediaQuery("(max-width: 48em)");
  const [selectedLocation, setSelectedLocation] = React.useState(
    new Set(["all_cities"])
  );
  const [selectedService, setSelectedService] = React.useState(
    new Set(["all_services"])
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const constructEndpoint = () => {
    const baseEndpoint = "http://localhost:8080/post/?pageSize=8";
    const pageParam = `&page=${currentPage}`;
    const serviceParam = selectedService.has("all_services")
      ? ""
      : `&service=${Array.from(selectedService).join(",")}`;
    const locationParam = selectedLocation.has("all_cities")
      ? ""
      : `&location=${Array.from(selectedLocation).join(",")}`;
    return `${baseEndpoint}${pageParam}${serviceParam}${locationParam}`;
  };

  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const endpoint = constructEndpoint();
    axios
      .get(endpoint)
      .then((response) => {
        if (response.data.success) {
          setPosts(response.data.posts);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        } else if (response.data.message === "No posts found") {
          console.log("No posts found");
          setPosts([]);
          setTotalPages(1);
          setCurrentPage(1);
        } else {
          console.log("Error: ", response.data.message);
          setPosts([]);
          setTotalPages(1);
          setCurrentPage(1);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setPosts([]);
        setTotalPages(1);
        setCurrentPage(1);
      });
  }, [selectedLocation, selectedService, currentPage]);

  const locationValue = React.useMemo(
    () => Array.from(selectedLocation).join(", ").replaceAll("_", " "),
    [selectedLocation]
  );

  const serviceValue = React.useMemo(
    () => Array.from(selectedService).join(", ").replaceAll("_", " "),
    [selectedService]
  );

  return (
    <div className="h-full  ">
      <h1 className="font-bold text-xl ">All Posts</h1>

      {/* Location Dropdown */}
      <div className="mt-2 flex space-x-3 ">
        <Dropdown backdrop="blur">
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize">
              {locationValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Location selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedLocation}
            onSelectionChange={setSelectedLocation}
            className="max-h-80 overflow-y-auto"
          >
            <DropdownItem key="all_cities">All cities</DropdownItem>
            <DropdownItem key="Bihac">Bihac</DropdownItem>
            <DropdownItem key="Bijeljina">Bijeljina</DropdownItem>
            <DropdownItem key="Cazin">Cazin</DropdownItem>
            <DropdownItem key="Derventa">Derventa</DropdownItem>
            <DropdownItem key="Doboj">Doboj</DropdownItem>
            <DropdownItem key="Gorazde">Gorazde</DropdownItem>
            <DropdownItem key="Gracanica">Gracanica</DropdownItem>
            <DropdownItem key="Gradacac">Gradacac</DropdownItem>
            <DropdownItem key="Gradiska">Gradiska</DropdownItem>
            <DropdownItem key="Konjic">Konjic</DropdownItem>
            <DropdownItem key="Livno">Livno</DropdownItem>
            <DropdownItem key="Lukavac">Lukavac</DropdownItem>
            <DropdownItem key="Ljubuski">Ljubuski</DropdownItem>
            <DropdownItem key="Mostar">Mostar</DropdownItem>
            <DropdownItem key="Orasje">Orasje</DropdownItem>
            <DropdownItem key="Prijedor">Prijedor</DropdownItem>
            <DropdownItem key="Sarajevo">Sarajevo</DropdownItem>
            <DropdownItem key="Stolac">Stolac</DropdownItem>
            <DropdownItem key="Tuzla">Tuzla</DropdownItem>
            <DropdownItem key="Visoko">Visoko</DropdownItem>
            <DropdownItem key="Kakanj">Kakanj</DropdownItem>
            <DropdownItem key="Zavidovici">Zavidovici</DropdownItem>
            <DropdownItem key="Zenica">Zenica</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Service Dropdown */}
        <Dropdown backdrop="blur">
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize">
              {serviceValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Service selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedService}
            onSelectionChange={setSelectedService}
          >
            <DropdownItem key="all_services">All services</DropdownItem>
            <DropdownItem key="Painter">Painter</DropdownItem>
            <DropdownItem key="Plumber">Plumber</DropdownItem>
            <DropdownItem key="Cleaning">Cleaning</DropdownItem>
            <DropdownItem key="Mechanic">Mechanic</DropdownItem>
            <DropdownItem key="Ceramist">Ceramist</DropdownItem>
            <DropdownItem key="Electrician">Electrician</DropdownItem>
            <DropdownItem key="Builder">Builder</DropdownItem>
            <DropdownItem key="Heating">Heating</DropdownItem>
            <DropdownItem key="PVC">PVC</DropdownItem>
            <DropdownItem key="Joinery">Joinery</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div
        className={`flex flex-wrap ${isSmallScreen ? "justify-center" : ""}`}
      >
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.post_id} post={post} />)
        ) : (
          <p className="mt-3">No posts found</p>
        )}
      </div>
      {/* Pagination */}
      {posts.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            isCompact
            showControls
            total={totalPages}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AllPosts;
