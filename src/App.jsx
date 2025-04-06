import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import Home from './HomePage/Home.jsx';
import Navbar from './HomePage/Navbar.jsx';
import About from './HomePage/navbar/About.jsx';
import Founders from './HomePage/navbar/Founders.jsx';
import Dashboard from './DashboardSTOC/StoreRegPanel/DashboardMain.jsx';
import DashboardStore from './DashboardStore/DashboardStore.jsx';
import STOCLogin from './HomePage/STOCLogin.jsx';
import StoreAccountLogin from './HomePage/StoreLogin.jsx';

function App(){
  return(
    <Router>
      <Main/>
    </Router>
  )
}

function Main() {

  const location = useLocation();
  const showNavbar = ['/','/About','/Founders'].includes(location.pathname);

  return(
      <> 
      {showNavbar && <Navbar/>}
        <Routes>
          <Route path = '/' exact Component={Home}/>
          <Route path = '/About' exact Component={About}/>
          <Route path = '/Founders' exact Component={Founders}/>
          <Route path = '/Dashboard' exact Component={Dashboard}/>
          <Route path = '/STOCLogin' exact Component={STOCLogin}/>
          <Route path = '/StoreLogin' exact Component={StoreAccountLogin}/>
          <Route path = '/DashboardStore' exact Component={DashboardStore}/>
          </Routes>
      </>
  );
}

export default App
