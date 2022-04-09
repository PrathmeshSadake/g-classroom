import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProductImgStyle = styled('img')({
  width: '100%',
  height: '150px',
  objectFit: 'cover',
});

export default function ClassroomCard({
  classroom = {
    name: 'SPCC',
    creatorName: 'Prathmesh Sadake',
    id: 'jkn21o4iu21',
  },
}) {
  const { name, creatorName } = classroom;
  const images = [
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760258/edulearn/1_dfdurx.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760257/edulearn/2_sstp9r.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760256/edulearn/3_sxsfdf.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760256/edulearn/4_wrzkoh.jpg',
  ];
  var imageURL = images[Math.floor(Math.random() * images.length)];

  return (
    <Card
      sx={{
        borderRadius: 0,
      }}
    >
      <RouterLink to={`/dashboard/classroom/${classroom.id}`}>
        <Box>
          <ProductImgStyle alt={name} src={classroom.banner} />
        </Box>
      </RouterLink>

      <Container sx={{ py: 2 }}>
        <RouterLink
          to={`/dashboard/classroom/${classroom.id}`}
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
