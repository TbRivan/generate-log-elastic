import { useEffect } from "react";
import { useTokenStore } from "../../store/tokenStore";
import ButtonSubmit from "../atom/ButtonSubmit";
import TextAreaInput from "../atom/TextAreaInput";
import Cookies from "js-cookie";

function FormToken({ apiURL, mode }) {
  const { token, setToken, checkTokenFromCookie } = useTokenStore();

  useEffect(() => {
    checkTokenFromCookie();
  }, [checkTokenFromCookie]);

  const handleToken = () => {
    if (token) {
      Cookies.set("token", token, { expires: 1 });
    }
  };

  return (
    <div className="form" style={{ marginBottom: 50 }}>
      <h3>{`Running on ${mode} mode`}</h3>
      <h3>{`${apiURL}`}</h3>
      <div className="input-container ic1">
        <TextAreaInput
          value={token}
          onChange={setToken}
          placeholder={"Input Token"}
        />
      </div>
      <ButtonSubmit
        onClick={handleToken}
        style={{ marginTop: 20 }}
        disabled={token === "" ? true : false}
      >
        Set Token
      </ButtonSubmit>
    </div>
  );
}

export default FormToken;
