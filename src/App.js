import Header from "./components/Header";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  selectAddPostIsOpen,
  selectAddSearchIsOpen,
  SetScreen,
  SetPosts,
} from "./features/appSlice";
import { useTransition, animated } from "react-spring";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Login from "./components/Login";
import AddPost from "./components/AddPost";
import FeedSearch from "./components/FeedSearch";

function App() {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const addPostIsOpen = useSelector(selectAddPostIsOpen);
  const addSearchIsOpen = useSelector(selectAddSearchIsOpen);

  const addPostTransition = useTransition(addPostIsOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const addSearchTransition = useTransition(addSearchIsOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  useEffect(() => {
    window.addEventListener("resize", checkScreenSize);
    function checkScreenSize() {
      if (window.innerWidth >= 750) {
        dispatch(
          SetScreen({
            mobile: false,
          })
        );
      } else if (window.innerWidth <= 750) {
        dispatch(
          SetScreen({
            mobile: true,
          })
        );
      }
    }
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        dispatch(
          SetPosts({
            posts: snapshot.docs,
          })
        );
      }
    );
    return () => {
      unsubscribe();
    };
  });

  return (
    <AppContainer>
      {!user ? (
        <Login />
      ) : (
        <>
          <Header />
          {/* Body Contents */}

          <BodyWrapper>
            <Routes>
              <Route exact path="/" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BodyWrapper>
          {addPostTransition(
            (styles, item) =>
              item && (
                <animated.div style={styles}>
                  <AddPost />
                </animated.div>
              )
          )}
          {addSearchTransition(
            (styles, item) =>
              item && (
                <animated.div style={styles}>
                  <FeedSearch />
                </animated.div>
              )
          )}
        </>
      )}
    </AppContainer>
  );
}

export default App;
const AppContainer = styled.div`
  background-color: rgb(250 250 250);
`;
const BodyWrapper = styled.div`
  width: 100%;
  @media (min-width: 750px) {
    width: 75%;
    margin: auto;
  }
`;
