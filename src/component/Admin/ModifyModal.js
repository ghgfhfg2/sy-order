import React, { useState, useEffect } from "react";
import { Button, Checkbox, Switch, TimePicker } from "antd";
import firebase from "../../firebase";
import styled from "styled-components";
import uuid from "react-uuid";
import moment from "moment";
export const FileLabel2 = styled.label`
  display: flex;
  width: 60px;
  height: 60px;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
  }
`;
export const ModalPopup = styled.div`
  width: 100%;
  max-width: 350px;
  padding: 20px;
  border: 1px solid #ddd;
  position: absolute;
  z-index: 100;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -100%);
  left: ${(props) => props.posx}px;
  top: ${(props) => props.posy}px;
  @media all and (max-width: 640px) {
    width: 80%;
    max-width: 400px;
    left: 50%;
    transform: translate(-50%, -100%);
  }
`;
function ModifyModal({ puid, pimg, onFinished, posx, posy }) {
  const [radioValue, setradioValue] = useState();
  const [radioValue2, setradioValue2] = useState();
  const [ProdItem, setProdItem] = useState([]);

  const [Soldout, setSoldout] = useState();
  const SoldoutToggle = () => {
    setSoldout(!Soldout);
  };

  const [Hidden, setHidden] = useState();
  function onChange4(e) {
    setHidden(e.target.checked);
  }

  const [GuestHidden, setGuestHidden] = useState();
  function onChange5(e) {
    setGuestHidden(e.target.checked);
  }

  const [AddCheck, setAddCheck] = useState();
  function onChange(checkedValues) {
    setAddCheck(checkedValues);
  }
  const [MilkCheck, setMilkCheck] = useState();
  function onChange2(checkedValues) {
    setMilkCheck(checkedValues);
  }

  const [saleTimeState, setSaleTimeState] = useState();
  const [saleTimeState2, setSaleTimeState2] = useState();

  useEffect(() => {
    firebase
      .database()
      .ref("products")
      .child(puid)
      .on("value", (snapshot) => {
        setProdItem(snapshot.val());
        setradioValue(snapshot.val().category);
        setradioValue2(snapshot.val().hot);
        setSoldout(snapshot.val().soldout);
        setHidden(snapshot.val().hidden);
        setGuestHidden(snapshot.val().guest_hidden);
        setMilkCheck(snapshot.val().milk);
        setAddCheck(snapshot.val().add);
        if (snapshot.val().time_sale) {
          snapshot.val().time_sale[0] &&
            setSaleTimeState(snapshot.val().time_sale[0]);
          snapshot.val().time_sale[1] &&
            setSaleTimeState2(snapshot.val().time_sale[1]);
        }
      });
    return () => {
      firebase.database().ref("products").child(puid).off();
    };
  }, [puid]);

  //판매시간
  const [saleTime, setSaleTime] = useState();
  const [saleTime2, setSaleTime2] = useState();
  const onSaleTime = (time, timestring) => {
    setSaleTime(timestring);
  };
  const onSaleTime2 = (time, timestring) => {
    setSaleTime2(timestring);
  };

  const onSubmitProd2 = async (e) => {
    e.preventDefault();
    let time_sale = [];
    if (saleTime?.join("")) time_sale.push(saleTime);
    if (saleTime2?.join("")) time_sale.push(saleTime2);
    let values = {
      name: e.target.name.value,
      option: e.target.option.value,
      price: e.target.price.value,
      kal: e.target.kal.value,
      category: e.target.category.value,
      hot: e.target.hot.value,
      limit: e.target.limit.value,
      add: AddCheck ? AddCheck : null,
      milk: MilkCheck ? MilkCheck : null,
      limit: LimitCheck ? LimitCheck : false,
      sort_num: e.target.sort_num.value
        ? parseInt(e.target.sort_num.value)
        : 9999,
      soldout: Soldout ? Soldout : false,
      hidden: Hidden ? Hidden : false,
      guest_hidden: GuestHidden ? GuestHidden : false,
      time_sale: time_sale.length > 0 ? time_sale : null,
    };
    if (isNaN(values.price)) {
      alert("가격은 숫자만 입력해 주세요");
      return;
    }
    if (ImgFile2) {
      var file = ImgFile2;
      var metadata = ImgFile2.type;
    }
    try {
      if (ImgFile2) {
        let uploadTaskSnapshot = await firebase
          .storage()
          .ref("products")
          .child(`prod_image/${uuid()}`)
          .put(file, metadata);
        let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
        await firebase
          .database()
          .ref("products")
          .child(puid)
          .update({
            ...values,
            image: downloadURL,
          });
      } else {
        let downloadURL = pimg;
        await firebase
          .database()
          .ref("products")
          .child(puid)
          .update({
            ...values,
            image: downloadURL,
          });
      }
      alert("상품을 수정했습니다.");
      onFinished();
    } catch (error) {
      alert(error);
    }
  };

  const [ImgFile2, setImgFile2] = useState();
  const [ProdImg2, setProdImg2] = useState();
  const handleChange2 = (e) => {
    setImgFile2(e.target.files[0]);
    let reader = new FileReader();
    reader.onload = function (event) {
      setProdImg2(event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setProdImg2(e.target.files[0]);
  };

  const radioChange = (e) => {
    setradioValue(e.target.value);
  };
  const radioChange2 = (e) => {
    setradioValue2(e.target.value);
  };

  const [LimitCheck, setLimitCheck] = useState();
  function onChange3(e) {
    setLimitCheck(e.target.checked);
  }

  const onCancel = () => {
    onFinished();
  };
  if (ProdItem) {
    return (
      <>
        <ModalPopup posx={posx} posy={posy}>
          <form className="admin-modify-form" onSubmit={onSubmitProd2}>
            <div className="input-box">
              <input
                style={{ display: "none" }}
                type="file"
                id="imgFile2"
                onChange={handleChange2}
              />
              <FileLabel2 htmlFor="imgFile2" style={{ marginRight: "5px" }}>
                {ProdImg2 && <img src={`${ProdImg2}`} alt="" />}
                {!ProdImg2 && <img src={`${ProdItem.image}`} alt="" />}
              </FileLabel2>
            </div>
            <div className="input-box">
              <input
                type="radio"
                id="hot1"
                name="hot"
                value="hot & ice"
                checked={radioValue2 === "hot & ice"}
                onChange={radioChange2}
              />
              <label htmlFor="hot1">hot & ice</label>
              <input
                type="radio"
                id="hot2"
                name="hot"
                value="hot only"
                checked={radioValue2 === "hot only"}
                onChange={radioChange2}
              />
              <label htmlFor="hot2">hot only</label>
              <input
                type="radio"
                id="hot3"
                name="hot"
                value="ice only"
                checked={radioValue2 === "ice only"}
                onChange={radioChange2}
              />
              <label htmlFor="hot3">ice only</label>
              <input
                type="radio"
                id="hot4"
                name="hot"
                value="etc"
                checked={radioValue2 === "etc"}
                onChange={radioChange2}
              />
              <label htmlFor="hot4">etc</label>
            </div>
            <div className="input-box">
              <input
                type="radio"
                id="cate1"
                name="category"
                value="커피"
                checked={radioValue === "커피"}
                onChange={radioChange}
              />
              <label htmlFor="cate1">커피</label>
              <input
                type="radio"
                id="cate2"
                name="category"
                value="라떼"
                checked={radioValue === "라떼"}
                onChange={radioChange}
              />
              <label htmlFor="cate2">라떼</label>
              <input
                type="radio"
                id="cate3"
                name="category"
                value="에이드"
                checked={radioValue === "에이드"}
                onChange={radioChange}
              />
              <label htmlFor="cate3">에이드</label>
              <input
                type="radio"
                id="cate4"
                name="category"
                value="차"
                checked={radioValue === "차"}
                onChange={radioChange}
              />
              <label htmlFor="cate4">차</label>
              <input
                type="radio"
                id="cate5"
                name="category"
                value="프로틴"
                checked={radioValue === "프로틴"}
                onChange={radioChange}
              />
              <label htmlFor="cate5">에이드</label>
              <input
                type="radio"
                id="cate6"
                name="category"
                value="스낵"
                checked={radioValue === "스낵"}
                onChange={radioChange}
              />
              <label htmlFor="cate6">스낵</label>
              <input
                type="radio"
                id="cate7"
                name="category"
                value="셀프"
                checked={radioValue === "셀프"}
                onChange={radioChange}
              />
              <label htmlFor="cate7">셀프</label>
            </div>
            <div className="input-box">
              <label className="tit" htmlFor="_name">
                이름
              </label>
              <input
                type="text"
                id="_name"
                name="name"
                defaultValue={ProdItem.name}
              />
            </div>
            <div className="input-box">
              <label className="tit" htmlFor="_option">
                옵션
              </label>
              <input
                type="text"
                id="_option"
                name="option"
                defaultValue={ProdItem.option}
              />
            </div>
            <div className="input-box">
              <label className="tit" htmlFor="_price">
                가격
              </label>
              <input
                type="text"
                id="_price"
                name="price"
                defaultValue={ProdItem.price}
              />
            </div>
            <div className="input-box">
              <label className="tit" htmlFor="_kal">
                칼로리
              </label>
              <input
                type="text"
                id="_kal"
                name="kal"
                defaultValue={ProdItem.kal}
              />
            </div>
            <div className="input-box">
              <label className="tit" htmlFor="_sort_num">
                순서
              </label>
              <input
                type="text"
                id="_sort_num"
                name="sort_num"
                defaultValue={ProdItem.sort_num ? ProdItem.sort_num : ""}
              />
            </div>
            <div className="input-box">
              <Checkbox
                id="_limit"
                name="limit"
                onChange={onChange3}
                value={LimitCheck}
                style={{ marginRight: "8px" }}
              />
              <label className="tit" htmlFor="_limit">
                제한
              </label>
              <Checkbox
                id="hidden"
                name="hidden"
                onChange={onChange4}
                checked={Hidden ? true : false}
                style={{ marginRight: "8px" }}
              />
              <label className="tit" htmlFor="hidden">
                숨김
              </label>
              <Checkbox
                id="guest_hidden"
                name="guest_hidden"
                onChange={onChange5}
                checked={GuestHidden ? true : false}
                style={{ marginRight: "8px" }}
              />
              <label
                className="tit"
                htmlFor="guest_hidden"
                style={{ width: "auto" }}
              >
                손님제외
              </label>
            </div>
            <Checkbox.Group onChange={onChange} value={AddCheck}>
              {/* <Checkbox value="버블" style={{ lineHeight: "32px" }}>
                버블
              </Checkbox> */}
              <Checkbox value="샷" style={{ lineHeight: "32px" }}>
                샷
              </Checkbox>
              <Checkbox value="연하게" style={{ lineHeight: "32px" }}>
                연하게
              </Checkbox>
            </Checkbox.Group>
            <Checkbox.Group onChange={onChange2} value={MilkCheck}>
              <Checkbox value="우유" style={{ lineHeight: "32px" }}>
                우유
              </Checkbox>
            </Checkbox.Group>
            <div style={{ marginBottom: "7px" }}>
              {saleTimeState && (
                <TimePicker.RangePicker
                  style={{ marginBottom: "5px" }}
                  defaultValue={[
                    moment(`${saleTimeState[0]}`, "HH:mm:ss"),
                    moment(`${saleTimeState[1]}`, "HH:mm:ss"),
                  ]}
                  onChange={onSaleTime}
                  placeholder={["주문시작", "주문종료"]}
                />
              )}
              {saleTimeState2 && (
                <TimePicker.RangePicker
                  style={{ marginBottom: "5px" }}
                  defaultValue={[
                    moment(`${saleTimeState2[0]}`, "HH:mm:ss"),
                    moment(`${saleTimeState2[1]}`, "HH:mm:ss"),
                  ]}
                  onChange={onSaleTime2}
                  placeholder={["주문시작", "주문종료"]}
                />
              )}

              {!saleTimeState && (
                <>
                  <TimePicker.RangePicker
                    style={{ marginBottom: "5px" }}
                    onChange={onSaleTime}
                    placeholder={["주문시작", "주문종료"]}
                  />
                </>
              )}
              {!saleTimeState2 && (
                <>
                  <TimePicker.RangePicker
                    onChange={onSaleTime2}
                    placeholder={["주문시작", "주문종료"]}
                  />
                </>
              )}
            </div>
            {(Soldout === true || Soldout === "") && (
              <Switch
                style={{ width: "60px" }}
                onChange={SoldoutToggle}
                checkedChildren="판매"
                unCheckedChildren="품절"
                defaultChecked
              />
            )}
            {Soldout === undefined && (
              <Switch
                style={{ width: "60px" }}
                onChange={SoldoutToggle}
                checkedChildren="판매"
                unCheckedChildren="품절"
              />
            )}
            <div className="btn-box">
              <Button
                htmlType="submit"
                type="primary"
                style={{ marginRight: "7px" }}
              >
                수정하기
              </Button>
              <Button onClick={onCancel} type="default">
                취소
              </Button>
            </div>
          </form>
        </ModalPopup>
      </>
    );
  }
}

export default ModifyModal;
