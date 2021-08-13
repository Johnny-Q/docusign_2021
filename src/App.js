import "./App.css";
import { Suspense } from "react";
import Navbar, { DefaultNavbar } from "./components/Navbar";
import { Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewAudit from "./pages/NewAudit";
import ReviewMap from "./pages/ReviewMap";
import EditMap from "./pages/EditMap";
import ViewMap from "./pages/ViewMap";
import LogOut from "./pages/LogOut";
import OAuthHandler from "./pages/OAuthHandler";
// import GraphicsPopupTest from "./pages/GraphicsPopupTest";
import Test from "./pages/Test";

function App() {
  return (
    //style is to center
    <div
      className="App"
      style={{
        width: "90%",
        maxWidth: "1000px",
        position: "absolute",
        left: "50%",
        transform: "translate(-50%, 0)"
      }}
    >
      <Suspense fallback={DefaultNavbar}>
        <Navbar />
      </Suspense>
      <Route path="/" exact component={Home} />
      <Route path="/about" exact component={About} />
      <Route path="/login" exact component={LogIn} />
      <Route path="/register" exact component={Register} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/newaudit" exact component={NewAudit} />
      <Route path="/reviewmap/:id" children={<ReviewMap />} />
      <Route path="/editmap/:id" children={<EditMap />} />
      <Route path="/viewmap/:id" children={<ViewMap />} />
      <Route path="/logout" exact component={LogOut} />
      {/* <Route path="/test" exact component={Test} /> */}
      <Route path="/oauth/docusign_redirect" component={OAuthHandler} />
    </div>
  );
}

export default App;
