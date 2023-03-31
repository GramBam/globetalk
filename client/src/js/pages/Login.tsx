import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { login } from "../redux/reducers/authReducer";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

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

    const userData = {
      email,
      password,
    };

    dispatch(login(userData))
      .unwrap()
      .then((user: any) => {
        console.log(`Logged in as ${user.username}`);
        navigate("/");
      })
      .catch((error: string) => console.log(error));
  };

  if (isLoading) {
    return <p>Loading..</p>;
  }

  return (
    <>
      <h1>Login</h1>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div>
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
          <div>
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
          <div>
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
