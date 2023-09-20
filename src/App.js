import SidePanel from './components/Sidepanel';
import {Route,createBrowserRouter,RouterProvider,createRoutesFromElements} from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Calender from './pages/Calender';

const router = createBrowserRouter(
  createRoutesFromElements (
    <Route path = {"/"} element ={<RootLayout/>}>
        <Route index element = {<Home/>}/>
        <Route path ="Calender" element = {<Calender/>}/>
    </Route>
  )
)



function App() {
  return (
    <RouterProvider router = {router}/>
  );
}

export default App;
