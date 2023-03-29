import './App.css';
import Sidebar from './components/Sidebar';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Transactions from './pages/Transaction';
import {  AuthProvider } from "./context/AuthContext";
import Member from './components/Member';
import IssueBooks from './pages/IssueBooks';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Sidebar />
          <Routes>
            <Route exact path="/" element={<Dashboard />}/>
            <Route exact path="/books" element={<Books />}/>
            <Route exact path="/members/member" element={<Member />}/>
            <Route exact path="/members" element={<Members />}/>
            <Route exact path="/transactions" element={<Transactions />}/>
            <Route exact path="/issue_books" element={<IssueBooks />} />
            <Route exact path="/return_books" element={<IssueBooks type={"returnBooks"}/>} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
