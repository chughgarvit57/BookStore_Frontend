import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/SIgnup";
import PrivateRoutes from "./routes/PrivateRoutes";
import Home from "../src/pages/Home/Home";
import AppLayout from "./components/Layout/AppLayout";
import BookDetails from "./pages/Details/BookDetails";
import Cart from "./pages/Cart/Cart";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/book/details/:id" element={<BookDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
