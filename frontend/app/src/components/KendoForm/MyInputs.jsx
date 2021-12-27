import React from "react";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { login } from "../../reduxActions/userAuth";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";

export const KendoForm = () => {
  const alert = useAlert();
  const history = useHistory();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.userAuth);

  const handleSubmit = (dataItem) => {
    console.log(dataItem);
    dispatch(login(dataItem.userId));
    if (status === "user not found!") {
      alert.show(status);
    }
    history.push("/dashboard");
  };
  const handleSkip = () => {
    history.push("/dashboard");
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement
          style={{
            maxWidth: 300,
          }}
        >
          <fieldset className={"k-form-fieldset"}>
            <div className="mb-3">
              <Field
                type={"password"}
                name={"userId"}
                component={Input}
                label={"User Id"}
              />
            </div>
          </fieldset>
          <div className="k-form-buttons">
            <button
              type={"submit"}
              onSubmit={handleSubmit}
              className="k-button k-primary"
              disabled={!formRenderProps.allowSubmit}
            >
              Login
            </button>
            <button type={"submit"} onClick={handleSkip} className="k-button">
              Skip
            </button>
          </div>
        </FormElement>
      )}
    />
  );
};
