import axios from 'axios';
import { useEffect, useState } from 'react';
import MassCard, { MassInterface } from '../components/MassCard/MassCard';

const Home = () => {
  const [masses, setMasses] = useState<MassInterface[]>([]);

  useEffect(() => {
    // Get list of 20 most recent
    axios
      .get(`masses/`)
      .then((res) => {
        setMasses(res.data);
      })
      .catch((e) => console.error(`Get files failed:\n${e}`));
  }, []);

  return (
    <div className="home">
      <h1>Upcoming Masses</h1>
      <br />
      {masses.length > 0 ? (
        masses.map((mass) => {
          return <MassCard key={mass.id} mass={mass}></MassCard>;
        })
      ) : (
        <p>No masses found</p>
      )}
    </div>
  );
};

export default Home;
