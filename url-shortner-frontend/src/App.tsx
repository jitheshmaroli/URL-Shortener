import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./routes/RoutesConfig";
import styles from "./App.module.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className={styles.container}>
          <RoutesConfig />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
