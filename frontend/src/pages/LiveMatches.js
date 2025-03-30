// import { useGetLiveMatchesQuery } from "../redux/apiSlice";
// import { Card, CardContent, Typography, Button } from "@mui/material";

// const LiveMatches = () => {
//   const { data: matches, isLoading } = useGetLiveMatchesQuery();

//   if (isLoading) return <Typography>Loading matches...</Typography>;

//   return (
//     <div>
//       <Typography variant="h4">Live Matches</Typography>
//       {matches?.map((match) => (
//         <Card key={match.id} sx={{ marginBottom: 2 }}>
//           <CardContent>
//             <Typography variant="h6">{match.teamA} vs {match.teamB}</Typography>
//             <Typography>Odds: {match.odds}</Typography>
//             <Button variant="contained" color="primary">Bet Now</Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default LiveMatches;

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const socket = io("http://localhost:5000");

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    socket.on("liveMatches", (data) => setMatches(data));
    return () => socket.off("liveMatches");
  }, []);

  return (
    <div>
      <Typography variant="h4">Live Matches</Typography>
      <Grid container spacing={2}>
        {matches.map((match, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{match.teamA} vs {match.teamB}</Typography>
                <Typography>Score: {match.scoreA} - {match.scoreB}</Typography>
                <Typography>Status: {match.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LiveMatches;
