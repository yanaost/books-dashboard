import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Book } from '../../types/Book'

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

import moment from 'moment';

type Props= {
  book: Book,
  updateActiveness: (id: string, activeness: boolean) => void,
  updateAfterDelete: (id: string) => void,
}

export const BookItem: React.FC<Props> = ({ book, updateActiveness, updateAfterDelete }) => {

  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/books/${book.id}`);
  };

  const handleActivness = async (bookData: Book) => {
    bookData.active = !bookData.active;

    await fetch(`http://localhost:3001/books/${bookData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData),
    });

    updateActiveness(bookData.id, bookData.active);
  };

  const handleDelete = async (bookData: Book) => {
    await fetch(`http://localhost:3001/books/${bookData.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData),
    });

    updateAfterDelete(bookData.id);
  };
  
  return (
    <>
      <TableRow
        key={book.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component='th' scope='row'>
          {book.title}
        </TableCell>

        <TableCell
          align='right'
        >
          {book.author}
        </TableCell>

        <TableCell
          align='right'
        >
          {book.category}
        </TableCell>

        <TableCell
          align='right'
        >
          {book.ISBN}
        </TableCell>

        <TableCell
          align='right'
        >
          {book.created ? moment.utc(book.created).local().format('DD MMMM YYYY, h:mm A') : '--'}
        </TableCell>

        <TableCell
          align='right'
        >
          {book.edited ? moment.utc(book.edited).local().format('DD MMMM YYYY, h:mm A') : '--'}
        </TableCell>

        <TableCell
          align='center'
        >
          <Button onClick={handleEdit}>
            Edit
          </Button>
          
          <Button onClick={() => handleActivness(book)}>
            {book.active ? 'Deactivate' : 'Activate'}
          </Button>

          <Button onClick={() => handleDelete(book)}>
            {book.active ? '' : 'Delete'}
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};
