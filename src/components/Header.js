import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import AAFitLogo from "../assets/AAFitLogo.png";
import { HomeIcon } from "@heroicons/react/solid";
import {
  PlusCircleIcon,
  UserCircleIcon,
  HomeIcon as OutlineHomeIcon,
} from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import {
  setAddPostModal,
  SetSelectedProfile,
} from "../features/appSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const modalContentRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);

  function toggleAddPost() {
    dispatch(
      setAddPostModal({
        addPostIsOpen: true,
      })
    );
  }

  useEffect(() => {
    const handler = (event) => {
      if (!modalContentRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const visitProfile = () => {
    dispatch(
      SetSelectedProfile({
        selectedProfile: {
          userProfile: user.photoURL,
          userId: user.uid,
          username: user.displayName,
        },
      })
    );
    navigate("/profile");
    setIsOpen(false);
  };

  return (
    <HeaderContainer>
      <ContentsWrap>
        <LogoContainer>
          <WordLogoContainer src={AAFitLogo} alt="AAFit Logo" onClick={() => navigate("/")} />
        </LogoContainer>
        <NavOptionsContainer>
          {location.pathname === "/" ? (
            <HomeIcon className="Nav__Icon" onClick={() => navigate("/")} />
          ) : (
            <OutlineHomeIcon
              className="Nav__Icon"
              onClick={() => navigate("/")}
            />
          )}
          <PlusCircleIcon onClick={toggleAddPost} className="Nav__Icon" />
          {user ? (
            <UserAvatarContainer>
              <img
                src={user?.photoURL}
                alt=""
                onClick={() => setIsOpen(!isOpen)}
              />
              {isOpen && (
                <UserAvatarPopupContainer ref={modalContentRef}>
                  <section onClick={visitProfile}>
                    <UserCircleIcon className="Nav__Icon" />
                    <p>Profile</p>
                  </section>

                  <div>
                    <p onClick={() => auth.signOut()}>Logout</p>
                  </div>
                </UserAvatarPopupContainer>
              )}
            </UserAvatarContainer>
          ) : (
            <p>
              <strong>Sign in</strong>
            </p>
          )}
        </NavOptionsContainer>
      </ContentsWrap>
    </HeaderContainer>
  );
}

export default Header;
const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  padding: 10px 20px;
  border-bottom: 1px solid rgb(212 212 212);
  @media (min-width: 750px) {
    padding: 10px 0;
  }
`;
const ContentsWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 750px) {
    width: 75%;
    margin: auto;
  }
`;
const LogoContainer = styled.div``;
const WordLogoContainer = styled.img`
  display: block;
  object-fit: contain;
  height: 35px;
`;
const NavOptionsContainer = styled.div`
  display: flex;
  gap: 15px;
`;
const UserAvatarContainer = styled.div`
  position: relative;
  > img {
    object-fit: contain;
    height: 30px;
    width: 30px;
    border-radius: 9999px;
    cursor: pointer;
  }
`;
const UserAvatarPopupContainer = styled.div`
  position: absolute;
  z-index: 2;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  width: 200px;
  height: 150px;
  top: 45px;
  right: 10px;
  border-radius: 0.25rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);

  > section {
    display: flex;
    padding: 20px;
    gap: 10px;
    cursor: pointer;
  }
  > div {
    margin-top: 30px;
    border-top: 1px solid gray;
  }
  > div > p {
    padding: 10px 20px;
    cursor: pointer;
  }
`;
