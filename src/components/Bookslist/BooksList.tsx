import React, { useEffect, useState } from 'react';
import { BookItem } from '../BookItem';

import { Book } from '../../types/Book'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

export const BooksList: React.FC = () => {

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<null | string>(null);
  const [filterValue, setFilterValue] = useState('active');
  const [deleteMessage, setDeleteMessage] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:3001/books');

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const responseData = await response.json();
      setBooks(responseData);
      setIsLoading(false);
    };

    fetchBooks().catch(error => {
      setIsLoading(false);
      if (error instanceof Error) {
        setHttpError(error.message);
      };
    });
  },[]);

  if (isLoading) {
    return (
      <section>Loading...</section>
    );
  };

  if (httpError) {
    return (
      <section>{httpError}</section>
    );
  };
  
  let visibleBooks = books;

  if (filterValue === 'active') {
    visibleBooks = books.filter(book => book.active === true);
  };

  if (filterValue === 'deactivated') {
    visibleBooks = books.filter(book => book.active === false);
  };

  const updateActiveness = (id: string, activeness: boolean) => {
    setBooks(prevBooks => {
      return prevBooks.map(book => {
        const newBook = {...book};
        if (newBook.id === id) {
          newBook.active = activeness;
        }

        return newBook;
      })
    });
  };

  const updateAfterDelete = (id: string) => {
    setBooks(prevBooks => {
      prevBooks.map(book => {
        const newBook = {...book};
        return newBook;
      });
        setDeleteMessage(true);

      return prevBooks.filter(book => book.id !== id);
    })
  };

  return (
    <> 
      {<Modal
        open={deleteMessage}
        onClose={() => (setDeleteMessage(false))}
      >
        <Box
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            backgroundColor: 'primary.main',
          }}
          textAlign={'center'}
          
        >
          <Typography
            id='modal-modal-title'
            variant='h3'
            component='h3'
            height='100'
            color='#e3f2fd'
          >
            You successfuly deleted the book
          </Typography>
        </Box>
      </Modal>
      }
      <Box
        textAlign={'center'}
        mt={5}
        mb={5}
      >
        <Button
          variant={filterValue === 'all' ? 'outlined': 'contained'}
          onClick={() => setFilterValue('all')}
        >
          Show All
        </Button>

        <Button
          variant={filterValue === 'active' ? 'outlined': 'contained'}
          onClick={() => setFilterValue('active')}
        >
          Show Active
        </Button>
        <Button
          variant={filterValue === 'deactivated' ? 'outlined': 'contained'}
          onClick={() => setFilterValue('deactivated')}
        >
          Show Deactivated
        </Button>
      </Box>  
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='books list table'>
          <TableHead>
            <TableRow>
              <TableCell>Book title</TableCell>
              <TableCell align='right'>Author</TableCell>
              <TableCell align='right'>Category</TableCell>
              <TableCell align='right'>ISBN</TableCell>
              <TableCell align='right'>Created At </TableCell>
              <TableCell align='right'>Edited At</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleBooks.map((book) => (
              <BookItem
                book={book}
                key={book.id}
                updateActiveness={updateActiveness}
                updateAfterDelete={updateAfterDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
