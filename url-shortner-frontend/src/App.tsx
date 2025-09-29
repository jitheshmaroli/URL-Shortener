import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./routes/RoutesConfig";
import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.container}>
        <RoutesConfig />
      </div>
    </Router>
  );
}

export default App;
