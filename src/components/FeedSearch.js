import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import './CustomSelect.css';
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { setAddSearchModal, SetSearchTerms } from "../features/appSlice";
import Spinner from "react-spinkit";
import {  TextField  } from '@mui/material';
import moment from "moment";

function FeedSearch() {
  const [user] = useAuthState(auth);
  const [facility, setFacility] = useState(null);
  const [sport, setSport] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
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

  const applySearch = () => {
    console.log("Time: ", time);
    dispatch(
        SetSearchTerms({
          searchTerms: {facility: facility, sport: sport, date: date, time: time}
        })
      );
    dispatch(
        setAddSearchModal({
          addPostIsOpen: false,
        })
    );
  }

  useEffect(() => {
    const handler = (event) => {
      if (!modalContentRef.current.contains(event.target)) {
        dispatch(
          setAddSearchModal({
            addSearchIsOpen: false,
          })
        );
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <AddPostWrapper>
      <ModalContentWrapper ref={modalContentRef}>
        <ContentContainer>
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
            Search for a Game
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
          {/* sport */}
          <div className="custom-select">
            <div className="default-option">Sport</div>
            <div className="select-header" onClick={toggleDropdownSport}>
              {sport}
            </div>
            {isOpenSport && (
              <div className="options">
                {sportOptions.map((sportOption) => (
                  <div
                    key={sportOption}
                    className="option"
                    onClick={() => handleOptionClickSport(sportOption)}
                  >
                    {sportOption}
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
          inputProps={{ onKeyDown: (e) => e.preventDefault() }}
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
              onClick={applySearch}
              className="selected"
            >
              SEARCH
            </button>
          )}
        </ContentContainer>
      </ModalContentWrapper>
    </AddPostWrapper>
  );
}

export default FeedSearch;
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
    padding: 5px;
    cursor: pointer;
    margin-top: 5px;
    border: none;
    border-radius: 5px;
  }
`;
