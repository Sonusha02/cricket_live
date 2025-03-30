import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const Navbar = () => {
  const { user, balance } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>BetHub</Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        {user ? (
          <>
            <Typography sx={{ marginRight: 2 }}>Balance: ₹{balance}</Typography>
            <Button color="inherit" onClick={() => dispatch(logout())}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
