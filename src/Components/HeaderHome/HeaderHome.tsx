import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { DispatchType, RootState } from '../../redux/configStore'
import { USER_LOGIN } from '../../utils/config';
import { getBookingLocationApi } from '../../redux/reducers/bookingReducer';
import { history } from "../../index";


export default function HeaderHome() {
  const dispatch: DispatchType = useDispatch();

  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [show, setShow] = useState(false);

  const { userLogin } = useSelector((state: RootState) => state.userReducer);
  const { arrBooking } = useSelector((state: RootState) => state.bookingReducer)

  const address = arrBooking.filter((ele, ind) => ind === arrBooking.findIndex(elem => elem.address === ele.address))
  const renderLogin = () => {
    if (userLogin?.name) {
      return (
        <>
          <li>
            <NavLink className="dropdown-item" to="/profile">
              <i className="bi bi-person-check"></i> Profile: {userLogin.name}
            </NavLink>
          </li>
          <li>
            <NavLink className="dropdown-item" to="/place/new">
              <i className="bi bi-plus-circle-fill"></i> New Place
            </NavLink>
          </li>
          <li>
            <NavLink className="dropdown-item" to="/place/list-rent">
              <i className="bi bi-house-check-fill"></i> Your apartment
            </NavLink>
          </li>
          <li>
            <NavLink className="dropdown-item"
              onClick={() => {
                localStorage.removeItem(USER_LOGIN);
                window.location.href = "/user/login";
              }} to={''}>
              <i className="bi bi-box-arrow-left"></i> Log Out
            </NavLink>
          </li>
        </>
      );
    }
    return (
      <>
        <li>
          <NavLink className="dropdown-item" to="/user/register">
            <i className="bi bi-person-fill-add"></i> Sign Up
          </NavLink>
        </li>
        <li>
          <NavLink className="dropdown-item" to="/user/login">
            <i className="bi bi-person-fill-up"></i> Log In
          </NavLink>
        </li>
      </>
    );
  };
  const renderUser = () => {
    if (userLogin?.name) {
      return (
        <>
          <span>
            <i className="user fa-solid fa-user"></i> {userLogin.name} <i className="bi bi-caret-down-fill"></i>
          </span>
        </>
      )
    }
    return (
      <>
        <i className="bar fa-solid fa-bars"></i>
        <i className="user fa-solid fa-user"></i>
      </>
    );
  }

  const onSearchRoom = async (search: any) => {
    setSearch(search)
    await dispatch(getBookingLocationApi(search));
    history.push(`/list/${search}`);
  }

  const handleClick = () => {
    setIsActive(current => !current);
    if (isActive) {
      setShow(false)
    } else {
      setShow(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <div className='header-layout'>
      <div className="header-page">
        <div className="header-home">
          <NavLink to="/">
            <img src='./img/logonew2.jpg' className='rounded m-1 border border-danger' width='120px' alt="" />
          </NavLink>
        </div>
        <div className="header-center">
          <h6>Stays</h6>
          <h6>Experiences</h6>
          <h6>Online Experiences</h6>
        </div>
        <div className="header-info">
          <div className="left-info">
            <div>TravelDnD Your Home</div>
          </div>
          <div className="center-info">
            <i className="fa fa-globe"></i>
          </div>
          <div className="right-info">
            <li className="nav-item dropdown">
              <NavLink className="nav-link" to="" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                {renderUser()}
              </NavLink>
              <ul className="dropdown-menu list-info">
                {renderLogin()}
                <li><hr /></li>
                <li><NavLink className="dropdown-item" to="">TravelDnD Your Home</NavLink></li>
                <li><NavLink className="dropdown-item" to=""><i className="bi bi-info-circle-fill"></i> Help</NavLink></li>
              </ul>
            </li>
            <div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-search container">
        <form onSubmit={handleSubmit}>
          <div className="form-fill border row">
            <div className="location col-9">
              <h4>Where</h4>
              <div className="destination d-flex">
                <input
                  value={search}
                  onChange={handleChange}
                  placeholder='Search destinations' style={{ height: "32px" }} />
                {show && <button
                  className={isActive ? 'btn p-0 visible' : 'btn p-0'}
                  onClick={() => { setSearch(""); handleClick() }}>
                  <i className="text-danger fs-5 bi bi-x-circle"></i>
                </button>}
              </div>
            </div>
            <div className="add col-3">
              <div className="btn col-5">
                <button type='submit'
                  onClick={() => onSearchRoom(search)}
                >
                  <i className='fa fa-search'></i> Search
                </button>
              </div>
            </div>
          </div>
          {search.length !== 0 && (
            <div className="result-location">
              {address
                .filter((item) => {
                  const searchTerm = search.toString().toLowerCase();
                  const location = item.address.toLowerCase();
                  const province = item.address.substring(item.address.indexOf(",") + 1).trim().toLowerCase()
                  return (
                    searchTerm &&
                    (location.startsWith(searchTerm) || province.startsWith(searchTerm)) &&
                    (location !== searchTerm || province !== searchTerm)
                  );
                }).map((item, index) => (
                  <button
                    onClick={() => { onSearchRoom(item.address); handleClick() }}
                    className={isActive ? 'data-result p-2 invisible' : 'data-result p-2'}
                    key={index}>
                    {item.address}
                  </button>
                ))}
            </div>
          )}
        </form>
      </div >
    </div >
  )
}