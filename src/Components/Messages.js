import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepPurple } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { AiFillLike } from "react-icons/ai";
import { AiFillFire } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { useParams } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import { Anchorme } from "react-anchorme";
import { db } from "../Firebase/Firebase";
import {
  doc,
  collection,
  getDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
} from "firebase/firestore";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "relative",
    padding: "8px",
  },
  paper: {
    padding: "10px",
    "&:hover": {
      backgroundColor: "#1f2436",
    },
  },
  avatar: {
    display: "inline-block",
    verticalAlign: "top",
  },
  chat: {
    display: "inline-block",
    paddingLeft: "1rem",
    width: "calc(100% - 50px)",
    wordBreak: "break-all",
  },
  chatHeading: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    display: "inline-block",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
  },
  chatTimming: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    display: "inline-block",
    paddingLeft: "0.5em",
    color: "white",
  },
  chatText: {
    color: "#dcddde",
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: "#3f51b5",
  },
  emojiDiv: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  emojiDivInner: {
    position: "absolute",
    right: 0,
    padding: "0 35px 0 32px",
  },
  emojiBtn: {
    fontSize: "1.1rem",
    color: "rgb(255 195 54)",
  },
  allEmoji: {
    backgroundColor: "#2d2e31ba",
    borderRadius: "5px",
    paddingLeft: "2px",
    paddingRight: "2px",
    display: "flex",
  },
  countEmojiBtn: {
    padding: "3px",
    borderRadius: "4px",
    fontSize: "0.8em",
    backgroundColor: "#ffffff4a",
    color: "#cacaca",
    paddingLeft: "5px",
    paddingRight: "5px",
    "&:hover": {
      backgroundColor: "#ffffff4a",
      color: "#e7e7e7",
    },
  },
}));

function Messages({ values, msgId }) {
  console.log("🚀 ~ Messages.js:106 ~ Messages ~ values:", values);

  const [style, setStyle] = useState({ display: "none" });
  const [deleteModal, setDeleteModal] = useState(false);
  const classes = useStyles();

  const uid = JSON.parse(localStorage.getItem("userDetails")).uid;
  const messegerUid = values.uid;
  const date = values.timestamp.toDate();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const time = `${day}/${month}/${year}   ${hour}:${minute}`;

  const numLikes = values.likeCount;
  const numFire = values.fireCount;
  const numHeart = values.heartCount;

  const userLiked = values.likes[uid];
  const userFire = values.fire[uid];
  const userHeart = values.heart[uid];

  const postImg = values.postImg;

  const channelId = useParams().id;

  const selectedLike = userLiked
    ? { color: "#8ff879", backgroundColor: "#545454" }
    : null;

  const selectedHeart = userHeart
    ? { color: "#ff527d", backgroundColor: "#545454" }
    : null;

  const selectedFire = userFire
    ? { color: "#ffc336", backgroundColor: "#545454" }
    : null;

  const showDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const heartClick = async () => {
    const messageDocRef = doc(db, "channels", channelId, "messages", msgId);

    try {
      await runTransaction(db, async (transaction) => {
        const messageDoc = await transaction.get(messageDocRef);

        if (!messageDoc.exists()) {
          console.log("Document not found");
          return;
        }

        let newHeartCount = messageDoc.data().heartCount || 0;
        let newHeart = messageDoc.data().heart || {};

        if (userHeart) {
          newHeartCount -= 1;
          newHeart[uid] = false;
          console.log("Disliked");
        } else {
          newHeartCount += 1;
          newHeart[uid] = true;
          console.log("Liked");
        }

        transaction.update(messageDocRef, {
          heartCount: newHeartCount,
          heart: newHeart,
        });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  const fireClick = async () => {
    const messageDocRef = doc(db, "channels", channelId, "messages", msgId);

    try {
      await runTransaction(db, async (transaction) => {
        const messageDoc = await transaction.get(messageDocRef);

        if (!messageDoc.exists()) {
          console.log("Document not found");
          return;
        }

        let newFireCount = messageDoc.data().fireCount || 0;
        let newFire = messageDoc.data().fire || {};

        if (userFire) {
          newFireCount -= 1;
          newFire[uid] = false;
          console.log("Disliked");
        } else {
          newFireCount += 1;
          newFire[uid] = true;
          console.log("Liked");
        }

        transaction.update(messageDocRef, {
          fireCount: newFireCount,
          fire: newFire,
        });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  const likeClick = async () => {
    const messageDocRef = doc(db, "channels", channelId, "messages", msgId);

    try {
      await runTransaction(db, async (transaction) => {
        const messageDoc = await transaction.get(messageDocRef);

        if (!messageDoc.exists()) {
          console.log("Document not found");
          return;
        }

        let newLikeCount = messageDoc.data().likeCount || 0;
        let newLikes = messageDoc.data().likes || {};

        if (userLiked) {
          newLikeCount -= 1;
          newLikes[uid] = false;
          console.log("Disliked");
        } else {
          newLikeCount += 1;
          newLikes[uid] = true;
          console.log("Liked");
        }

        transaction.update(messageDocRef, {
          likeCount: newLikeCount,
          likes: newLikes,
        });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  const deleteMsg = async (id) => {
    const messageDocRef = doc(db, "channels", channelId, "messages", id);

    try {
      await deleteDoc(messageDocRef);
      console.log("Deleted successfully");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  return (
    <Grid item xs={12} className={classes.root}>
      {deleteModal ? (
        <DeleteModal
          msgId={msgId}
          text={values.text}
          postImg={postImg}
          deleteMsg={deleteMsg}
          handleModal={showDeleteModal}
        />
      ) : null}
      <div
        className={classes.paper}
        onMouseEnter={(e) => {
          setStyle({ display: "block" });
        }}
        onMouseLeave={(e) => {
          setStyle({ display: "none" });
        }}
      >
        <div className={classes.avatar}>
          <Avatar
            alt={values.userName}
            src={values.userImg}
            className={classes.purple}
          />
        </div>

        <div className={classes.chat}>
          <div>
            <h6 className={classes.chatHeading}>{values.userName}</h6>
            <p className={classes.chatTimming}>{time}</p>
          </div>

          <div className={classes.chatText}>
            {values.text.split("\n").map((txt, idx) => (
              <div key={idx}>
                <Anchorme target="_blank" rel="noreferrer noopener">
                  {txt}
                </Anchorme>
              </div>
            ))}
          </div>

          <Grid item xs={12} md={12} style={{ paddingTop: "5px" }}>
            {postImg ? (
              <img
                src={postImg}
                alt="user"
                style={{ height: "30vh", width: "auto", borderRadius: "4px" }}
              />
            ) : null}
          </Grid>

          <div style={{ paddingTop: "5px", display: "flex" }}>
            {numLikes > 0 ? (
              <div style={{ padding: "3px" }}>
                <IconButton
                  component="span"
                  onClick={likeClick}
                  className={classes.countEmojiBtn}
                  style={selectedLike}
                >
                  <AiFillLike />
                  <div style={{ paddingLeft: "2px" }}>{numLikes}</div>
                </IconButton>
              </div>
            ) : null}

            {numFire > 0 ? (
              <div style={{ padding: "3px" }}>
                <IconButton
                  component="span"
                  onClick={fireClick}
                  className={classes.countEmojiBtn}
                  style={selectedFire}
                >
                  <AiFillFire />
                  <div style={{ paddingLeft: "2px" }}>{numFire}</div>
                </IconButton>
              </div>
            ) : null}

            {numHeart > 0 ? (
              <div style={{ padding: "3px" }}>
                <IconButton
                  component="span"
                  onClick={heartClick}
                  className={classes.countEmojiBtn}
                  style={selectedHeart}
                >
                  <AiFillHeart />
                  <div style={{ paddingLeft: "2px" }}>{numHeart}</div>
                </IconButton>
              </div>
            ) : null}
          </div>
        </div>

        <div className={classes.emojiDiv} style={style}>
          <div className={classes.emojiDivInner}>
            <div className={classes.allEmoji}>
              <IconButton
                component="span"
                style={{ padding: "4px" }}
                onClick={likeClick}
              >
                <AiFillLike className={classes.emojiBtn} />
              </IconButton>
              <IconButton
                component="span"
                style={{ padding: "4px" }}
                onClick={fireClick}
              >
                <AiFillFire className={classes.emojiBtn} />
              </IconButton>
              <IconButton
                component="span"
                style={{ padding: "4px" }}
                onClick={heartClick}
              >
                <AiFillHeart className={classes.emojiBtn} />
              </IconButton>
              {uid === messegerUid ? (
                <IconButton
                  component="span"
                  style={{ padding: "4px" }}
                  onClick={showDeleteModal}
                >
                  <AiFillDelete
                    className={classes.emojiBtn}
                    color="#c3c3c3f0"
                  />
                </IconButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
}

export default Messages;
