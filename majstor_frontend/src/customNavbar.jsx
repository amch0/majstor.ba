import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarMenu,
  Avatar,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "@nextui-org/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AcmeLogo } from "./AcmeLogo.jsx";
import axios from "axios";
import alternativeImage from "./images/alternativaUser.png";
import { useNavigate } from "react-router-dom";

export default function CustomNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const navigate = useNavigate();
  const handleMyProfileClick = () => {
    navigate("/myAcc");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:8080/users/by-token", {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
          localStorage.removeItem("token");
        });
    }
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/aboutUs" },
  ];

  const isNavItemActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="p-6">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">MAJSTOR.BA</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem className={isNavItemActive("/") ? "activeNavItem" : ""}>
          <RouterLink to="/" className="nav-link">
            <span
              className={isNavItemActive("/") ? "text-blue-500" : "text-black"}
            >
              Home
            </span>
          </RouterLink>
        </NavbarItem>
        <NavbarItem
          className={isNavItemActive("/aboutUs") ? "activeNavItem" : ""}
        >
          <RouterLink to="/aboutUs" className="nav-link">
            <span
              className={
                isNavItemActive("/aboutUs") ? "text-blue-500" : "text-black"
              }
            >
              About Us
            </span>
          </RouterLink>
        </NavbarItem>
      </NavbarContent>

      {user ? (
        <>
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center">
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={user.name}
                    // size="sm"
                    src={
                      user.profile_picture
                        ? `http://localhost:8080${user.profile_picture}`
                        : alternativeImage
                    }
                  />
                  <span className="ml-2 font-semibold">{user.name}</span>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue={`Signed in as ${user.mail}`}
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user.mail}</p>
                </DropdownItem>
                <DropdownItem
                  textValue="My Profile"
                  key="settings"
                  onClick={handleMyProfileClick}
                  to="/myAcc"
                  className="nav-link"
                >
                  My Profile
                </DropdownItem>
                <DropdownItem
                  textValue="Log Out"
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </>
      ) : (
        <>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                as={RouterLink}
                color="primary"
                to="/login"
                variant="flat"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={RouterLink}
                color="primary"
                to="/signUp"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </>
      )}

      <NavbarMenu className="pt-12">
        {menuItems.map((menuItem, index) => (
          <NavbarMenuItem key={`${menuItem.name}-${index}`}>
            <RouterLink to={menuItem.path} className="nav-link">
              <span>{menuItem.name}</span>
            </RouterLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
