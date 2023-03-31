import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { register } from "../redux/reducers/authReducer";

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
    <>
      <section className="heading">
        <h1>Register</h1>
        <p>Please create an account</p>
      </section>

      <section>
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Enter a username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
