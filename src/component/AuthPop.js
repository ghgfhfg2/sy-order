import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getFormatDate } from "../component/CommonFunc";

function AuthPop({ authPopToggle }) {
  const userInfo = useSelector((state) => state.user.currentUser);
  let date = getFormatDate(new Date());
  const [curTime, setCurTime] = useState();
  useEffect(() => {
    const dateFull = setInterval(() => {
      date = getFormatDate(new Date());
      setCurTime(`${date.full_} ${date.hour}:${date.min}:${date.sec}`);
    }, 1000);
    return () => clearInterval(dateFull);
  }, []);

  return (
    <div className="auth_pop">
      <div className="bg" onClick={authPopToggle}></div>
      {userInfo && (
        <div className="auth_card">
          {userInfo.welfare_able === false ? (
            <div className="able_box disable">이용불가</div>
          ) : (
            <div className="able_box able">이용가능</div>
          )}
          <h3>{userInfo.displayName}</h3>
          <div className="info">
            <dl>
              <dt>소속</dt>
              <dd>{userInfo.sosok}</dd>
            </dl>
            <dl>
              <dt>본부</dt>
              <dd>{userInfo.photoURL}</dd>
            </dl>
            {userInfo.welfare_range && (
              <dl>
                <dt>가족복지 대상자</dt>
                <dd>{userInfo.welfare_range}</dd>
              </dl>
            )}
          </div>
          <div className="time">
            {curTime
              ? curTime
              : `${date.full_} ${date.hour}:${date.min}:${date.sec}`}
          </div>
          <div className="logo">
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/sy-order.appspot.com/o/logo.png?alt=media&token=0b253b43-1d2c-4e05-8939-f67561f22134`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthPop;
