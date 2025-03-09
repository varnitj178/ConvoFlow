import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Application from "./Components/Application";
import Chat from "./Components/Chat";
import Login from "./Components/SignUp";
import Home from "./Components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth, db } from "./Firebase/Firebase";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: "#22273b !important",
    height: "100vh",
  },
}));

function App() {
  const classes = useStyles();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🚀 ~ App.js:61 ~ unsubscribe ~ user:", user);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          try {
            await setDoc(userRef, {
              name: user.displayName,
              displayName: user.displayName.split(" ")[0],
              photoURL: user.photoURL,
              email: user.email,
              uid: user.uid,
            });
            console.log("New user created in Firestore");
          } catch (err) {
            console.error("Error creating user:", err);
          }
        }

        setUser(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Router>
        {!user ? (
          <Login />
        ) : (
          <div className={classes.root}>
            <Application uid={user} />
            <main className={classes.content}>
              <div className={classes.toolbar} style={{ minHeight: "50px" }} />
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/channel/:id">
                  <Chat />
                </Route>
              </Switch>
            </main>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;
