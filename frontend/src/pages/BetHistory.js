import { useGetUserBetsQuery } from "../redux/apiSlice";
import { Card, CardContent, Typography } from "@mui/material";

const BetHistory = () => {
  const { data: bets, isLoading } = useGetUserBetsQuery();

  if (isLoading) return <Typography>Loading bets...</Typography>;

  return (
    <div>
      <Typography variant="h4">My Bets</Typography>
      {bets?.map((bet) => (
        <Card key={bet.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{bet.matchId}</Typography>
            <Typography>Bet on: {bet.selection}</Typography>
            <Typography>Status: {bet.status}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BetHistory;
