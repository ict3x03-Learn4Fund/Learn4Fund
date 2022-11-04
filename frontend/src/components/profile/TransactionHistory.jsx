import React, { Fragment, useEffect, useState } from "react";
import paymentsService from "../../services/payment";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../features/user/userActions";
import { toast } from "react-toastify";

function TransactionHistory() {
  const [transactions, setTransaction] = useState([]);
  const { userInfo, userId } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const retrieveTransactions = () => {
    paymentsService.getTransactions(userInfo.id).then((response) => {
      if (response.status == 200) {
        console.log(response.data);
        setTransaction(response.data.reverse());
      }
    });
  };

  useEffect(() => {
    if (userInfo) dispatch(getUserDetails());
    window.scrollTo(0, 0);

    if (!userInfo) toast.error("Please login to view cart");
  }, []);

  useEffect(() => {
    retrieveTransactions();
  }, setTransaction);

  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start overflow-y-auto">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        Transaction History
      </span>
      <p className="flex w-full">View previous purchases and payments</p>
      <span className="h-[2px] bg-[black] w-full my-2" />

      <div className="flex overflow-x-auto w-full ">
        <table className="table w-full">
          {/* <!-- head --> */}
          <thead>
            <tr>
              <th>Items Purchased</th>
              <th>Date</th>
              <th>Quantity</th>
              <th>Total price</th>
              <th>Payment type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length != 0 ? (
              transactions.map((transaction, index) => {
                return (
                  <Fragment>
                    <tr className="font-semibold">
                      <td >{transaction.checkedOutCart.length} Course(s)</td>
                      <td>{transaction.createdAt.toString().split("T")[0]}</td>
                      <td>
                        {transaction.checkedOutCart.reduce(
                          (partialSum, a) => partialSum + a.cartItem.quantity,
                          0
                        )}
                      </td>
                      <td>${transaction.totalAmount}</td>
                      <td>
                        {transaction.cardType} ****{" "}
                        {transaction.last4No}
                      </td>
                    </tr>
                    {transaction.checkedOutCart.map((cart, index) => {
                      return (<tr>
                        <td>&nbsp;&nbsp;{cart.cartItem.courseName}</td>
                        <td></td>
                        <td>{cart.cartItem.quantity}</td>
                        <td>${cart.cartItem.totalPrice}</td>
                        <td></td>
                      </tr>);
                    })}
                    {
                      transaction.donationAmount != null && (<tr>
                        <td>
                          &nbsp;&nbsp;Donations Made:
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                          ${transaction.donationAmount.toFixed(2)}
                        </td>
                        <td></td>
                      </tr>)
                    }

                  </Fragment>
                );
              })
            ) : (
              <div className="flex-row flex-nowrap w-full space-y-2 p-2 ">
                <div className="flex w-full justify-center">
                  No recent transaction history
                </div>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory;
