import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useUserContext } from '../../contexts/user-context';

const dateFormat = {year: 'numeric', month: 'short', day: 'numeric'}

export const AccountProfile = (props) => {
  const user = useUserContext();

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            margin: 2,
          }}
        >
          <Typography
            color="textPrimary"
            variant="h5"
          >
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${user.username}`}
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            margin: 2,
          }}
        >
          {
            user.lastLoginTime ? 
              <Typography
                color="textSecondary"
                variant="body2"
                gutterBottom
              >
                {`Last logged in on ${new Date(user.lastLoginTime).toLocaleDateString('en', dateFormat)}`}
              </Typography> : null
          }
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {`Joined on ${new Date(user.dateJoined).toLocaleDateString('en', dateFormat)}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
};
