import { useState, useEffect } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get("/api").then((response: any) => {
      setPost(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Title</h1>
      <h1>{post}</h1>
    </div>
  );
}

export default App;
