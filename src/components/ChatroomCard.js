import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProductImgStyle = styled('img')({
  width: '100%',
  height: '150px',
  objectFit: 'cover',
});

export default function ChatroomCard({
  classroom = {
    name: 'SPCC',
    creatorName: 'Prathmesh Sadake',
    id: 'jkn21o4iu21',
  },
}) {
  const { name, creatorName } = classroom;

  return (
    <Card
      sx={{
        borderRadius: 0,
      }}
    >
      {/* <RouterLink to={`/dashboard/classroom/${classroom.id}`}>
        <Box>
          <ProductImgStyle alt={name} src={classroom.banner} />
        </Box>
      </RouterLink> */}
      <Container sx={{ py: 2 }}>
        <RouterLink
          to={`/dashboard/chats-room/${classroom.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Typography variant='body1' noWrap>
            {name}
          </Typography>
        </RouterLink>
        <Typography component='span' variant='subtitle2'>
          {creatorName}
        </Typography>
      </Container>
    </Card>
  );
}
