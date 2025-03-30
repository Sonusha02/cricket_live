import { useState } from "react";
import { useAddDepositMutation, useGetTransactionsQuery } from "../redux/apiSlice";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const { data: transactions } = useGetTransactionsQuery();
  const [addDeposit] = useAddDepositMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("paymentScreenshot", file);

    await addDeposit(formData);
    setAmount("");
    setFile(null);
  };

  return (
    <div>
      <Typography variant="h4">Wallet</Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
        <Button type="submit" variant="contained">Add Money</Button>
      </form>

      <Typography variant="h5">Transaction History</Typography>
      {transactions?.map((tx) => (
        <Card key={tx.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography>Amount: ₹{tx.amount}</Typography>
            <Typography>Status: {tx.status}</Typography>
            <img src={`http://localhost:5000/${tx.paymentScreenshot}`} alt="Receipt" width={100} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Wallet;
