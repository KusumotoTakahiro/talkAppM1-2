import * as React from 'react';
import {
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



const PersonaInfo = ({personaInfo}) => {
  const [visibility, setVisibility] = React.useState(true)
  return (
    <>
      <Card sx={{ width: 500, margin: 'auto', marginTop: '30px' }}>
        <Typography gutterBottom variant="h5" component="div">
          {personaInfo.name}ペルソナ情報
          {
            visibility === true ?
            <IconButton onClick={() => { setVisibility(false) }} >
              <VisibilityIcon /> 
            </IconButton> :
            <IconButton onClick={() => { setVisibility(true) }} >
              <VisibilityOffIcon />
            </IconButton>
          }
        </Typography>
        {
          visibility === false ?
          <></> :
          <CardContent>
            {
              personaInfo.personaInfo === null || personaInfo.personaInfo.length === 0 ?
              <>ペルソナ未抽出</> :
              <TableContainer>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>persona</TableCell>
                      <TableCell>createdAt</TableCell>
                    </TableRow>
                  </TableHead>
                    <TableBody>
                      {personaInfo.personaInfo.map((row) => (
                        <TableRow 
                          key={row.uuid}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row"> {row.persona} </TableCell>
                          <TableCell align="right"> {row.created_at} </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                </Table>
              </TableContainer>
            }
          </CardContent>
        }
      </Card>
    </>
  )
}

export default PersonaInfo;