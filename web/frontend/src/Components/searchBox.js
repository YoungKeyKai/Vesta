import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, Box, IconButton, InputAdornment } from '@mui/material';

export default function SearchBox(props) {
    return (
        <Box sx={{ margin: 5, display: 'flex', alignItems: 'center', width: 0.4 }} >
            <TextField
                hiddenLabel
                id="filled-hidden-label-normal"
                variant="filled"
                sx={{ backgroundColor: 'white', width: 1 }}
                placeholder={props.placeholder}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton type="submit" aria-label="search" >
                                <SearchIcon sx={{ fill: "blue" }} />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </Box>
    );
}

SearchBox.propTypes = {
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

SearchBox.defaultProps = {
    placeholder: 'Address or Name'
}
