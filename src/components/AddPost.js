import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { CameraIcon } from "@heroicons/react/outline";
import './CustomSelect.css';
import {
  addDoc,
  doc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { useDispatch } from "react-redux";
import { setAddPostModal } from "../features/appSlice";
import Spinner from "react-spinkit";
import {  TextField  } from '@mui/material';

function AddPost() {
  const [user] = useAuthState(auth);
  const filePickerRef = useRef(null);
  // const [caption, setCaption] = useState("");
  const [facility, setFacility] = useState(null);
  const [sport, setSport] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSport, setIsOpenSport] = useState(false);
  const dispatch = useDispatch();
  const modalContentRef = useRef();

  const options = ['IM Building', 'CCRB'];
  const sportOptions = ['Basketball'];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdownSport = () => {
    setIsOpenSport(!isOpenSport);
  };

  const handleOptionClickSport = (option) => {
    setSport(option);
    setIsOpenSport(false);
  };


  const handleOptionClick = (option) => {
    setFacility(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handler = (event) => {
      if (!modalContentRef.current.contains(event.target)) {
        dispatch(
          setAddPostModal({
            addPostIsOpen: false,
          })
        );
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      username: user.displayName,
      userId: user.uid,
      // caption: caption,
      profileImg: user.photoURL,
      facility: facility,
      sport: sport,
      date: date,
      time: time,
      timestamp: serverTimestamp(),
    });
    // setCaption("");
    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );

    dispatch(
      setAddPostModal({
        addPostIsOpen: false,
      })
    );
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  // const facilityChange = (e) => {
  //   e.preventDefault();
  //   setFacility(e.target.value)
  // };

  return (
    <AddPostWrapper>
      <ModalContentWrapper ref={modalContentRef}>
        <ContentContainer>
          {selectedFile ? (
            <CameraIcon
            onClick={() => filePickerRef.current.click()}
            style={{
              color: "white",
              padding: 15,
              borderRadius: 9999,
              background: "green",
              cursor: "pointer",
              height: 30,
            }}
          />
          ) : (
            <CameraIcon
              onClick={() => filePickerRef.current.click()}
              style={{
                color: "#e53e3e",
                padding: 15,
                borderRadius: 9999,
                background: "#fed7d7",
                cursor: "pointer",
                height: 30,
              }}
            />
          )}

          {/* add photo */}
          <p
            style={{
              padding: 5,
              fontSize: 20,
              fontWeight: 800,
              color: "rgb(38 38 38)",
              textAlign: "center",
              border: 0,
            }}
          >
            Select a photo
          </p>
          {/* facility */}
          <div className="custom-select">
            <div className="default-option">Facility</div>
            <div className="select-header" onClick={toggleDropdown}>
              {facility}
            </div>
            {isOpen && (
              <div className="options">
                {options.map((option) => (
                  <div
                    key={option}
                    className="option"
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          <br />
          {/* date */}
          <TextField
          fullWidth
          label="Date"
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
              shrink: true,
          }}
          sx={{ marginBottom: 2 }}
          />
          {/* time */}
          <TextField
          fullWidth
          label="Time"
          type="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          InputLabelProps={{
              shrink: true,
          }}
          sx={{ marginBottom: 2 }}
          />
          {/* sport */}
          <div className="custom-select">
            <div className="default-option">Sport</div>
            <div className="select-header" onClick={toggleDropdownSport}>
              {sport}
            </div>
            {isOpenSport && (
              <div className="sportOptions">
                {sportOptions.map((sportOption) => (
                  <div
                    key={sportOption}
                    className="sportOption"
                    onClick={() => handleOptionClickSport(sportOption)}
                  >
                    {sportOption}
                  </div>
                ))}
              </div>
            )}
          </div>
          <br />
          {/* caption */}
          {/* <input
            placeholder="Enter caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              padding: 5,
              color: "#4a5568",
              textAlign: "center",
              border: 0,
              fontSize: 15,
            }}
          /> */}
          {/* hidden input */}
          <input
            ref={filePickerRef}
            type="file"
            hidden
            onChange={addImageToPost}
          />
          {/* FINAL SUBMIT BUTTON */}

          {loading ? (
            <Spinner
              name="ball-spin-fade-loader"
              color="purple"
              fadeIn="none"
            />
          ) : (
            <button
              type="submit"
              disabled={!selectedFile}
              onClick={uploadPost}
              className={selectedFile ? "selected" : "notSelected"}
            >
              POST
            </button>
          )}
        </ContentContainer>
      </ModalContentWrapper>
    </AddPostWrapper>
  );
}

export default AddPost;
const AddPostWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  z-index: 12;
`;
const ModalContentWrapper = styled.div`
  display: flex;
  margin: auto;
  background-color: #fff;
  width: 30%;
  height: 50vh;
  min-width: 300px;
  border-radius: 10px;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  > button {
    font-weight: 600;
    width: 60%;
    padding: 10px;
    cursor: pointer;
    margin-top: 5px;
    border: none;
    border-radius: 5px;
  }
`;
