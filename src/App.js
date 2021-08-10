import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route } from "react-router";
import Test from "./pages/Test";
function App() {
    return (
        //style is to center
        <div className="App" style={{ width: "90%", maxWidth: "1000px", position: "absolute", left: "50%", transform: "translate(-50%, 0)" }}>
            <Navbar />
            <Route path="/test" exact component={Test}/>
        </div>
    );
}

export default App;
