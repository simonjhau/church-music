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

  const now = Date.now();
  const presentIndex = masses.findIndex(
    (mass) => new Date(mass.dateTime).getTime() - now < 0
  );
  const futureMasses = masses.slice(0, presentIndex);
  const previousMasses = masses.slice(presentIndex);

  return (
    <div className="home">
      <h1>Upcoming Masses</h1>
      <br />
      {futureMasses.length > 0 ? (
        futureMasses.map((mass) => {
          return <MassCard key={mass.id} mass={mass}></MassCard>;
        })
      ) : (
        <p>No masses found</p>
      )}

      <hr />
      <h1>Previous Masses</h1>
      <br />
      {previousMasses.length > 0 ? (
        previousMasses.map((mass) => {
          return <MassCard key={mass.id} mass={mass}></MassCard>;
        })
      ) : (
        <p>No masses found</p>
      )}
    </div>
  );
};

export default Home;
