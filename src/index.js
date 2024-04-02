import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import CreatePost from './Pages/CreatePost'
import LeaderboardPage from './Pages/LeaderboardPage';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  defer
} from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import { lightBlue, cyan, orange, green, red, purple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { loadCurrentWinner, loadLeaderboardPage, loadUser, loadUserPosts, loadWinArchive } from './utils';
import Index from './Pages/Index';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: cyan,
    secondary: purple,
    error: red,
    warning: orange,
    info: lightBlue,
    success: green,
  },
  typography: {
    fontSize: 16,
  }
})
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
        loader: async () => {
          let c = await loadCurrentWinner()
          let a = await loadWinArchive()
          if (!c || !a) {
            return redirect('/login')
          }
          
          return new Promise((resolve) => resolve([a, c]))
        },
      },
      {
        path: '/me',
        element: <Profile />,
        loader: async () => {
          return defer({
            user: loadUser(),
            posts: loadUserPosts()
          })
        }
      },
      {
        path: '/post',
        element: <CreatePost />
      },
      {
        path: '/leaderboard',
        element: <LeaderboardPage />,
        loader: async () => {
          return defer({
            data: loadLeaderboardPage(1),
          })
        }
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
