import { useState } from 'react';
import axios from 'axios';

const postImage = async ({ image, description }) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('description', description);

  const result = await axios.post(
    'http://localhost:5000/api/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return result.data;
};

const Upload = () => {
  const [file, setFile] = useState();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState();

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);

    const result = await postImage({ image: file, description });
    setImage(result.image);
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="Upload">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        ></input>
        <button type="submit">Submit</button>
      </form>
      {image && <img src={image} alt="img" />}
    </div>
  );
};

export default Upload;
