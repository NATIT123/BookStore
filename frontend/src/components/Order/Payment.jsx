import {
  Col,
  Divider,
  Form,
  Radio,
  Row,
  message,
  notification,
  InputNumber,
} from "antd";
import { DeleteTwoTone, LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { callFetchListBanks, callPayment } from "../../services/api";
import "./Payment.css";
import {
  doDeleteItemCartAction,
  doPlaceOrderAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import { Input } from "antd";
import { callPlaceOrder } from "../../services/api";
const { TextArea } = Input;

const Payment = (props) => {
  const carts = useSelector((state) => state.order.carts);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const user = useSelector((state) => state.account.user);
  const [form] = Form.useForm();
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [initialBanks, setInitialBanks] = useState([]);
  const paymentMethod = Form.useWatch("paymentMethod", form);

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  useEffect(() => {
    const getAllBanks = async () => {
      try {
        const res = await callFetchListBanks();

        if (res.statusCode === 200) {
          setBanks(res.data);
          setInitialBanks(res.data);
        }
      } catch (error) {
        console.log("Error", error);
        toast.error("Error fetching banks:", error);
      }
    };
    getAllBanks();
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      const filteredBanks = banks.filter((bank) =>
        bank.bank_name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setBanks(filteredBanks);
    } else {
      setBanks(initialBanks);
    }
  }, [searchKeyword]);

  const handleChange = (e) => {
    setSelectedBank(e.target.value);
  };

  const handlePaymentVNPAY = async (data) => {
    try {
      const contentPaymentDefault = `Thanh toan don hang ${new Date().toISOString()}`;
      if (!totalPrice || totalPrice <= 0 || !contentPaymentDefault) {
        toast.error("Please provide payment information");
        return;
      }

      const res = await callPayment(data);
      if (res.status === "success") {
        const paymentUrl = res.url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error shopping payment:", error);
    }
  };

  const onFinish = async (values) => {
    setIsSubmit(true);
    const detailOrder = carts.map((item) => {
      return {
        price: item.detail.price,
        quantity: item.quantity,
        bookId: item.detail._id,
        bookName: item.detail.mainText,
      };
    });
    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      orderItems: detailOrder,
    };

    if (values.paymentMethod === "vnpay") {
      if (!selectedBank) {
        toast.error("Vui lòng chọn ngân hàng trước khi tiếp tục.");
        return;
      }
      handlePaymentVNPAY({ ...data, type: "VNPAY" });
      setIsSubmit(true);
    } else {
      setIsSubmit(true);
      // Thanh toán khi nhận hàng
      const res = await callPlaceOrder(data);
      if (res && res.statusCode === 201) {
        message.success("Đặt hàng thành công !");
        dispatch(doPlaceOrderAction());
        props.setCurrentStep(2);
      } else {
        console.log("error", res);
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res.message,
        });
      }
    }
    setIsSubmit(false);
  };

  const handleOnChangeInput = (value, book) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({ quantity: value, detail: book, _id: book._id })
      );
    }
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={16} xs={24}>
        {carts?.map((book, index) => {
          const currentBookPrice = book?.detail?.price ?? 0;
          return (
            <div className="order-book" key={`index-${index}`}>
              <div className="book-content">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    book?.detail?.thumbnail
                  }`}
                />
                <div className="title">{book?.detail?.mainText}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentBookPrice)}
                </div>
              </div>
              <div className="action">
                <div className="quantity">
                  <InputNumber
                    onChange={(value) => handleOnChangeInput(value, book)}
                    value={book?.quantity}
                  />
                </div>
                <div className="sum">
                  Tổng:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentBookPrice * (book?.quantity ?? 0))}
                </div>
                <DeleteTwoTone
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    dispatch(doDeleteItemCartAction({ _id: book._id }))
                  }
                  twoToneColor="#eb2f96"
                />
              </div>
            </div>
          );
        })}
      </Col>
      <Col md={8} xs={24}>
        <div className="order-sum">
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item
              style={{ margin: 0 }}
              labelCol={{ span: 24 }}
              label="Tên người nhận"
              name="name"
              initialValue={user?.name}
              rules={[
                {
                  required: true,
                  message: "Tên người nhận không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ margin: 0 }}
              labelCol={{ span: 24 }}
              label="Số điện thoại"
              name="phone"
              initialValue={user?.phone}
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
                {
                  pattern: /^\d+$/,
                  message: "Chỉ được nhập số!",
                },
              ]}
            >
              <Input
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  e.target.value = onlyNums;
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ margin: 0 }}
              labelCol={{ span: 24 }}
              label="Địa chỉ"
              name="address"
              initialValue={user?.address}
              rules={[
                { required: true, message: "Địa chỉ không được để trống!" },
              ]}
            >
              <TextArea autoFocus rows={4} />
            </Form.Item>
            {paymentMethod === "vnpay" ? (
              <>
                <Form.Item name="bankCode" label="Chọn ngân hàng">
                  <Input
                    placeholder="Tìm ngân hàng..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                </Form.Item>
                <Radio.Group
                  className="bank-list-wrapper"
                  value={selectedBank}
                  onChange={handleChange}
                >
                  <div className="bank-card-grid">
                    {banks.map((bank) => (
                      <Radio
                        value={bank.bank_code}
                        key={bank.bank_code}
                        className="bank-card"
                      >
                        <img src={bank.logo_link} alt={bank.bank_name} />
                        <div>{`${bank.bank_code} - ${bank.bank_name}`}</div>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </>
            ) : (
              <></>
            )}
            <Form.Item
              name="paymentMethod"
              label="Hình thức thanh toán"
              initialValue="cod"
              style={{ marginBottom: 12 }}
            >
              <Radio.Group>
                <Radio value="cod">Thanh toán khi nhận hàng</Radio>
                <Radio value="vnpay">Thanh toán qua VNPay</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>

          <Divider style={{ margin: "5px 0" }} />
          <div className="calculate">
            <span> Tổng tiền</span>
            <span className="sum-final">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <button onClick={() => form.submit()} disabled={isSubmit}>
            {isSubmit && (
              <span>
                <LoadingOutlined /> &nbsp;
              </span>
            )}
            Đặt Hàng ({carts?.length ?? 0})
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default Payment;
