import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { register } from "../redux/reducers/authReducer";
import Button from "../components/common/Button";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const { username, email, password, password2 } = formData;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state: RootState) => state.auth);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== password2) {
      alert("Passwords do not match");
    } else {
      const userData = {
        username,
        email,
        password,
      };

      dispatch(register(userData))
        .unwrap()
        .then((user: any) => {
          console.log(`Registered new user - ${user.name}`);
          navigate("/");
        })
        .catch((error: string) => console.log(error));
    }
  };

  if (isLoading) {
    return <p>Loading..</p>;
  }

  return (
    <div className="register-page">
      <h1 className="header">Register</h1>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="group">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Username</label>
          </div>
          <div className="group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Email</label>
          </div>
          <div className="group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Password</label>
          </div>
          <div className="group">
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              required
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Confirm Password</label>
          </div>
          <div>
            <Button label="Sign up" />
          </div>
        </form>
      </section>
    </div>
  );
}

export default Register;
