import React from "react";
import styled from "styled-components";
import PersonalInfoCard from "./PersonalInfoCard";
import { useSelector } from "react-redux";
import { selectMobile, selectPosts } from "../features/appSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

import Post from "./Post";

function Feed() {
  const mobile = useSelector(selectMobile);
  const posts = useSelector(selectPosts);
  const [user] = useAuthState(auth);

  return (
    <FeedContainer>
      <PostStoriesWrap>
        <PostsContainer>
          {posts?.map((post) => (
            <Post post={post} key={post.id} user={user} />
          ))}
        </PostsContainer>
      </PostStoriesWrap>
      {!mobile ? (
        <Widgets>
          <PersonalInfoCard user={user} />
          <p style={{ color: "rgb(212 212 216)", fontSize: 13, marginTop: 50 }}>
            @ 2023 AAFit by Students at the University of Michigan
          </p>
        </Widgets>
      ) : (
        ""
      )}
    </FeedContainer>
  );
}

export default Feed;

const FeedContainer = styled.div`
  display: flex;
  border: 1px solid #f7fafc;
  margin-top: 20px;
`;
const PostStoriesWrap = styled.div`
  width: 100vw;
  @media (min-width: 750px) {
    flex: 0.6;
    max-width: 600px;
  }
`;
const PostsContainer = styled.div``;

const Widgets = styled.div`
  @media (min-width: 750px) {
    flex: 0.4;
  }
  padding: 0 20px;
`;
