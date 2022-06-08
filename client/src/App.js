import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import NewSub from "./pages/NewSub";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";
import Sub from "./pages/Sub";
import CustomRoute from "./utils/CustomRoute";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <CustomRoute>
                <Login guest />
              </CustomRoute>
            }
          />
          <Route
            path="/register"
            element={
              <CustomRoute>
                <Register guest />
              </CustomRoute>
            }
          />
          <Route
            path="/:user/chat"
            element={
              <CustomRoute>
                <Chat auth />
              </CustomRoute>
            }
          />
          <Route
            path="/about"
            element={
              <CustomRoute>
                <About />
              </CustomRoute>
            }
          />
          <Route
            path="/newSub"
            element={
              <CustomRoute>
                <NewSub auth />
              </CustomRoute>
            }
          />
          <Route
            path="/:subname"
            element={
              <CustomRoute>
                <Sub />
              </CustomRoute>
            }
          />
          <Route
            path="/:subname/newPost"
            element={
              <CustomRoute>
                <NewPost auth />
              </CustomRoute>
            }
          />
          <Route
            path="/:subname/:postuuid"
            element={
              <CustomRoute>
                <SinglePost />
              </CustomRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
