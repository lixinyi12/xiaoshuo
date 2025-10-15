import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Category from './page/Category';
import BookShelf from './page/BookShelf';
import RangkingList from './page/RangkingList';

function App() {
  return (
    <>
      <Router>
        <Navbar />
          <Routes>
            <Route path='/' exact Component={Home} />
            <Route path='/Category' Component={Category} />
            <Route path='/RangkingList' Component={RangkingList} />
            <Route path='/BookShelf' Component={BookShelf} />
          </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
