import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Messages from "./Messages";
import IconButton from "@material-ui/core/IconButton";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import ScrollableFeed from "react-scrollable-feed";
import { BiHash } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import { Picker } from "emoji-mart";
import { RiImageAddLine } from "react-icons/ri";
import FileUpload from "./FileUpload";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
} from "firebase/firestore";

import "emoji-mart/css/emoji-mart.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  chat: {
    position: "relative",
    height: "calc(100vh - 200px)",
    paddingLeft: "10px",
    paddingBottom: "5px",
    paddingTop: "5px",
  },
  footer: {
    paddingRight: "15px",
    paddingLeft: "15px",
    paddingTop: "10px",
  },
  message: {
    width: "100%",
    color: "white",
  },
  roomName: {
    border: "1px solid #0000004a",
    borderLeft: 0,
    borderRight: 0,
    padding: "15px",
    display: "flex",
    color: "#e5e5e5",
  },
  roomNameText: {
    marginBlockEnd: 0,
    marginBlockStart: 0,
    paddingLeft: "5px",
  },
  iconDesign: {
    fontSize: "1.5em",
    color: "#e5e5e5",
  },
  footerContent: {
    display: "flex",
    backgroundColor: "#303753",
    borderRadius: "5px",
    alignItems: "center",
  },
  inputFile: {
    display: "none",
  },
}));

function Chat() {
  const classes = useStyles();
  const params = useParams();
  const [allMessages, setAllMessages] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [userNewMsg, setUserNewMsg] = useState("");
  const [emojiBtn, setEmojiBtn] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [file, setFileName] = useState(null);

  useEffect(() => {
    if (params.id) {
      // Reference to the channel document
      const channelRef = doc(db, "channels", params.id);

      // Listen for channel name updates
      const unsubscribeChannel = onSnapshot(channelRef, (snapshot) => {
        if (snapshot.exists()) {
          setChannelName(snapshot.data().channelName);
        }
      });

      // Reference to the messages collection inside the channel
      const messagesRef = collection(db, "channels", params.id, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

      // Listen for messages updates
      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        setAllMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

      // Cleanup Firestore listeners on unmount
      return () => {
        unsubscribeChannel();
        unsubscribeMessages();
      };
    }
  }, [params]);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (userNewMsg && params.id) {
      console.log("🚀 ~ Chat.js:119 ~ sendMsg ~ userNewMsg:", userNewMsg);

      const userData = JSON.parse(localStorage.getItem("userDetails"));

      console.log("🚀 ~ Chat.js:124 ~ sendMsg ~ userData:", userData);

      if (userData) {
        const obj = {
          text: userNewMsg,
          timestamp: Timestamp.now(),
          userImg: userData.photoURL,
          userName: userData.displayName,
          uid: userData.uid,
          likeCount: 0,
          likes: {},
          fireCount: 0,
          fire: {},
          heartCount: 0,
          heart: {},
          postImg: null,
        };

        try {
          await addDoc(collection(db, "channels", params.id, "messages"), obj);
          console.log("Message sent");
        } catch (err) {
          console.error("Error sending message:", err);
        }
      }

      setUserNewMsg("");
      setEmojiBtn(false);
    }
  };

  const addEmoji = (e) => {
    setUserNewMsg(userNewMsg + e.native);
  };

  const openModal = () => {
    setModalState(!modalState);
  };

  const handelFileUpload = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setFileName(e.target.files[0]);
      openModal();
    }
    e.target.value = null;
  };

  return (
    <div className={classes.root}>
      {modalState ? <FileUpload setState={openModal} file={file} /> : null}
      <Grid item xs={12} className={classes.roomName}>
        <BiHash className={classes.iconDesign} />
        <h3 className={classes.roomNameText}>{channelName}</h3>
      </Grid>
      <Grid item xs={12} className={classes.chat}>
        <ScrollableFeed>
          {allMessages.map((message) => (
            <Messages
              key={message.id}
              values={message.data}
              msgId={message.id}
            />
          ))}
        </ScrollableFeed>
      </Grid>
      <div className={classes.footer}>
        <Grid item xs={12} className={classes.footerContent}>
          <input
            accept="image/*"
            className={classes.inputFile}
            id="icon-button-file"
            type="file"
            onChange={(e) => handelFileUpload(e)}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <RiImageAddLine style={{ color: "#b9bbbe" }} />
            </IconButton>
          </label>

          <IconButton
            color="primary"
            component="button"
            onClick={() => setEmojiBtn(!emojiBtn)}
          >
            <GrEmoji style={{ color: "#b9bbbe" }} />
          </IconButton>
          {emojiBtn ? <Picker onSelect={addEmoji} theme="dark" /> : null}

          <form
            autoComplete="off"
            style={{ width: "100%", display: "flex" }}
            onSubmit={(e) => sendMsg(e)}
          >
            <TextField
              className={classes.message}
              required
              id="outlined-basic"
              label="Enter Message"
              variant="outlined"
              multiline
              minRows={1}
              maxRows={2}
              value={userNewMsg}
              onChange={(e) => {
                setUserNewMsg(e.target.value);
              }}
            />
            <IconButton type="submit" component="button">
              <FiSend style={{ color: "#b9bbbe" }} />
            </IconButton>
          </form>
        </Grid>
      </div>
    </div>
  );
}

export default Chat;
