import './App.css'
import { createBrowserRouter,RouterProvider} from 'react-router-dom';
import RootLayout from './RootLayout';
import Home from './Components/home/Home';
import Register from './Components/register/Register';
import Login from './Components/login/Login';
import UserProfile from './Components/user-profiles/UserProfiles';
import RoutingError from './Components/RoutingError';
import UserLoginStore from './context/UserLoginStore';
function App() {
  const browserRouter = createBrowserRouter([
    {
      path : '',
      element : <RootLayout />,
      errorElement : <RoutingError />,
      children : [
        {
          path : '',
          element : <Home />
        },
        {
          path : 'register',
          element : <Register />
        },
        {
          path : 'login',
          element : <Login />
        },
        {
          path:"user-profile",
          element:<UserProfile/>
        }
      ]
    }
  ])
  return (
    <UserLoginStore>
    <div className='main'>
      <RouterProvider router = {browserRouter}/>
    </div>
    </UserLoginStore>
  )
}
export default App;