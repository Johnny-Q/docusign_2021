import "./App.css";
import { Suspense } from "react";
import Navbar, { DefaultNavbar } from "./components/Navbar";
import { Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LogOut from "./pages/LogOut";
import Test from "./pages/Test";

function App() {
    return (
        //style is to center
        <div className="App" style={{ width: "90%", maxWidth: "1000px", position: "absolute", left: "50%", transform: "translate(-50%, 0)" }}>
            <Suspense fallback={DefaultNavbar}>
                <Navbar />
            </Suspense>
            <Route path="/" exact component={Home} />
            <Route path="/about" exact component={About} />
            <Route path= "/login" exact component={LogIn} />
            <Route path="/register" exact component={Register} />
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/logout" exact component={LogOut} />
            <Route path="/test" exact component={Test}/>
        </div>
    );
}

export default App;
