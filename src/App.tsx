import './App.css';

import { AddBook } from './components/AddBook';
import { Dashboard } from './components/Dashboard';

import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  return (
    <>
      <Paper
        sx={{ top: 0, left: 0, right: 0, height: 50, textAlign: 'center' }}
        elevation={6}
        component={Stack} direction='column' justifyContent='center'
      >
        <header>
        <nav>
            <Button component={NavLink} to='/'>
              Dashboard
            </Button>
            
            <Button component={NavLink} to='/add'>
              Add a book
            </Button>
          </nav>
        </header>
      </Paper>
      
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/add' element={<AddBook />} />
        <Route path='/books/:bookId' element={<AddBook />} />
      </Routes>

      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 50, textAlign: 'center' }}
        component={Stack} direction="column" justifyContent="center"
        elevation={3}
      >
        <footer>
          <Link
            href='https://github.com/yanaost/'
            target='_blank'
          >
            GitHub
          </Link>
        </footer>
      </Paper>
    </>
  );
}

export default App;
