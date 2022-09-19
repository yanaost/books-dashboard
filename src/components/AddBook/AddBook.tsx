import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { Book } from '../../types/Book'

type BookKeys = 'author' | 'title' | 'category';

export const AddBook: React.FC = () => {
  const params = useParams();

  const [book, setBook] = useState<Book>({id: uuidv4(), title: '', author: '', category: ''});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSuccessMessageRead, setIsSuccessMessageRead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState<null | string>(null);
  const [isModeEditing, setIsModeEditing] = useState(false);

  useEffect(() => {
    if (params && params.bookId) {
      setIsLoading(true);
      setIsModeEditing(true);

      const fetchBook = async () => {
        const response = await fetch(`http://localhost:3001/books/${params.bookId}`);
  
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
  
        const responseData = await response.json();
  
        setBook(responseData);
        setIsLoading(false);
      };
  
      fetchBook().catch(error => {
        setIsLoading(false);
        if (error instanceof Error) {
          setHttpError(error.message);
        }
      });
    };
  }, []);

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

  const isNotEmpty = (value: any) => value && value.trim() !== '';
  const isNumber = (value: any) => /^\d+$/.test(value);

  const isFormValid = isNotEmpty(book.title)
    && isNotEmpty(book.author) && isNotEmpty(book.category)
    && isNotEmpty(book.ISBN) && isNumber(book.ISBN);

  const handleSaveButton = async (bookData: Book) => {
    setIsSubmitting(true);
    
    let urlToFetch = 'http://localhost:3001/books';
    let methodFetch = 'POST';

    if (isModeEditing) {
      bookData.edited = moment.utc();
      urlToFetch = `http://localhost:3001/books/${params.bookId}`;
      methodFetch = 'PUT';
    } else {
      bookData.created = moment.utc();
      bookData.active = true;
    };

    await fetch(urlToFetch, {
      method: methodFetch,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData),
    });

    setIsSubmitting(false);
    setIsFormSubmitted(true);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBook(prevState => {
      const newState = {...prevState};
      const key = event.target.name as BookKeys;
      newState[key] = event.target.value;

      return newState;
    })
  };

  if (isSuccessMessageRead) {
    return (<Navigate to='/' /> );
  };
  
  return (
    <>
      {isSubmitting && <p>Saving the book...</p>}

      {<Modal
        open={isFormSubmitted}
        onClose={() => {
          setIsFormSubmitted(false);
          setIsSuccessMessageRead(true);
        }}
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
          >
            You successfuly saved the book
          </Typography>
        </Box>
      </Modal>
      }

      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        textAlign={'center'}
      >
        <FormControl>
          <TextField
            required
            name='title'
            label='Book title'
            helperText={!isNotEmpty(book.title) && 'Text, required'}
            value={book.title}
            onChange={handleOnChange}
          />

          <TextField
            required
            name="author"
            label="Author"
            value={book.author}
            helperText={!isNotEmpty(book.author) && 'Text, required'}
            onChange={handleOnChange}
          />

          <TextField
            sx={{m: 1, minWidth: 120}}
            select
            required 
            name="category"
            label="Category"
            value={book.category}
            helperText={!isNotEmpty(book.category) && 'Text, required'}
            onChange={handleOnChange}
          >
            <MenuItem value={'Fiction'}>Fiction</MenuItem>
            <MenuItem value={'Romance'}>Romance</MenuItem>
            <MenuItem value={'Classics'}>Classics</MenuItem>
            <MenuItem value={'Tragedy'}>Tragedy</MenuItem>
          </TextField>
          
          <TextField
            required
            name='ISBN'
            label='ISBN'
            value={book.ISBN !== undefined ? book.ISBN : ''}
            onChange={handleOnChange}
            helperText={!isNumber(book.ISBN) && 'Number, required'}
          />

          <Button
            variant='contained'
            onClick={() => (handleSaveButton(book))}
            disabled={!isFormValid}
          >
            Save
          </Button>

        </FormControl>
      </Box>
    </>
  );
};
