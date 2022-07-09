import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Market() {
  return (
    <div>
      <p>
        This is the next page!
      </p>

      <Button variant="contained" startIcon={<DeleteIcon />} onClick={() => alert('clicked')}>
        Contained Button
      </Button>
    </div>
  );
}

export default Market;
