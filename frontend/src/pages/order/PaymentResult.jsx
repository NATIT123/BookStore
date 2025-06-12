import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { callVnPayIpn, callVnPayReturn } from "../../services/api";
import { useAppDispatch } from "../../redux/hooks";
import { doPlaceOrderAction } from "../../redux/order/orderSlice";
const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const queryString = location.search;
    const fetchTransaction = async () => {
      try {
        const res = await callVnPayReturn(queryString);
        const res1 = await callVnPayIpn(queryString);

        if (
          res &&
          res.data.status === "success" &&
          res1 &&
          res1.data.status === "success"
        ) {
          toast.success("🎉 Thanh toán thành công!");
          dispatch(doPlaceOrderAction());
        } else {
          setIsError(true);
          toast.error("⚠️ Không tìm thấy giao dịch.");
        }
      } catch (err) {
        console.log("err", err);
        const errorMessage =
          err?.response?.data?.message || err?.message || "Đã xảy ra lỗi";
        setIsError(true);
        toast.error(`🚨 ${errorMessage}`);
      }
    };

    fetchTransaction();
  }, [location.search]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <img
        src={
          !isError
            ? "https://cdn-icons-png.flaticon.com/512/190/190411.png"
            : "https://cdn-icons-png.flaticon.com/512/753/753345.png"
        }
        alt={`Thanh toán ${!isError ? "thành công`" : "thất bại"}`}
        style={{ width: 100, height: 100, marginBottom: 20 }}
      />
      <h2 style={{ color: "green", marginBottom: 20 }}>
        {`Thanh toán ${!isError ? "thành công`" : "thất bại"}`}
      </h2>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "6px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default PaymentResult;
