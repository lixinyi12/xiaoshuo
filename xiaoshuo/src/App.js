import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './page/Home';
import Category from './page/Category';
import BookShelf from './page/BookShelf';
import Person from './page/Person';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import RangkingList from './page/RangkingList';
import ResetPassword from './page/ResetPassword';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlashMessageList from './components/FlashMessage';

function App() {
  return (
    <>
      <Router>
        <Navbar />
          <FlashMessageList />
          <Routes>
            <Route path='/' exact Component={Home} />
            <Route path='/Category' Component={Category} />
            <Route path='/RangkingList' Component={RangkingList} />
            <Route path='/BookShelf' Component={BookShelf} />
            <Route path='/Person' Component={Person} />
            <Route path='/SignIn' Component={SignIn} />
            <Route path='/SignUp' Component={SignUp} />
            <Route path='/ResetPassword' Component={ResetPassword} />
          </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
