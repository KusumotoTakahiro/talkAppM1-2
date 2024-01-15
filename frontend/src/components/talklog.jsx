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


const TalkLog = ({utterances}) => {
  const [visibility, setVisibility] = React.useState(true)
  return (
  <>
    <Card  sx={{ width: 500, margin: 'auto', marginTop: '30px' }}>
      <Typography gutterBottom variant="h5" component="div">
        {utterances.name}会話履歴
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
            utterances.utterances === null || utterances.utterances.length === 0 ?
            <>会話履歴なし</> :
            <TableContainer>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>persona</TableCell>
                    <TableCell>talker</TableCell>
                    <TableCell>createdAt</TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                    {utterances.utterances.map((row) => (
                      <TableRow 
                        key={row.uuid}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row"> {row.content} </TableCell>
                        <TableCell align="right"> {row.talker} </TableCell>
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

export default TalkLog;