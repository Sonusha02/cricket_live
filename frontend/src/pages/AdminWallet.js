import { useGetPendingDepositsQuery, useApproveDepositMutation } from "../redux/apiSlice";
import { Button, Typography, Card, CardContent } from "@mui/material";

const AdminWallet = () => {
  const { data: deposits } = useGetPendingDepositsQuery();
  const [approveDeposit] = useApproveDepositMutation();

  const handleApproval = async (id, status) => {
    await approveDeposit({ id, status });
  };

  return (
    <div>
      <Typography variant="h4">Admin Wallet Approval</Typography>
      {deposits?.map((tx) => (
        <Card key={tx.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography>User: {tx.userId.name} ({tx.userId.email})</Typography>
            <Typography>Amount: ₹{tx.amount}</Typography>
            <img src={`http://localhost:5000/${tx.paymentScreenshot}`} alt="Receipt" width={100} />
            <Button onClick={() => handleApproval(tx._id, "approved")} variant="contained" color="success">Approve</Button>
            <Button onClick={() => handleApproval(tx._id, "rejected")} variant="contained" color="error">Reject</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminWallet;
