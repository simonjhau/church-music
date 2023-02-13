import "./App.css";

import axios from "axios";
import { useEffect, useState } from "react";

import reactLogo from "./assets/react.svg";

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
