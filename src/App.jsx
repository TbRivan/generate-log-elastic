import "./App.css";
import Chord from "@tombatossals/react-chords/lib/Chord";
import guitar from "@tombatossals/chords-db/lib/guitar.json";

const key = "D";
const chord = guitar.chords[key].find((chord) => chord.suffix === "major");
const instrument = Object.assign(guitar.main, { tunings: guitar.tunings });

function App() {
  const lite = false; // defaults to false if omitted

  return (
    <>
      <div className="container">
        <Chord chord={chord.positions[0]} instrument={instrument} lite={lite} />
        <Chord chord={chord.positions[1]} instrument={instrument} lite={lite} />
        <Chord chord={chord.positions[3]} instrument={instrument} lite={lite} />
      </div>
    </>
  );
}

export default App;
